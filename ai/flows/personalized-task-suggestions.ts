'use server';

/**
 * @fileOverview This file defines a function for providing task suggestions to users.
 *
 * It now directly returns a hardcoded list of tasks without using an AI model,
 * ensuring immediate availability and reliability.
 * The user's commission (20% of totalReward) is calculated from this list.
 * It exports the `getPersonalizedTaskSuggestions` function, the `PersonalizedTaskSuggestionsInput` type, and the `PersonalizedTaskSuggestionsOutput` type.
 */

import {z} from 'genkit';

// Define the input schema (kept for structural consistency)
const PersonalizedTaskSuggestionsInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  userHistory: z.array(z.object({
    t: z.string(),
    type: z.string(),
    amt: z.number().optional(),
    note: z.string().optional(),
  })).describe('The user transaction history.'),
  btcPrice: z.number().describe('The current BTC price in INR.'),
  referralCode: z.string().optional().describe('The referral code of the user.'),
});
export type PersonalizedTaskSuggestionsInput = z.infer<typeof PersonalizedTaskSuggestionsInputSchema>;

// Define the output schema
const PersonalizedTaskSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of personalized task suggestions for the user.'),
});
export type PersonalizedTaskSuggestionsOutput = z.infer<typeof PersonalizedTaskSuggestionsOutputSchema>;

// This function now contains the hardcoded list of available tasks.
// In the future, you can replace this list with tasks from a real offer wall provider.
function getSampleTasks() {
  // The `totalReward` is the full amount given by an offer provider.
  // The user will only see 20% of this amount.
  const tasks = [
    { name: 'Download WinZO App & play a game', totalReward: 5, type: 'app' },
    { name: 'Watch a short Ad', totalReward: 0.75, type: 'ad' },
    { name: 'Download A23 Games and register', totalReward: 10, type: 'app' },
    { name: 'Watch a video about Bitcoin', totalReward: 0.50, type: 'video' },
    { name: 'Refer a friend to EarnX', totalReward: 2.50, type: 'referral' },
    { name: 'Complete a quick survey', totalReward: 8, type: 'app' },
    { name: 'Install and reach level 5 in a game', totalReward: 25, type: 'app'},
  ];

  // Calculate the user's 20% share and format the suggestion string.
  return tasks.map(task => {
      const userEarning = task.totalReward * 0.20;
      return `${task.name} and earn ₹${userEarning.toFixed(2)}`;
  });
}

/**
 * Retrieves a list of task suggestions for a user.
 * This function no longer uses AI and returns a predefined list for speed and reliability.
 * @param input - The input containing user information (currently unused but kept for consistency).
 * @returns A promise that resolves with the list of task suggestions.
 */
export async function getPersonalizedTaskSuggestions(input: PersonalizedTaskSuggestionsInput): Promise<PersonalizedTaskSuggestionsOutput> {
  const formattedSuggestions = getSampleTasks();
  
  return {
    suggestions: formattedSuggestions,
  };
}
