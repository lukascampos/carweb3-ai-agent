import 'dotenv/config';
import { FastifyReply, FastifyRequest } from 'fastify';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { knowledge } from '../../knowledge';
import { newQuestionSchema } from '../routes/new-question.route';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined');
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: `Como um especialista no curso de Análise e Desenvolvimento de Sistemas você deve responder gentilmente aos alunos informações sobre o curso, com base nas informações a seguir: \n${knowledge}`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

export async function newQuestionController(request: FastifyRequest, reply: FastifyReply) {
  const validationResult = newQuestionSchema.safeParse(request.body);

  if (!validationResult.success) {
    return reply.status(400).send({
      error: 'Invalid request body',
      details: validationResult.error.errors,
    });
  }

  const { question } = validationResult.data;

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(question);

  return reply.send({
    question,
    response: result.response.text(),
  });
}
