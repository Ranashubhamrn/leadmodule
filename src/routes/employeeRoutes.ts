import { FastifyInstance, FastifyPluginAsync } from "fastify";
import Employee, { IEmployee } from "../models/Employees";

const employeeRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Create a new employee
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: [
            "first_name",
            "last_name",
            "email",
            "password"
          ],
          properties: {
            first_name: { type: "string" },
            last_name: { type: "string" },
            email: { type: "string", format: "email", nullable: true },
           password :{ type: "string" },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const {
        first_name,
        last_name,
        email,
        password
      } = request.body as {
        first_name: string;
        last_name: string;
        email: string;
        password :string;
      };
      const hashedPassword = await fastify.bcrypt.hash(password);

      const employee = new Employee({
        first_name,
        last_name,
        email,
        password: hashedPassword
      });

      try {
        await employee.save();
        reply.status(201).send(employee);
      } catch (error) {
        reply.status(400).send({ error: error });
      }
    }
  );

  // Get all Employees
  fastify.get("/", async (_, reply) => {
    try {
      const employees = await Employee.find();
      reply.send(employees);
    } catch (error) {
      reply.status(400).send({ error: "Error fetching Employees" });
    }
  });

  // Get a Employee by ID
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const employee = await Employee.findById(id);
      if (employee) {
        reply.send(employee);
      } else {
        reply.status(404).send({ error: "Employee not found" });
      }
    } catch (error) {
      reply.status(400).send({ error: "Error fetching emplyees" });
    }
  });

  // Update a Employee
  fastify.put("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const {
      first_name,
      last_name,
      email,
    password
    } = request.body as {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    };

    try {
      const employee = await Employee.findByIdAndUpdate(
        id,
        {
          first_name,
          last_name,
          email,
          password
        },
        { new: true }
      );
      if (employee) {
        reply.send(employee);
      } else {
        reply.status(404).send({ error: "Employee not found" });
      }
    } catch (error) {
      reply.status(400).send({ error: "Error updating Employee" });
    }
  });

  // Delete a Employee
  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const employee = await Employee.findByIdAndDelete(id);
      if (employee) {
        reply.status(204).send();
      } else {
        reply.status(404).send({ error: "Employee not found" });
      }
    } catch (error) {
      reply.status(400).send({ error: "Error deleting Employee" });
    }
  });

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };
  
    try {
      const employee = await Employee.findOne({ email });
      if (!employee) {
        return reply.status(401).send({ error: 'Invalid email or password' });
      }
  
      const isMatch = await fastify.bcrypt.compare(password, employee.password);
      if (!isMatch) {
        return reply.status(401).send({ error: 'Invalid email or password' });
      }
  
      // Proceed with generating a token or session
    //   const token = fastify.jwt.sign({ id: employee._id, email: employee.email });
     // Generate Access Token (expires in 1 hour)
     const accessToken = fastify.jwt.sign(
        { id: employee._id, email: employee.email },
        { expiresIn: '1h' }
      );
  
      // Generate Refresh Token (expires in 7 days)
      const refreshToken = fastify.jwt.sign(
        { id: employee._id, email: employee.email },
        { expiresIn: '7d' }
      );
  
      // Set the refresh token in an HttpOnly cookie
      reply
        .setCookie('refreshToken', refreshToken, {
          httpOnly: true,          // Secure the cookie from client-side JavaScript
          secure: process.env.NODE_ENV === 'production', // Set to true in production (HTTPS)
          path: '/',              // Available for all routes
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: 'strict',     // Prevent CSRF attacks
        })
        .send({
          message: 'Login successful',
          token: accessToken,  // Access token sent in response body
        });
      reply.send({ message: 'Login successful' ,token:accessToken});
    } catch (error) {
      reply.status(400).send({ error: error });
      
    }
  });
};

export default employeeRoutes;
