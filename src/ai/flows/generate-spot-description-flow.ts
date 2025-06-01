
'use server';
/**
 * @fileOverview A Genkit flow to generate descriptions for tourist spots.
 *
 * - generateSpotDescription - A function that generates a description based on keywords.
 * - SpotDescriptionInput - The input type for the generateSpotDescription function.
 * - SpotDescriptionOutput - The return type for the generateSpotDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit'; // Zod is re-exported by Genkit

// Define the input schema for the flow
const SpotDescriptionInputSchema = z.object({
  spotName: z.string().describe('The official name of the tourist spot or establishment.'),
  keywords: z.array(z.string()).min(1).describe('An array of keywords describing the spot (e.g., "praia", "histórico", "vista panorâmica", "culinária regional").'),
  descriptionLength: z.enum(['curta', 'média', 'longa']).default('média').describe('Desired length of the description (curta, média, longa).'),
  tone: z.enum(['informativo', 'entusiasmado', 'formal', 'casual']).default('entusiasmado').describe('Desired tone of the description.'),
});
export type SpotDescriptionInput = z.infer<typeof SpotDescriptionInputSchema>;

// Define the output schema for the flow
const SpotDescriptionOutputSchema = z.object({
  generatedDescription: z.string().describe('The AI-generated description for the tourist spot.'),
  suggestedTags: z.array(z.string()).optional().describe('Optional list of relevant tags or categories for the spot based on the description.'),
});
export type SpotDescriptionOutput = z.infer<typeof SpotDescriptionOutputSchema>;

/**
 * Generates a compelling description for a tourist spot based on provided keywords.
 * This function is an exported wrapper around the Genkit flow.
 * @param input The input containing keywords and other parameters for description generation.
 * @returns A promise that resolves to the generated description.
 */
export async function generateSpotDescription(input: SpotDescriptionInput): Promise<SpotDescriptionOutput> {
  // TODO: Consider adding a step here to fetch existing information about `spotName`
  // from `src/services/gramado-businesses.ts` or a real database
  // to provide more context to the LLM. This could be done via a Genkit Tool.

  return spotDescriptionFlow(input);
}

// Define the Genkit prompt
const spotDescriptionPrompt = ai.definePrompt({
  name: 'spotDescriptionPrompt',
  input: {schema: SpotDescriptionInputSchema},
  output: {schema: SpotDescriptionOutputSchema},
  // System prompt to guide the AI.
  // Note: The specific model (e.g., 'openai/gpt-4o') can be specified here in `model`
  // or in the `spotDescriptionFlow` definition, or globally in `src/ai/genkit.ts`.
  // model: 'openai/gpt-4o' // Example: Force OpenAI model for this prompt if configured
  prompt: `Você é um redator de turismo experiente, especializado em criar descrições atraentes para pontos turísticos e estabelecimentos.
Sua tarefa é gerar uma descrição para o local "{{spotName}}".

Use as seguintes palavras-chave como inspiração: {{#each keywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
A descrição deve ter um tom {{tone}} e ser de tamanho {{descriptionLength}}.
Concentre-se em destacar o que torna o local único e atraente para visitantes.

Se possível, sugira também algumas tags ou categorias relevantes para este local.
Responda no formato JSON especificado.`,
});

// Define the Genkit flow
const spotDescriptionFlow = ai.defineFlow(
  {
    name: 'spotDescriptionFlow',
    inputSchema: SpotDescriptionInputSchema,
    outputSchema: SpotDescriptionOutputSchema,
  },
  async (input) => {
    console.log(`Generating description for: ${input.spotName} with keywords: ${input.keywords.join(', ')}`);
    
    const {output} = await spotDescriptionPrompt(input);

    if (!output) {
      throw new Error('A IA não conseguiu gerar uma descrição para o local especificado.');
    }
    
    // TODO: Add post-processing if needed.
    // For example, saving the generated description to a database associated with the spot.
    // Or, if using tools, this flow could orchestrate multiple LLM calls or service calls.

    return output;
  }
);

// Example Usage (for testing or direct server-side calls, not directly in UI without a client-side trigger):
/*
async function testFlow() {
  try {
    const result = await generateSpotDescription({
      spotName: "Mirante da Serra",
      keywords: ["vista panorâmica", "pôr do sol", "natureza", "fotografia"],
      descriptionLength: "média",
      tone: "entusiasmado"
    });
    console.log("Generated Description:", result.generatedDescription);
    console.log("Suggested Tags:", result.suggestedTags);
  } catch (error) {
    console.error("Error generating spot description:", error);
  }
}
// testFlow();
*/
