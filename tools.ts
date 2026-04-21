import { tool } from "@langchain/core/tools";
import { google } from "googleapis";
import z from "zod/v3";
import tokens from "./tokens.json";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL,
);

oauth2Client.setCredentials(tokens);

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export const getEventsTool = tool(
  async () => {
    try {
      const res = await calendar.events.list({
        calendarId: "shivam108ku@gmail.com",
      });
      console.log("response -->", res.data.items);
    } catch (err) {
      console.log("Error", err);
    }

    return JSON.stringify([
      {
        title: "Met3eing with me",
        date: "9th Aug 2025",
        time: "2 PM",
        location: "Gmeet",
      },
    ]);
  },
  {
    name: "get-events",
    description: "Call to create the calendar events",
    schema: z.object({}),
  },
);

export const createEventTool = tool(
  async () => {
    return "The meeting has been created";
  },
  {
    name: "create-events",
    description: "Call to the calendar events",
    schema: z.object({}),
  },
);
