import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Recipient } from "./recepient";

export enum ParcelStatus {
  CREATED = "CREATED",
  RECEIVED = "RECEIVED",
  SENT = "SENT",
  DELIVERING = "DELIVERING",
}

@Entity()
export class Parcel {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  trackNumber: string;

  @Column()
  recipientId: string;

  @ManyToOne(() => Recipient, (recipient) => recipient.parcels)
  recipient: Recipient;

  @Column()
  status: ParcelStatus;
}
