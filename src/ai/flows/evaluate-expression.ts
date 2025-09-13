'use server';
/**
 * @fileOverview Evaluates a mathematical expression using an AI model.
 *
 * - evaluateExpression - A function that evaluates a mathematical expression.
 * - EvaluateExpressionInput - The input type for the evaluateExpression function.
 * - EvaluateExpressionOutput - The return type for the evaluateExpression function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateExpressionInputSchema = z.object({
  expression: z.string().describe('The mathematical expression to evaluate.'),
});
export type EvaluateExpressionInput = z.infer<typeof EvaluateExpressionInputSchema>;

const EvaluateExpressionOutputSchema = z.object({
  result: z.number().describe('The result of the evaluated expression.'),
});
export type EvaluateExpressionOutput = z.infer<typeof EvaluateExpressionOutputSchema>;

export async function evaluateExpression(input: EvaluateExpressionInput): Promise<EvaluateExpressionOutput> {
  return evaluateExpressionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateExpressionPrompt',
  input: {schema: EvaluateExpressionInputSchema},
  output: {schema: EvaluateExpressionOutputSchema},
  prompt: `You are a mathematical expression evaluator. You will take a mathematical expression as input and return the result of the evaluated expression as a number.

Expression: {{{expression}}}`,
});

const evaluateExpressionFlow = ai.defineFlow(
  {
    name: 'evaluateExpressionFlow',
    inputSchema: EvaluateExpressionInputSchema,
    outputSchema: EvaluateExpressionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
