import { AppDataSource } from "../db";
import { Recipient } from "../entites/recepient";

export const createRecepient = async (recepient: Omit<Recipient, "id">) => {
  const recipientRepository = AppDataSource.getRepository(Recipient);

  let recipient = await recipientRepository.findOne({
    where: {
      name: recepient.name,
    },
  });
  if (!recipient) {
    recipient = await recipientRepository.save({
      name: recepient.name,
      address: recepient.address,
    });
  }

  return recipient;
};

export const getRecipientParcelsByName = async (name: string) => {
  const recipientRepository = AppDataSource.getRepository(Recipient);

  const recipient = await recipientRepository.findOne({
    where: {
      name: name,
    },
    relations: ["parcels"],
  });

  if (!recipient) {
    return null;
  }

  return recipient.parcels;
};
