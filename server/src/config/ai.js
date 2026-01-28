import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

class AIClient {
    constructor() {
        this.provider = process.env.AI_PROVIDER || 'openai';
        this.gemini = new GoogleGenAI(process.env.GEMINI_API_KEY);
    }

    async generateCompletion(prompt, model = 'gpt-4') {
        console.log(`[AI] Generating completion with ${this.provider} model ${model}`);
        console.log(`[AI] Prompt: ${prompt.substring(0, 50)}...`);

        return {
            text: "Mock AI Response",
            usage: { total_tokens: 100 }
        };

        if (this.provider === 'openai') {
            const completion = await this.openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: model,
            });
            return {
                text: completion.choices[0].message.content,
                usage: completion.usage
            };
        } else if (this.provider === 'gemini') {
            const genModel = this.gemini.getGenerativeModel({ model: "gemini-pro" });
            const result = await genModel.generateContent(prompt);
            const response = await result.response;
            return {
                text: response.text(),
                usage: { total_tokens: 0 }
            };
        }
    }
}

export const aiClient = new AIClient();
export default aiClient;
