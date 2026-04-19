import { ChatDeepSeek } from "@langchain/deepseek";

const tools: any = [];

const model = new ChatDeepSeek({
  model: "deepseek-chat",
  temperature: 0,
}).bindTools(tools);
