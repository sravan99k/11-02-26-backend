"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
async function transcribeWithGemini(audioFile) {
    return 'Gemini transcription result here';
}
async function POST(request) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get('audio');
        if (!audioFile) {
            return new Response(JSON.stringify({ error: 'No audio file provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const text = await transcribeWithGemini(audioFile);
        return new Response(JSON.stringify({ text }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    catch (error) {
        console.error('Error transcribing audio:', error);
        return new Response(JSON.stringify({ error: 'Failed to transcribe audio' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
//# sourceMappingURL=route.js.map