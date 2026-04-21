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
  async (params) => {

    const {q, timeMin, timeMax} = params;

    try {
      const res = await calendar.events.list({
        calendarId: "primary",
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
    description: "Call to get the calendar events",
    schema: z.object({
      q:z
       .string()
       .describe(
        "The query to be used to get events from google calendar. It can be one of these values: summary, description,location, attendees display name, attendees email, organiser's name, organiser's email",
       ),
       timeMin: z.string().describe("The from datetime in UTC format for the event"),
       timeMax: z.string().describe("The to datetime in UTC format for the event"),
    }),
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
