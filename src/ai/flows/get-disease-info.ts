'use server';
/**
 * @fileOverview An AI agent that provides information about plant diseases.
 *
 * - getDiseaseInfo - A function that returns information for a given plant disease.
 * - GetDiseaseInfoInput - The input type for the getDiseaseInfo function.
 * - GetDiseaseInfoOutput - The return type for the getDiseaseInfo function (matches DiseaseInfo type).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { DiseaseInfo } from '@/lib/types';

const GetDiseaseInfoInputSchema = z.object({
  disease: z.string().describe('The name of the plant disease.'),
});
export type GetDiseaseInfoInput = z.infer<typeof GetDiseaseInfoInputSchema>;

const GetDiseaseInfoOutputSchema = z.object({
  description: z.string().describe('A brief description of the disease.'),
  symptoms: z.array(z.string()).describe('A list of common symptoms.'),
  cause: z.string().describe('The common cause of the disease.'),
});

export async function getDiseaseInfo(input: GetDiseaseInfoInput): Promise<DiseaseInfo> {
  return getDiseaseInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDiseaseInfoPrompt',
  input: { schema: GetDiseaseInfoInputSchema },
  output: { schema: GetDiseaseInfoOutputSchema },
  prompt: `Provide information for the following plant disease: {{{disease}}}.
  
  - The description should be a single, concise paragraph.
  - Provide at least 3-4 common symptoms as a list.
  - The cause should be a single, concise paragraph.
  
  Do not include any introductory or concluding text.`,
});

const getDiseaseInfoFlow = ai.defineFlow(
  {
    name: 'getDiseaseInfoFlow',
    inputSchema: GetDiseaseInfoInputSchema,
    outputSchema: GetDiseaseInfoOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
