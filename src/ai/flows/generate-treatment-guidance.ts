'use server';
/**
 * @fileOverview An AI agent that generates treatment guidance for plant diseases.
 *
 * - generateTreatmentGuidance - A function that generates treatment guidance based on the detected disease.
 * - GenerateTreatmentGuidanceInput - The input type for the generateTreatmentGuidance function.
 * - GenerateTreatmentGuidanceOutput - The return type for the generateTreatmentGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTreatmentGuidanceInputSchema = z.object({
  disease: z.string().describe('The name of the detected plant disease.'),
});
export type GenerateTreatmentGuidanceInput = z.infer<
  typeof GenerateTreatmentGuidanceInputSchema
>;

const GenerateTreatmentGuidanceOutputSchema = z.object({
  treatmentGuidance: z
    .string()
    .describe('The AI-generated treatment guidance for the detected disease.'),
});
export type GenerateTreatmentGuidanceOutput = z.infer<
  typeof GenerateTreatmentGuidanceOutputSchema
>;

export async function generateTreatmentGuidance(
  input: GenerateTreatmentGuidanceInput
): Promise<GenerateTreatmentGuidanceOutput> {
  return generateTreatmentGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTreatmentGuidancePrompt',
  input: {schema: GenerateTreatmentGuidanceInputSchema},
  output: {schema: GenerateTreatmentGuidanceOutputSchema},
  prompt: `You are an expert agricultural advisor. A farmer has detected the following disease in their crops: {{{disease}}}.

  Provide detailed treatment guidance for this disease. The response should be in Markdown format.
  Use bullet points for actionable steps. Use bold for important terms.
  
  Focus on treatments that are easily accessible and environmentally friendly where possible.
  
  Example format:
  **Initial Actions:**
  - First action item.
  - Second action item.

  **Ongoing Management:**
  - First ongoing action.
  - Second ongoing action.

  DO NOT include any disclaimers or introductory/concluding statements.
  DO NOT ask for additional information.`,
});

const generateTreatmentGuidanceFlow = ai.defineFlow(
  {
    name: 'generateTreatmentGuidanceFlow',
    inputSchema: GenerateTreatmentGuidanceInputSchema,
    outputSchema: GenerateTreatmentGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
