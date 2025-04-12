import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Parcel } from "./parcel";

@Entity()
export class Recipient {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @OneToMany(() => Parcel, (parcel) => parcel.recipient)
  parcels?: Parcel[];
}
