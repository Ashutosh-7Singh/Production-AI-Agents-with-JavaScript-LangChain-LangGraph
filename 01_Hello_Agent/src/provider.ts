type Provider = "openai" | "gemini" | "groq";

type HelloOutput = {
  ok: true;
  provider: Provider;
  model: string;
  message: string;
};

type GeminiGenerateContent = {
  candidates: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
};

async function helloGemini(): Promise<HelloOutput> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("Missing GOOGLE_API_KEY");
  const model = "gemini-2.0-flash-lite";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: "Say a short Hello",
            },
          ],
        },
      ],
    }),
  });
  if (!response.ok)
    throw new Error(`Gemini ${response.status}: ${await response.text()}`);

  const json = (await response.json()) as GeminiGenerateContent;
  const text =
    json.candidates?.[0]?.content?.parts?.[0]?.text ?? "HELLO As Default";
  return {
    ok: true,
    provider: "gemini",
    model,
    message: String(text).trim(),
  };
}

type OpenAiChatCompletion = {
  choices?: Array<{ message?: { content?: string } }>;
};

async function helloGroq(): Promise<HelloOutput> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");

  const model = "llama-3.1-8b-instant";
  const url = `https://api.groq.com/openai/v1/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: "Say a Short Hello",
        },
      ],
      temperature: 0,
    }),
  });
  if (!response.ok)
    throw new Error(`Groq ${response.status}: ${await response.text()}`);

  const json = (await response.json()) as OpenAiChatCompletion;
  const content = json?.choices?.[0]?.message?.content ?? "Hello as default";
  return {
    ok: true,
    provider: "groq",
    model,
    message: String(content).trim(),
  };
}

async function helloOpenAI(): Promise<HelloOutput> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const model = "llama-3.1-8b-instant";
  const url = `https://api.openai.com/v1/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: "Say a Short Hello",
        },
      ],
      temperature: 0,
    }),
  });
  if (!response.ok)
    throw new Error(`OpenAI ${response.status}: ${await response.text()}`);

  const json = (await response.json()) as OpenAiChatCompletion;
  const content = json?.choices?.[0]?.message?.content ?? "Hello as default";
  return {
    ok: true,
    provider: "openai",
    model,
    message: String(content).trim(),
  };
}
export async function selectAndHello(): Promise<HelloOutput> {
  const forced = (process.env.PROVIDER || "").toLocaleLowerCase();
  if (forced === "gemini") return helloGemini();
  if (forced === "groq") return helloGroq();
  if (forced === "openai") return helloOpenAI();

  if(forced) throw new Error(`Unsupported PROVIDED = ${forced}. use openai | gemini | groq  `)

    if(process.env.GOOGLE_API_KEY){
        try {
            
            return await helloGemini()
        } catch (error) {
            
        }
    }

     if(process.env.GROQ_API_KEY){
        try {
            return await helloGroq()
        } catch (error) {
            
        }
    } if(process.env.OPENAI_API_KEY){
        try {
            return await helloOpenAI()
        } catch (error) {
            
        }
    }
    throw new Error("No PROVIDER Configured")
}
