import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.20.1/mod.ts";

const openRouterKey = Deno.env.get("OPENROUTER_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: openRouterKey,
    });

    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [
        {
          role: "system",
          content: `You are an assistant for a Mandarin learning app. Generate content based on the user's prompt. Your response MUST be a valid JSON object with three keys: "simplified", "pinyin", and "english". Do not include any text outside of the JSON object. Example: {"simplified": "熊猫爱吃竹子。", "pinyin": "Xióngmāo ài chī zhúzi.", "english": "Pandas love to eat bamboo."}`,
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const aiResponseString = completion.choices[0].message.content;

    // --- LOGIKA PALING ROBUST UNTUK MENGAMBIL JSON PERTAMA ---
    let parsedObject;
    try {
      const firstBraceIndex = aiResponseString.indexOf('{');
      if (firstBraceIndex === -1) {
        throw new Error("AI response does not contain a JSON object.");
      }

      let braceCount = 0;
      let lastBraceIndex = -1;
      for (let i = firstBraceIndex; i < aiResponseString.length; i++) {
        if (aiResponseString[i] === '{') {
          braceCount++;
        } else if (aiResponseString[i] === '}') {
          braceCount--;
        }
        if (braceCount === 0) {
          lastBraceIndex = i;
          break;
        }
      }

      if (lastBraceIndex === -1) {
        throw new Error("AI response contains an incomplete JSON object.");
      }

      const singleJsonString = aiResponseString.substring(firstBraceIndex, lastBraceIndex + 1);
      parsedObject = JSON.parse(singleJsonString);
      // --- AKHIR DARI LOGIKA ROBUST ---
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON. Raw response:", aiResponseString);
      throw new Error("AI returned data in an unparsable format.");
    }

    return new Response(JSON.stringify(parsedObject), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});