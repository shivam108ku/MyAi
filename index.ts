import { ChatDeepSeek } from "@langchain/deepseek";
import { createEventTool, getEventsTool } from "./tools";

const tools: any = [createEventTool, getEventsTool];

const model = new ChatDeepSeek({
  model: "deepseek-chat",
  temperature: 0,
}).bindTools(tools);
