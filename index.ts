import { ChatDeepSeek } from "@langchain/deepseek";
import { createEventTool, getEventsTool } from "./tools";
import { END, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import type { AIMessage } from "@langchain/core/messages";

const tools: any = [createEventTool, getEventsTool];

const model = new ChatDeepSeek({
  model: "deepseek-chat",
  temperature: 0,
}).bindTools(tools);

// Assitant Node

async function callModel(state: typeof MessagesAnnotation.State ) {
  console.log("Calling the llm");
  const response = await model.invoke(state.messages);
  console.log("Response", response);
  return { messages: response };
}


// Tool Node
const toolNode = new ToolNode(tools);

// Build The Graph

function shouldContinue(state: typeof MessagesAnnotation.State ) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
  console.log("lastMessage", lastMessage);

  if (lastMessage.tool_calls?.length) {
    return "tools";
  }

  return '__end__';
}

const graph = new StateGraph(MessagesAnnotation)
  .addNode("assistant", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "assistant")
  .addConditionalEdges("assistant", shouldContinue, {
    "__end__": END,
    tools: "tools",
  })
 