import "reflect-metadata";
import { DataSource } from "typeorm";
import { Parcel } from "./entites/parcel";
import { Recipient } from "./entites/recepient";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./db.sqlite",
  synchronize: true,
  logging: true,
  entities: [Parcel, Recipient],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
