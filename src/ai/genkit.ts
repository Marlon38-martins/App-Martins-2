
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {openai} from '@genkit-ai/openai'; // Import OpenAI plugin

// Configure Genkit with GoogleAI by default.
// To use OpenAI, set the OPENAI_API_KEY environment variable.
// You can get an API key from https://platform.openai.com/api-keys.

const plugins = [googleAI()];

if (process.env.OPENAI_API_KEY) {
  console.log("OpenAI API Key found, enabling OpenAI plugin for Genkit.");
  plugins.push(openai({apiKey: process.env.OPENAI_API_KEY}));
} else {
  console.log("OpenAI API Key not found. OpenAI plugin will not be enabled. Genkit will use GoogleAI by default.");
}

export const ai = genkit({
  plugins: plugins,
  // Default model if none is specified in the flow.
  // Can be a Google model or an OpenAI model if the plugin is active, e.g., 'openai/gpt-4o'
  model: 'googleai/gemini-2.0-flash', 
});
