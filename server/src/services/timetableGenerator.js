import { ai } from "../config/ai";

export async function generateTimetable(data) {
    const prompt = `Generate a timetable with these constraints: ${JSON.stringify(data)}`

    const response = await ai.chat.completion.create({
        model: "",
        message: [{ role: 'user', content: prompt }]
    })
    return
    JSON.parse(response.choices[0].message.content)
}