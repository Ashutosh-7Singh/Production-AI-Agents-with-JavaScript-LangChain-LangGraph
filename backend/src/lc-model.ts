import { any } from "zod";
import { loadEnv } from "./env";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogle } from "@langchain/google";
import { ChatGroq } from "@langchain/groq";
// import { ChatGroq } from "@langchain/groq"

export type Provider = "openai" | "gemini" | "groq";

export function createChatModel(): { provider: Provider; model: any } {
  loadEnv();

  const forced = (process.env.Provider || " ").toLocaleLowerCase();
  const hasOpenai = !!process.env.OPEN_API_KEY;
  const hasGemini = !!process.env.GOOGLE_API_KEY;
  const hasGroq = !!process.env.GROQ_API_KEY;

  const base = { temperature: 0 as const };

  if (forced === "openai" || (!forced && hasOpenai)) {
    return {
      provider: "openai",
      model: new ChatOpenAI({
        ...base,
        model: "gpt-4o-mini",
      }),
    };
  }

  if (forced === "gemini" || (!forced && hasGemini)) {
    return {
      provider: "gemini",
      model: new ChatGoogle({
        ...base,
        model: "gemini-2.0-flash-lite",
      }),
    };
  }
  if (forced === "groq" || (!forced && hasGroq)) {
    return {
      provider: "groq",
      model: new ChatGroq({
        ...base,
        model: "llama-3.1-8b-instant",
      }),
    };
  }

  return {
    provider: "gemini",
    model: new ChatGoogle({
      ...base,
      model: "gemini-2.0-flash-lite",
    }),
  };
}
