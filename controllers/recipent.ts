import { FastifyInstance } from "fastify";
import {
  createRecepient,
  getRecipientParcelsByName,
} from "../services/recepient";

export default async function recipientRoutes(app: FastifyInstance) {
  app.post("/recipient", async (request, reply) => {
    const { name, address } = request.body as {
      name: string;
      address: string;
    };

    if (!name || !address) {
      return reply.status(400).send({ error: "Missing required fields" });
    }

    try {
      const recipient = await createRecepient({ name, address });
      return reply.status(201).send(recipient);
    } catch (error) {
      return reply.status(500).send({ error: "Failed to create recipient" });
    }
  });

  app.get("/recipient/:name/parcels", async (request, reply) => {
    const { name } = request.params as { name: string };

    try {
      const parcels = await getRecipientParcelsByName(name);
      if (!parcels) {
        return reply
          .status(404)
          .send({ error: "Recipient not found or no parcels" });
      }

      return reply.status(200).send(parcels);
    } catch (error) {
      return reply
        .status(500)
        .send({ error: "Failed to retrieve recipient parcels" });
    }
  });
}
