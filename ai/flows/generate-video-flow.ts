
'use server';

/**
 * @fileOverview A Genkit flow for generating a promotional video from a text prompt.
 * This flow uses the Veo model and requires GCP Billing to be enabled.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';
import { MediaPart } from 'genkit/model';
import fetch from 'node-fetch';
import { Readable } from 'stream';

const GenerateVideoInputSchema = z.string().describe('A text prompt describing the video to be generated.');
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

const GenerateVideoOutputSchema = z.object({
  videoUrl: z.string().describe("The data URI of the generated video."),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;


async function downloadVideoToDataURI(video: MediaPart): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable not set.');
    }
    
    // Add API key before fetching the video.
    const videoDownloadUrl = `${video.media!.url}&key=${apiKey}`;

    const response = await fetch(videoDownloadUrl);

    if (!response.ok || !response.body) {
        throw new Error(`Failed to download video: ${response.statusText}`);
    }

    const videoBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(videoBuffer);
    const contentType = response.headers.get('content-type') || 'video/mp4';

    return `data:${contentType};base64,${buffer.toString('base64')}`;
}


const generateVideoFlow = ai.defineFlow(
  {
    name: 'generateVideoFlow',
    inputSchema: GenerateVideoInputSchema,
    outputSchema: GenerateVideoOutputSchema,
  },
  async (prompt) => {
    console.log('Starting video generation for prompt:', prompt);

    let { operation } = await ai.generate({
      // Using Veo 2.0 model. Note: This requires GCP Billing to be enabled.
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: prompt,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
        throw new Error('Expected the model to return a long-running operation.');
    }

    console.log('Video generation started. Polling for completion...');

    // Poll for completion
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds
        operation = await ai.checkOperation(operation);
        console.log('Polling... operation status:', operation.done);
    }
    
    if (operation.error) {
        throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    const videoPart = operation.output?.message?.content.find(p => !!p.media);

    if (!videoPart) {
        throw new Error('Generated video not found in the operation result.');
    }
    
    console.log('Video generated. Downloading...');
    
    const videoDataUri = await downloadVideoToDataURI(videoPart);

    console.log('Video downloaded successfully.');

    return {
      videoUrl: videoDataUri,
    };
  }
);


export async function generateVideo(prompt: GenerateVideoInput): Promise<GenerateVideoOutput> {
  return generateVideoFlow(prompt);
}
