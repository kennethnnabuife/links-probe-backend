# LinksProbe Backend – Safe Link Checker API

The LinksProbe backend is an open-source Express (Node.js) API that checks whether a website link is safe or malicious.
It uses the Google Safe Browsing API to detect phishing, malware, and other harmful content.
This backend is designed to work with the LinksProbe frontend built using Next.js 16 (TypeScript).

## About the Project

The backend exposes a single endpoint /scan that receives a URL from the frontend, sends it to the Google Safe Browsing API, and returns the safety status of the link.
If the link is flagged as unsafe, the API responds with a “Not Safe” message. Otherwise, it returns “Safe”.

### Technologies Used

Node.js
Express
Axios
Google Safe Browsing API
dotenv
CORS

### Getting Started

Clone the repository
git clone https://github.com/kennethnnabuife/links-probe-backend

cd links-probe-backend

Install dependencies
npm install

### Environment variables

Create a file named .env in the root folder and add:
PORT=5000
FRONTEND_ORIGIN=http://localhost:3000
GSB_API_KEY=your_google_safe_browsing_api_key_here

Do not commit this file to GitHub. It contains sensitive information.

Running the server
npm run dev

The server will start on http://localhost:5000

You should see a log confirming it is ready to receive requests from your frontend.

#### How It Works:

The frontend sends a POST request to the /scan endpoint with a JSON body containing the URL to check.
The backend forwards the URL to the Google Safe Browsing API.
The Google API analyzes the link for threats such as malware, phishing, or unwanted software.
The backend receives the response and returns either “Safe” or “Not Safe” to the frontend.

Example Request

POST /scan
Body:
{ "url": "https://example.com
" }

Example Response

Safe ✅ — No signs of harmful activity detected.
or
Not Safe ❌ — This link has been identified as unsafe. Avoid visiting it.

#### Error Handling

If the API key is invalid or the Google service is unavailable, the backend returns an error message indicating that it was unable to analyze the link safety.

#### CORS Configuration

The backend only accepts requests from the domain defined in the .env variable FRONTEND_ORIGIN.
This ensures that only your frontend application can communicate with the backend.

#### Contributing:

Fork the project.
Create a new branch for your feature.
Commit and push your changes.
Open a pull request.
Everyone is welcome to contribute or suggest improvements.

#### License:

MIT License
Copyright (c) Kenneth Nnabuife

#### Learn More:

Google Safe Browsing API: https://developers.google.com/safe-browsing

Express Documentation: https://expressjs.com

Axios Documentation: https://axios-http.com

Node.js Documentation: https://nodejs.org
