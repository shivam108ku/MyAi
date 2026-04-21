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

type Params = {
  q: string;
  timeMin: string;
  timeMax: string;
};

export const getEventsTool = tool(
  async (params) => {
    console.log("Params", params)
    const { q, timeMin, timeMax } = params as Params;

    try {
      const response = await calendar.events.list({
        calendarId: "primary",
        q: q,
        timeMin,
        timeMax,
      });
      console.log("response", response.data.items);

     const result = response.data.items?.map((event) => {
                return {
                    id: event.id,
                    summary: event.summary,
                    status: event.status,
                    organiser: event.organizer,
                    start: event.start,
                    end: event.end,
                    attendees: event.attendees,
                    meetingLink: event.hangoutLink,
                    eventType: event.eventType,
                };
            });

       console.log("result-->", result);
    } catch (err) {
      console.log("Error", err);
    }

    return JSON.stringify([
      {
        title: "Meeting with me",
        date: "9th Aug 2025",
        time: "2 PM",
        location: "Gmeet",
      },
    ]);
  },
  {
    name: "get-events",
    description: "Call to get the calendar events.",
    schema: z.object({
      q: z
        .string()
        .describe(
          "The query to be used to get events from google calendar. It can be one of these values: summary, description, location, attendees display name, attendees email, organiser's name, organiser's email",
        ),
      timeMin: z
        .string()
        .describe("The from datetime to get event"),
      timeMax: z
        .string()
        .describe("The to datetime in to get event"),
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
