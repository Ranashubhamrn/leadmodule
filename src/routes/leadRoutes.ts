import { FastifyInstance, FastifyPluginAsync } from "fastify";
import Lead, { ILead } from "../models/Leads";
import authenticate from '../hooks/authenticate';

const leadRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Create a new lead
  fastify.post(
    "/",
    // { preHandler: authenticate,
   {
      schema: {
        body: {
          type: "object",
          required: [
            "first_name",
            "last_name",
            "country_code",
            "location",
            "package_id",
            "package_name",
            "no_of_days",
            "pax",
          ],
          properties: {
            first_name: { type: "string" },
            last_name: { type: "string" },
            email: { type: "string", format: "email", nullable: true },
            country_code: { type: "number" },
            phone: { type: "string", nullable: true },
            instagram_user_name: { type: "string" },
            location: { type: "string" },
            package_id: { type: "string" },
            package_name: { type: "string" },
            no_of_days: { type: "number" },
            pax: { type: "number" },
          },
        anyOf: [
            { required: ['email'] },
            { required: ['phone'] },
          ],
          additionalProperties: false,
        },
      },
    },
    
    async (request, reply) => {
      const requestedData = request.body as {
        first_name: string;
        last_name: string;
        email: string;
        country_code: number;
        phone: string;
        instagram_user_name: string;
        location: string;
        package_id: number;
        package_name: string;
        no_of_days: number;
        pax: number;
      };
    //   const {
    //     first_name,
    //     last_name,
    //     email,
    //     country_code,
    //     phone,
    //     instagram_user_name,
    //     location,
    //     package_id,
    //     package_name,
    //     no_of_days,
    //     pax,
    //   } = request.body as {
    //     first_name: string;
    //     last_name: string;
    //     email: string;
    //     country_code: number;
    //     phone: string;
    //     instagram_user_name: string;
    //     location: string;
    //     package_id: number;
    //     package_name: string;
    //     no_of_days: number;
    //     pax: number;
    //   };

      const lead = new Lead(requestedData
    //     {

    //     first_name,
    //     last_name,
    //     email,
    //     country_code,
    //     phone,
    //     instagram_user_name,
    //     location,
    //     package_id,
    //     package_name,
    //     no_of_days,
    //     pax,
    //   }
    );

      try {
        await lead.save();
        reply.status(201).send(lead);
      } catch (error) {
        reply.status(400).send({ error: error });
      }
    }
  );

  // Get all leads
  fastify.get("/", async (_, reply) => {
    try {
      const leads = await Lead.find();
      reply.send(leads);
    } catch (error) {
      reply.status(400).send({ error: "Error fetching leads" });
    }
  });

  // Get a lead by ID
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const lead = await Lead.findById(id);
      if (lead) {
        reply.send(lead);
      } else {
        reply.status(404).send({ error: "Lead not found" });
      }
    } catch (error) {
      reply.status(400).send({ error: "Error fetching leads" });
    }
  });

  // Update a lead
  fastify.put("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const {
      first_name,
      last_name,
      email,
      country_code,
      phone,
      instagram_user_name,
      location,
      package_id,
      package_name,
      no_of_days,
      pax,
    } = request.body as {
      first_name: string;
      last_name: string;
      email: string;
      country_code: number;
      phone: string;
      instagram_user_name: string;
      location: string;
      package_id: number;
      package_name: string;
      no_of_days: number;
      pax: number;
    };

    try {
      const lead = await Lead.findByIdAndUpdate(
        id,
        {
          first_name,
          last_name,
          email,
          country_code,
          phone,
          instagram_user_name,
          location,
          package_id,
          package_name,
          no_of_days,
          pax,
        },
        { new: true }
      );
      if (lead) {
        reply.send(lead);
      } else {
        reply.status(404).send({ error: "Lead not found" });
      }
    } catch (error) {
      reply.status(400).send({ error: "Error updating Lead" });
    }
  });

  // Delete a lead
  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const lead = await Lead.findByIdAndDelete(id);
      if (lead) {
        reply.status(204).send();
      } else {
        reply.status(404).send({ error: "Lead not found" });
      }
    } catch (error) {
      reply.status(400).send({ error: "Error deleting Lead" });
    }
  });
};

export default leadRoutes;
