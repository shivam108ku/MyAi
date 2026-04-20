import express from "express";
import {google} from "googleapis" 

const app = express();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope, you can pass it as a string
  scope: scopes
});

app.get('/auth', (req , res)=>{

    // generate link
    const link = '';
    res.redirect(link)

})

app.get('/callback', (req , res)=>{

    // generate link
     const code = req.query.code;


     res.send("Connected you can close the tab now");

})