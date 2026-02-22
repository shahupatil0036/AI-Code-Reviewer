import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY is missing. Add it to your .env file.");
    process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function testLLM(): Promise<void> {
    console.log("🚀 Sending test request to OpenAI (gpt-4o-mini)...\n");

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Say hello and confirm you are working." },
            ],
            max_tokens: 100,
        });

        const reply = completion.choices[0]?.message?.content;

        if (reply) {
            console.log("✅ LLM Response:\n");
            console.log(reply);
        } else {
            console.warn("⚠️  Received an empty response from the API.");
        }

        console.log("\n📊 Usage:", completion.usage);
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            console.error(`❌ API Error [${error.status}]: ${error.message}`);
        } else if (error instanceof Error) {
            console.error(`❌ Error: ${error.message}`);
        } else {
            console.error("❌ Unknown error:", error);
        }
        process.exit(1);
    }
}

testLLM();
