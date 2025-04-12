import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify({
  logger: true,
});

app.register(cors);
app.register(import("./controllers/parcel"));
app.register(import("./controllers/recipent"));

app.listen({ port: 8000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${address}`);
});
