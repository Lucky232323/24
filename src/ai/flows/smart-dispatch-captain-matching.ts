'use server';
/**
 * @fileOverview Implements the SmartDispatchCaptainMatching flow, which uses an AI algorithm to match riders with the most suitable captains.
 *
 * - smartDispatchCaptainMatching - A function that initiates the captain matching process.
 * - SmartDispatchCaptainMatchingInput - The input type for the smartDispatchCaptainMatching function.
 * - SmartDispatchCaptainMatchingOutput - The return type for the smartDispatchCaptainMatching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartDispatchCaptainMatchingInputSchema = z.object({
  riderLocation: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .describe('The current location of the rider (latitude and longitude).'),
  serviceType: z
    .enum(['Bike', 'Auto', 'Cab'])
    .describe('The type of service requested (Bike, Auto, or Cab).'),
  historicalRouteData: z
    .array(z.string())
    .optional()
    .describe('Historical route data for the rider, if available.'),
  captainsAvailable: z
    .array(
      z.object({
        captainId: z.string(),
        location: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
        reliabilityScore: z.number().min(0).max(1).default(0.75),
        vehicleType: z.enum(['Bike', 'Auto', 'Cab']),
      })
    )
    .describe('List of available captains with their location, reliability score and vehicle type'),
});
export type SmartDispatchCaptainMatchingInput = z.infer<
  typeof SmartDispatchCaptainMatchingInputSchema
>;

const SmartDispatchCaptainMatchingOutputSchema = z.object({
  captainId: z.string().describe('The ID of the matched captain.'),
  estimatedArrivalTime: z.number().describe('Estimated time until captain arrival in minutes'),
});
export type SmartDispatchCaptainMatchingOutput = z.infer<
  typeof SmartDispatchCaptainMatchingOutputSchema
>;

export async function smartDispatchCaptainMatching(
  input: SmartDispatchCaptainMatchingInput
): Promise<SmartDispatchCaptainMatchingOutput> {
  return smartDispatchCaptainMatchingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartDispatchCaptainMatchingPrompt',
  input: {schema: SmartDispatchCaptainMatchingInputSchema},
  output: {schema: SmartDispatchCaptainMatchingOutputSchema},
  prompt: `You are an expert dispatch system optimizing for rider wait times while ensuring captain safety and reliability.

Given the rider's location: {{{riderLocation.latitude}}}, {{{riderLocation.longitude}}},
the requested service type: {{{serviceType}}},
historical route data: {{{historicalRouteData}}},
and a list of available captains:

{{#each captainsAvailable}}
- Captain ID: {{{captainId}}}, Location: {{{location.latitude}}}, {{{location.longitude}}}, Reliability: {{{reliabilityScore}}}, Vehicle Type: {{{vehicleType}}}
{{/each}}

Determine the best captain to assign to the rider. Consider proximity, captain reliability score, and match the service type.

Return the captainId and estimatedArrivalTime. The estimatedArrivalTime should be in whole minutes.
`,
});

const smartDispatchCaptainMatchingFlow = ai.defineFlow(
  {
    name: 'smartDispatchCaptainMatchingFlow',
    inputSchema: SmartDispatchCaptainMatchingInputSchema,
    outputSchema: SmartDispatchCaptainMatchingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
