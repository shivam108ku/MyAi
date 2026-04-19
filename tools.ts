import { tool } from "@langchain/core/tools";
import z from "zod/v3";

export const createEventTool = tool(
  async () => {
    return "The meeting has been created";
  },
  {
    name: "create-events",
    description: "Call to the calendar events",
    schema: z.object({}),
  }
);