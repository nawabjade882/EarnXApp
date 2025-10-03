
'use server';

/**
 * @fileOverview A Genkit flow for generating a promotional ad script from a text prompt.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAdScriptInputSchema = z.string().describe('A text prompt describing the ad script to be generated.');
export type GenerateAdScriptInput = z.infer<typeof GenerateAdScriptInputSchema>;

const GenerateAdScriptOutputSchema = z.object({
  adScript: z.string().describe("The generated ad script as a formatted string, including scene descriptions and dialogue."),
});
export type GenerateAdScriptOutput = z.infer<typeof GenerateAdScriptOutputSchema>;


const adScriptPrompt = ai.definePrompt({
    name: 'adScriptPrompt',
    input: { schema: GenerateAdScriptInputSchema },
    output: { schema: GenerateAdScriptOutputSchema },
    prompt: `You are a creative director specializing in writing compelling ad scripts for mobile apps.
    
    A user wants to create a promotional video for their app, "EarnX Digital".
    
    The app's core features are:
    - Users complete tasks and watch ads to earn real INR (Indian Rupees).
    - It has a referral program.
    - It shows the INR to Bitcoin (BTC) conversion rate.
    - Users can withdraw earnings via Paytm, PhonePe, or UPI.

    The user's creative idea for the ad is: "{{{prompt}}}"

    Based on the user's idea, write a short, engaging, and professional ad script (around 30-45 seconds).
    
    The script should have:
    - A clear hook to grab attention.
    - A simple narrative or scene description.
    - A clear call to action (e.g., "Download EarnX Digital now!").
    - Format the output with clear headings for scenes (e.g., [SCENE 1]), dialogue, and actions.
    
    Return the final script in the 'adScript' field.
    `,
});


const generateAdScriptFlow = ai.defineFlow(
  {
    name: 'generateAdScriptFlow',
    inputSchema: GenerateAdScriptInputSchema,
    outputSchema: GenerateAdScriptOutputSchema,
  },
  async (prompt) => {
    console.log('Starting ad script generation for prompt:', prompt);

    const { output } = await adScriptPrompt(prompt);
    
    if (!output) {
        throw new Error('The AI failed to generate a script. Please try a different prompt.');
    }
    
    console.log('Ad script generated successfully.');

    return {
      adScript: output.adScript,
    };
  }
);


export async function generateAdScript(prompt: GenerateAdScriptInput): Promise<GenerateAdScriptOutput> {
  return generateAdScriptFlow(prompt);
}
