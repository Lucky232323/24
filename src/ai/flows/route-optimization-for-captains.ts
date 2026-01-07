'use server';
/**
 * @fileOverview An AI-powered route optimization flow for captains, considering real-time traffic and choke points.
 *
 * - optimizeRouteForCaptain - A function that takes a starting location and destination and returns an optimized route.
 * - RouteOptimizationInput - The input type for the optimizeRouteForCaptain function.
 * - RouteOptimizationOutput - The return type for the optimizeRouteForCaptain function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RouteOptimizationInputSchema = z.object({
  start: z.string().describe('The starting location for the route.'),
  destination: z.string().describe('The destination for the route.'),
});
export type RouteOptimizationInput = z.infer<typeof RouteOptimizationInputSchema>;

const RouteOptimizationOutputSchema = z.object({
  optimizedRoute: z.string().describe('The optimized route considering traffic and choke points.'),
  estimatedTimeArrival: z.string().describe('The estimated time of arrival based on the optimized route.'),
  trafficConditions: z.string().describe('A description of the current traffic conditions.'),
  chokePoints: z.string().describe('A list of known traffic choke points along the route.'),
});
export type RouteOptimizationOutput = z.infer<typeof RouteOptimizationOutputSchema>;

export async function optimizeRouteForCaptain(input: RouteOptimizationInput): Promise<RouteOptimizationOutput> {
  return optimizeRouteForCaptainFlow(input);
}

const prompt = ai.definePrompt({
  name: 'routeOptimizationPrompt',
  input: {schema: RouteOptimizationInputSchema},
  output: {schema: RouteOptimizationOutputSchema},
  prompt: `You are an AI assistant specializing in route optimization for ride-hailing captains.

Given the current traffic conditions and known choke points, provide the fastest route from the starting location to the destination. Also, estimate the time of arrival based on this optimized route.

Starting Location: {{{start}}}
Destination: {{{destination}}}

Consider real-time traffic data and common traffic bottlenecks in your route optimization.

Also provide a summary of traffic conditions and a list of choke points.

Output the optimized route, estimated time of arrival, traffic conditions, and choke points. Be concise and clear in your response.`, 
});

const optimizeRouteForCaptainFlow = ai.defineFlow(
  {
    name: 'optimizeRouteForCaptainFlow',
    inputSchema: RouteOptimizationInputSchema,
    outputSchema: RouteOptimizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
