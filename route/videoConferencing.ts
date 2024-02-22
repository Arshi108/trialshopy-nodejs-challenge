import path from "path";
import express, { Request, Response } from "express";
import axios, { AxiosRequestConfig } from "axios";

const app = express();
const port: number = 3002

// I am using WebRTC (Google's protocal) with NodeJS for video streaming (conferencing) this is only backend code 

// we have to pass these secret key's for authentication

const METERED_SECRET_KEY='';
const METERED_DOMAIN='';

// Check if METERED_SECRET_KEY is specified, otherwise throwing an error.
if (!METERED_SECRET_KEY) {
  throw new Error("Please specify the METERED_SECRET_KEY.");
}

// Serving static files in the public folder
app.use("/", express.static(path.join(__dirname, "/public")));

app.get("/validate-meeting", (req: Request, res: Response) => {
  /**
   * Using the Metered Get Room API to check if the
   * Specified Meeting ID is valid.
   * https://www.metered.ca/docs/rest-api/get-room-api
   */
  const options: AxiosRequestConfig = {
    method: "GET",
    url: `https://${METERED_DOMAIN}/api/v1/room/${req.query.meetingId}`,
    params: {
      secretKey: METERED_SECRET_KEY,
    },
    headers: {
      Accept: "application/json",
    },
  };

  axios
    .request(options)
    .then((response) => {
      console.log(response.data);
      res.send({
        success: true,
      });
    })
    .catch((error) => {
      console.error(error);
      res.send({
        success: false,
      });
    });
});

app.post("/create-meeting-room", (req: Request, res: Response) => {
  /**
   * Using the Metered Create Room API to create a new
   * Meeting Room.
   * https://www.metered.ca/docs/rest-api/create-room-api
   */
  const options: AxiosRequestConfig = {
    method: "POST",
    url: `https://${METERED_DOMAIN}/api/v1/room/`,
    params: {
      secretKey: METERED_SECRET_KEY,
    },
    headers: {
      Accept: "application/json",
    },
  };

  axios
    .request(options)
    .then((response) => {
      console.log(response.data);
      res.send({
        success: true,
        ...response.data,
      });
    })
    .catch((error) => {
      console.error(error);
      res.send({
        success: false,
      });
    });
});

app.get("/metered-domain", (req: Request, res: Response) => {
  res.send({
    domain: METERED_DOMAIN,
  });
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
