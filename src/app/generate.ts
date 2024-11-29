import ollama from 'ollama';


export async function generateEmail() {
    const response = await ollama.chat({
        model: 'mistral',
        messages: [{role:'user',content: 'Why is the sky blue ? '}],
    })
    
    return response.message.content
}