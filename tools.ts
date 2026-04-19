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

export const getEventsTool = tool(
  async () => {
    return JSON.stringify([
        {
            title: 'Met3eing with me',
            date: '9th Aug 2025',
            time: '2 PM',
            location: 'Gmeet',
        },
    
    ])
  },
  {
    name: 'get-events',
    description: 'Call to create the calendar events',
    schema: z.object({}),
  }
);