import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    console.log('📥 Chat API request received');
    
    const { messages } = await req.json();
    
    // Log the incoming messages (excluding potentially sensitive content)
    console.log(`📝 Chat request with ${messages.length} messages:`, 
      messages.map((msg: any) => ({
        role: msg.role,
        content: msg.parts ? `[contains parts]` : msg.content ? `${msg.content.substring(0, 30)}${msg.content.length > 30 ? '...' : ''}` : '[empty]'
      })));
    
    // Ensure we have an API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('❌ OpenAI API key is missing');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is missing' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔄 Sending request to OpenAI');
    
    // Create the stream text result
    const result = streamText({
      model: openai('gpt-4'),
      system: `You are Jaime, a helpful AI assistant from First Line Software. 
You provide clear, concise, and accurate responses to user queries. 
Format your responses using Markdown with all basic formatting:
- Use proper paragraph breaks for readability
- Format lists with bullet points (• or -)
- Include clickable URLs when referencing websites (e.g., https://firstlinesoftware.com)
- Use **bold** for emphasis where appropriate
- Use _italic_ for subtle emphasis
- Use headings (## or ###) to organize longer responses
- Use > for quotes or important callouts
- Format code blocks with triple backticks and specify the language when applicable
- Use inline code with single backticks for technical terms or commands

When you don't know something or if information might be inaccurate, acknowledge this honestly.
Your responses should be friendly, professional, and tailored to the user's needs.
Always present information in a way that's easy to read and understand.`,
      messages,
    });

    console.log('✅ Stream created successfully, sending response');
    
    // Return the stream response
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('❌ Error in chat API route:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred during the request', details: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
