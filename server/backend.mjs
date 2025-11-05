/************************************************************
✅ Load .env FIRST + absolute path
*************************************************************/
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load `.env` inside /server folder
config({ path: path.join(__dirname, ".env") });

console.log("✅ ENV Loaded => GEMINI_API_KEY:", process.env.GEMINI_API_KEY?.slice(0, 8));

/************************************************************
✅ Imports
*************************************************************/
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";

/************************************************************
✅ FULL SYSTEM PROMPT — UNCHANGED
*************************************************************/
const SYSTEM_PROMPT = `You are an intelligent, polite, and professional AI Chat Assistant named STEMROBO Assistant, created for STEMROBO Technologies Pvt. Ltd., a leading company specializing in STEM education, robotics, AI, and IoT-based learning solutions for schools and institutions.

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
“I’ll connect you with our support/sales team to assist you further with that.”

Example Interactions

User: Tell me about STEMROBO Technologies.
Assistant: STEMROBO Technologies Pvt. Ltd. is a leading EdTech company focused on transforming STEM education through robotics, AI, IoT, and coding-based experiential learning solutions for schools and students across India and abroad.

User: I run a school. Which kit should I buy for my students?
Assistant: Could you please share your students’ age group and subjects of interest? Based on that, I’ll suggest the most suitable STEMROBO kits for your school.

User: Can you give me an estimated quotation for 10 AI Connect kits?
Assistant: Sure! Please share your delivery location and whether it’s for a school or individual order. I’ll prepare an approximate quotation for you.

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

Always respond as the official AI representative of STEMROBO Technologies Pvt. Ltd., never as a generic chatbot.`;

/************************************************************
✅ Express Setup
*************************************************************/
const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-assistant-nine-theta.vercel.app",
      "https://ai-assistant-f555ymn9k-idris-projects-711eb9ab.vercel.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(bodyParser.json());

/************************************************************
✅ Validate ENV
*************************************************************/
if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY NOT FOUND — Add to .env");
}

/************************************************************
✅ Gemini Init
*************************************************************/
const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ✅ Recommended Model
const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-flash",
});

/************************************************************
✅ Chat Session Memory
*************************************************************/
const chatSessions = new Map();

/************************************************************
✅ POST /api/start
*************************************************************/
app.post("/api/start", (req, res) => {
  try {
    const chatId = uuidv4();
    chatSessions.set(chatId, []);
    console.log("🆕 New Session:", chatId);
    res.json({ chatId });
  } catch (e) {
    res.status(500).json({ error: "Failed to initialize chat" });
  }
});

/************************************************************
✅ POST /api/chat
*************************************************************/
app.post("/api/chat", async (req, res) => {
  const { chatId, message } = req.body;

  if (!chatId || !chatSessions.has(chatId)) {
    return res.status(400).json({ error: "Invalid chatId" });
  }
  if (!message) {
    return res.status(400).json({ error: "No user message" });
  }

  try {
    const history = chatSessions.get(chatId);

    history.push({ role: "user", text: message });

    const promptText =
      SYSTEM_PROMPT +
      "\n\n" +
      history.map((m) => `${m.role}: ${m.text}`).join("\n") +
      "\nassistant:";

    const gemRes = await model.generateContent(promptText);

    const reply = gemRes?.response?.text() ?? "⚠️ No reply generated";

    history.push({ role: "assistant", text: reply });
    chatSessions.set(chatId, history);

    res.json({ text: reply });
  } catch (e) {
    console.error("Gemini error:", e);
    res.status(500).json({ error: "Failed to process message" });
  }
});

/************************************************************
✅ GET /
*************************************************************/
app.get("/", (_req, res) => {
  res.send("✅ STEMROBO Backend Running");
});

/************************************************************
✅ Start Server
*************************************************************/
app.listen(port, () => {
  console.log("✅ Server running on:", port);
});
