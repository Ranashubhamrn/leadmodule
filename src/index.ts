import Fastify from 'fastify';
import fastifyBcrypt from 'fastify-bcrypt';
import fastifyJwt from '@fastify/jwt';
import dotenv from 'dotenv';
import leadRoutes from './routes/leadRoutes';
import employeeRoutes from './routes/employeeRoutes';
import aunthenticationRoutes from './routes/authenticationRoutes';
import mongoose from 'mongoose';
import fastifyCookie from 'fastify-cookie';

const fastify = Fastify ({
    logger:true
});
fastify.register(fastifyBcrypt, {
    saltWorkFactor: 11, 
  });
  // Register the fastify-jwt plugin
fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'shubham',
  });
  fastify.register(fastifyCookie);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shubham')
  .then(() => {
    fastify.log.info('Connected to MongoDB');
  })
  .catch((err) => {
    fastify.log.error('Error connecting to MongoDB', err);
    process.exit(1);
  });
  // Register the lead routes
fastify.register(leadRoutes, { prefix: '/leads' });
fastify.register(employeeRoutes, { prefix: '/employees' });
fastify.register(aunthenticationRoutes, { prefix: '/authenticate' });
// Start the server
const start = async () => {
    try {
      await fastify.listen({port: 3000, host: '0.0.0.0'});  // Listen on all network interfaces
      fastify.log.info(`Server listening at http://localhost:3000`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };

start();


