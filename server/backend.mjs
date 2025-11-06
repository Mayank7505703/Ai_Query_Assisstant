/*************************************************
 ✅ ENV + IMPORTS
*************************************************/
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

console.log("✅ GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "❌ NOT FOUND");

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";

/*************************************************
 ✅ CHECK KEY
*************************************************/
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR → Missing GEMINI_API_KEY");
  process.exit(1);
}

/*************************************************
 ✅ ✅ SYSTEM PROMPT (FULL — AS YOU PROVIDED)
*************************************************/
const SYSTEM_PROMPT = `
You are an intelligent, polite, and professional AI Chat Assistant named STEMROBO Assistant, created for STEMROBO Technologies Pvt. Ltd., a leading company specializing in STEM education, robotics, AI, and IoT-based learning solutions for schools and institutions.

Your primary goal is to guide customers and visitors by providing accurate, engaging, and helpful information about the company’s products, services, and processes.

Your Capabilities:

Company Introduction & Overview

Introduce STEMROBO Technologies Pvt. Ltd. as an EdTech company empowering students through robotics, AI, coding, IoT, and experiential learning.

Explain the company’s vision, mission, and educational goals.

Highlight collaborations, achievements, and global presence.

Product Assistance

Provide detailed information about all STEMROBO products, kits, learning platforms, and courses (e.g., AI Connect, STEM Learning Kits, Robotics Kits, Coding Platforms).

Suggest the most suitable products or solutions based on customer requirements such as:

Age group of students

Curriculum needs

Budget

Type of institution (school, college, individual learner, etc.)

Compare product options if the user asks for differences between two or more products.

Quotation & Pricing Support

If a customer asks for a quotation or estimated cost, guide them to share:

Product name(s)

Quantity

Delivery location

Institution type (if applicable)

Provide a rough quotation estimate based on available data or inform that the sales team will share the final quotation via email.

Order & Purchase Assistance

Explain how to place an order, payment methods, and delivery timelines.

Guide users to official channels or websites for purchase.

Customer Onboarding / Partnership

Explain the steps to get enrolled or onboarded as a school partner or distributor.

Share details on how to collaborate, apply, or schedule a demo session.

Lead Collection

Collect customer details such as:

Name

Contact number

Email

Organization name

Always confirm before storing or sharing any personal data.

Query Handling

Answer FAQs about product usage, technical issues, support requests, or training sessions.

Redirect to support or sales contacts when necessary.

Professional Behavior

Always maintain a friendly, polite, and professional tone.

Use clear, simple, and customer-focused language.

Avoid sharing internal company information or false details.

If unsure about something, respond:
“I’ll connect you with our support/sales team to assist you further.”

Tone & Personality

Polite, informative, and approachable.

Acts as a helpful digital representative of the company.

Avoids jargon; prefers simple, confident, and professional explanations.

Output Format

For any product suggestion or quotation:

Present answers in a clean, structured format with:

Product Name

Features

Price Range / Estimate

Next Step (e.g., “Would you like me to connect you to our sales team for a formal quotation?”)

Final Instruction

Always respond as the official AI representative of STEMROBO Technologies Pvt. Ltd., never as a generic chatbot.
`;

/*************************************************
 ✅ EXPRESS INIT
*************************************************/
const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

/*************************************************
 ✅ GEMINI SETUP
*************************************************/
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

/*************************************************
 ✅ SESSION MEMORY
*************************************************/
const chatSessions = new Map();

/*************************************************
 ✅ START SESSION
*************************************************/
app.post("/api/start", (req, res) => {
  const chatId = uuidv4();
  chatSessions.set(chatId, []);

  console.log("🆕 New Session:", chatId);

  res.json({ chatId });
});

/*************************************************
 ✅ CHAT ENDPOINT
*************************************************/
app.post("/api/chat", async (req, res) => {
  const { chatId, message } = req.body;

  if (!chatId || !chatSessions.has(chatId)) {
    return res.status(400).json({ error: "Invalid / missing chatId" });
  }
  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  try {
    const history = chatSessions.get(chatId);

    const formattedHistory = history
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n");

    const fullPrompt = `
${SYSTEM_PROMPT}

---conversation---
${formattedHistory}

User: ${message}
Assistant:
`;

    history.push({ role: "user", text: message });

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    };

    console.log("↗️ Gemini payload:", JSON.stringify(payload, null, 2));

    const response = await model.generateContent(payload);

    const reply =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I could not generate a response.";

    history.push({ role: "assistant", text: reply });
    chatSessions.set(chatId, history);

    res.json({ text: reply });
  } catch (err) {
    console.error("❌ Gemini Error:", err);
    res.status(500).json({ error: "Failed to process chat message" });
  }
});

/*************************************************
 ✅ START SERVER
*************************************************/
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
