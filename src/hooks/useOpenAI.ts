import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, you should make API calls from the backend
});

export const useOpenAI = () => {
  const analyzeText = async (text: string) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that analyzes PDF content.",
          },
          {
            role: "user",
            content: text,
          },
        ],
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      throw error;
    }
  };

  return { analyzeText };
};
