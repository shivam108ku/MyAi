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

async function callModel(state: typeof MessagesAnnotation.State) {
  console.log("Calling the llm");
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

const toolNode = new ToolNode(tools);

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;

  if (lastMessage.tool_calls?.length) {
    return "tools";
  }

  return "__end__";
}

const graph = new StateGraph(MessagesAnnotation)
  .addNode("assistant", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "assistant")
  .addEdge("tools", "assistant")
  .addConditionalEdges("assistant", shouldContinue, {
    __end__: END,
    tools: "tools",
  });

const app = graph.compile();

async function main() {
  const now = new Date().toISOString();

  const result = await app.invoke({
    messages: [
      {
        role: "system",
        content: `You are a helpful calendar assistant.
Current datetime: ${now}
Default timezone: Asia/Kolkata.

Important rules:
- Do not ask the user for timezone unless they explicitly ask to use another timezone.
- Assume all relative dates like "today", "tomorrow", "this week" are in Asia/Kolkata.
- When the user asks to check meetings/events/calendar, use the appropriate tool.
- For "today", compute timeMin as the start of today and timeMax as the end of today in Asia/Kolkata timezone.`,
      },
      {
        role: "user",
        content: "Do i have any metting today check in my calendar data",
      },
    ],
  });

  console.log("Ai", result.messages[result.messages.length - 1]?.content);
}

main();