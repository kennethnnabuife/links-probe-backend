import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

//Enable CORS — only allow your frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

const PORT = process.env.PORT;

//Basic route for uptime checks
app.get("/", (req, res) => {
  res.send("✅ LinksProbe backend is alive!");
});

app.post("/scan", async (req, res) => {
  const { url } = req.body;
  console.log("🛰️ [REQUEST] /scan called with URL:", url);

  if (!url) {
    console.log("⚠️ No URL provided by client.");
    return res.status(400).json({ message: "No URL provided" });
  }

  try {
    console.log("🔹 Step 1: Sending request to Google Safe Browsing API...");
    const gsbResponse = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GSB_API_KEY}`,
      {
        client: { clientId: "linksprobe", clientVersion: "1.0" },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION",
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      }
    );

    console.log("✅ Step 2: Received response from Google API");
    console.log(
      "   Raw API response:",
      JSON.stringify(gsbResponse.data, null, 2)
    );

    const googleFlagged =
      gsbResponse.data.matches && gsbResponse.data.matches.length > 0;
    console.log("🔹 Step 3: googleFlagged =", googleFlagged);

    console.log("🔹 Step 4: Determining verdict...");

    if (!googleFlagged) {
      console.log("✅ Verdict: SAFE");
      return res.json({
        message:
          "Safe ✅ — No signs of harmful activity detected. This link appears secure.",
      });
    }

    console.log("❌ Verdict: NOT SAFE");
    return res.json({
      message:
        "Not Safe ❌ — This link has been identified as unsafe. Avoid visiting it.",
    });
  } catch (error) {
    console.error("🚨 Error occurred during processing");

    if (error.response) {
      console.error("   ▶ Google API returned an error:", error.response.data);
    } else if (error.request) {
      console.error("   ▶ No response from Google API:", error.message);
    } else {
      console.error("   ▶ General error:", error.message);
    }

    return res.status(500).json({
      message: "Error: Unable to analyze link safety.",
      detail: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 LinksProbe running on port ${PORT}`);
  console.log(
    `🌍 Ready to receive requests from ${process.env.FRONTEND_ORIGIN}`
  );

  //Keep-alive ping every 14 minutes
  const SELF_URL = process.env.BACKEND_URL;
  setInterval(async () => {
    try {
      await axios.get(SELF_URL);
      console.log("💓 Keep-alive ping sent successfully.");
    } catch (err) {
      console.error("⚠️ Keep-alive ping failed:", err.message);
    }
  }, 840000); // 14 minutes
});
