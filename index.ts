import { ChatDeepSeek } from "@langchain/deepseek";
import { createEventTool, getEventsTool } from "./tools";
import {
  END,
  MemorySaver,
  MessagesAnnotation,
  StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import type { AIMessage } from "@langchain/core/messages";
import readline from "node:readline/promises";
import { threadId } from "node:worker_threads";

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

const checkpointer = new MemorySaver();

const app = graph.compile({checkpointer});

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let config = {configurable: {thread_id: '1'}}

  while (true) {
    const userInput = await rl.question("You: ");
    if (userInput === "/bye") {
      break;
    }
    const now = new Date().toLocaleString("sv-SE").replace(" ","T");
    const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone

    const result = await app.invoke({
      messages: [
        {
          role: "system",
          content: `You are a smart personal assitant 
                    Current datetime: ${now} 
                    Current timezone string: ${timeZoneString}`,
        },
        {
          role: "user",
          // content: "can you create a meeting with Atik(rku7693@gmail.com) today at 2PM about game? ",
          content: userInput,
        },
      ],
    },
    config
  );

    console.log("Ai: ", result.messages[result.messages.length - 1]?.content);
  }
  rl.close();
}

main();
