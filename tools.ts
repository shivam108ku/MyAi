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



type attendee = {
  email: string;
  displayName: string;
};

type Eventdata = {
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: [];
};

export const getEventsTool = tool(
  async (params) => {
    const { q, timeMin, timeMax } = params as Params;

    try {
      const response = await calendar.events.list({
        calendarId: "primary",
        q: q,
        timeMin,
        timeMax,
      });

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
      return JSON.stringify(result);
    } catch (err) {
      console.log("Error", err);
    }
    return "Failed to connect your calendar";
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
      timeMin: z.string().describe("The from datetime to get event"),
      timeMax: z.string().describe("The to datetime in to get event"),
    }),
  },
);

export const createEventTool = tool(
  async (eventData) => {
    console.log("eventdata-->",eventData)
    const  { summary, start, end, attendees } = eventData as Eventdata;

    const response = await calendar.events.insert({
      calendarId: "primary",
      sendUpdates: "all",
      conferenceDataVersion: 1,
      requestBody: {
        summary ,
        start ,
        end ,
        attendees ,
        conferenceData: {
          createRequest: {
            requestId: crypto.randomUUID(),
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            }
          }
        }
      },
    });

    if(response.statusText === 'OK'){
      return "The meeting has been created";
    }
    return "Meeting is not  created";
    
  },
  {
    name: "create-events",
    description: "Call to the calendar events",
    schema:'',
  }
);
