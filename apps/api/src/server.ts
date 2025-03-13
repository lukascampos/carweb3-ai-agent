import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { newQuestionRoute } from './routes/new-question.route';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors);

app.withTypeProvider<ZodTypeProvider>().get('/', () => 'hello world');

app.register(newQuestionRoute);

app.listen({ port: 3333, host: '0.0.0.0'}).then(() => {
  console.log('HTTP server running');
});
