import { AppDataSource } from "../db";
import { Parcel, ParcelStatus } from "../entites/parcel";
import ejs from "ejs";
import path from "path";
import puppeteer from "puppeteer";

import { cwd } from "process";

const createTrack = (): string => {
  const rand = Math.floor(1000000000 + Math.random() * 9000000000);
  return `KZ${rand}`;
};
export const createParcel = async (recipientId: string) => {
  const trackNumber = createTrack();
  const parcelRepository = AppDataSource.getRepository(Parcel);
  const newParcel = new Parcel();
  newParcel.trackNumber = trackNumber;
  newParcel.recipientId = recipientId;
  newParcel.status = ParcelStatus.CREATED;

  const created = await parcelRepository.save(newParcel);

  return created;
};

export async function generatePdf(parcelId: string) {
  const parcelRepository = AppDataSource.getRepository(Parcel);
  const parcelData = await parcelRepository.findOne({
    where: { id: parcelId },
    relations: { recipient: true },
  });

  if (!parcelData) {
    throw new Error("Parcel not found");
  }
  console.log(parcelData, "parcelData");
  const html = await ejs.renderFile(
    path.join(cwd(), "templates", "parcel.ejs"),
    { parcel: parcelData }
  );

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "domcontentloaded" });

  const pdfBuffer = await page.pdf({ width: "200px", height: "300px" });

  await browser.close();

  return pdfBuffer;
}

export const changeParcelStatus = async (
  trackNumber: string,
  newStatus: ParcelStatus
): Promise<Parcel | null> => {
  const parcelRepository = AppDataSource.getRepository(Parcel);

  const parcel = await parcelRepository.findOne({ where: { trackNumber } });

  if (!parcel) {
    return null;
  }

  parcel.status = newStatus;

  const updatedParcel = await parcelRepository.save(parcel);

  return updatedParcel;
};

export const getParcelByTrack = async (
  trackNumber: string
): Promise<Parcel | null> => {
  const parcelRepository = AppDataSource.getRepository(Parcel);

  const parcel = await parcelRepository.findOne({
    where: { trackNumber },
    relations: {
      recipient: true,
    },
  });

  return parcel;
};
