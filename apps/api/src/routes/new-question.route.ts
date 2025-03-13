import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { newQuestionController } from '../controller/new-question.controller';

export const newQuestionSchema = z.object({
  question: z.string()
});

export async function newQuestionRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/new-question', {
    schema: {
      body: newQuestionSchema
    }
  }, newQuestionController);
}