import { FastifyInstance } from "fastify";
import { ParcelStatus } from "../entites/parcel";
import {
  changeParcelStatus,
  createParcel,
  generatePdf,
  getParcelByTrack,
} from "../services/parcel";

export default async function parcelRoutes(app: FastifyInstance) {
  app.post("/parcel", async (request, reply) => {
    const { recipientId } = request.body as { recipientId: string };

    if (!recipientId) {
      return reply.status(400).send({ error: "Recipient ID is required" });
    }

    try {
      const parcel = await createParcel(recipientId);
      return reply.status(201).send({
        trackNumber: parcel.trackNumber,
        status: parcel.status,
        message: "Parcel created successfully",
        id: parcel.id,
      });
    } catch (error) {
      return reply.status(500).send({ error: "Failed to create parcel" });
    }
  });

  app.get("/parcel/pdf/:id", async (request, reply) => {
    const { id } = request.params as {
      id: string;
    };

    try {
      const pdfBuffer = await generatePdf(id);
      reply.header("Content-Type", "application/pdf");
      reply.header(
        "Content-Disposition",
        `attachment; filename=parcel-${id}.pdf`
      );
      reply.send(pdfBuffer);
    } catch (error) {
      console.log(error);
      return reply.status(404).send({ error: "ERROR" });
    }
  });

  app.patch("/parcel/:track/status", async (request, reply) => {
    const { track } = request.params as { track: string };
    const { status } = request.body as { status: ParcelStatus };

    if (!status) {
      return reply.status(400).send({ error: "Status is required" });
    }

    try {
      const updatedParcel = await changeParcelStatus(track, status);
      if (!updatedParcel) {
        return reply.status(404).send({ error: "Parcel not found" });
      }

      return reply.status(200).send(updatedParcel);
    } catch (error) {
      return reply
        .status(500)
        .send({ error: "Failed to update parcel status" });
    }
  });

  app.get("/parcel/:track", async (request, reply) => {
    const { track } = request.params as { track: string };

    try {
      const parcel = await getParcelByTrack(track);
      if (!parcel) {
        return reply.status(404).send({ error: "Parcel not found" });
      }

      return reply.status(200).send(parcel);
    } catch (error) {
      return reply.status(500).send({ error: "Failed to retrieve parcel" });
    }
  });
}
