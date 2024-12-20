import { FastifyInstance, FastifyPluginAsync } from "fastify";
interface JwtPayload {
    id: string;
    email: string;
  }
  
const authenticateRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
fastify.post('/refresh-token', async (request, reply) => {
    try {
      // Get the refresh token from the cookie
      const refreshToken = request.cookies.refreshToken;
  
      if (!refreshToken) {
        return reply.status(401).send({ error: 'No refresh token provided' });
      }
  
      // Verify the refresh token
        // Verify the refresh token
        const decoded = fastify.jwt.verify<JwtPayload>(refreshToken);
    //   const decoded = await fastify.jwt.verify(refreshToken);
  
      // Generate a new access token using the decoded information from the refresh token
      const accessToken = fastify.jwt.sign(
        { id: decoded.id, email: decoded.email },
        { expiresIn: '1h' }
      );
  
      // Send the new access token to the client
      reply.send({ message: 'Access token refreshed', token: accessToken });
    } catch (error) {
      reply.status(401).send({ error: 'Invalid or expired refresh token' });
    }
  });
}
export default authenticateRoutes;
  