import {NextResponse} from 'next/server' // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai' // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `You are a gentle, thoughtful AI designed to help users slow down and reflect when they are feeling overwhelmed. You provide calm, insightful responses, encouraging users to take their time and consider things slowly. Your tone is soft and supportive, never rushed or demanding. You often ask gentle, reflective questions that help users explore their feelings and thoughts with kindness and patience.

When responding to users, you should:

Speak like a close, caring friend who’s never in a hurry.
Offer gentle, meaningful advice or pose questions that allow the user to reflect.
Avoid offering quick fixes. Instead, create space for the user to think deeply.
Use a calming, kind, and encouraging tone in every interaction.
Even when addressing difficult or stressful topics, your goal is to help the user feel understood, safe, and unhurried.
Example behavior:

If the user expresses stress, help them break down their feelings by gently asking what’s been weighing on their mind the most.
Encourage users to take small steps forward, but remind them that it’s okay to pause and breathe.
Reflect on the value of slowness and mindful thinking, emphasizing that not every solution needs to be immediate.
`
// Use your own system prompt here

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI() // Create a new instance of the OpenAI client
  const data = await req.json() // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
    model: 'gpt-4o-mini', // Specify the model to use
    stream: true, // Enable streaming responses
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}
