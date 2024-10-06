/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { timeConverter } from "@/lib/utils";
import { db } from "@/server/db";
import { reminders } from "@/server/db/schema";
import { getAccurate } from "@/server/get_accurate";
import { and, eq, gte, lte } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await db.transaction(async (tx) => {
    const schedules = await tx.query.reminders.findMany({
      where: and(eq(reminders.sent, false), lte(reminders.date, new Date())),
      with: {
        user: true,
      },
    });
    console.log({ schedules });
    const settled = await Promise.allSettled(
      schedules.map(async (s) => {
        await sendMail(s);
        await tx
          .update(reminders)
          .set({ sent: true })
          .where(eq(reminders.id, s.id));
      }),
    );
    // console.log(settled);
  });

  return res.status(200).send("sent");
}

async function sendMail(details: Schedule) {
  let subject = "";
  let text = "";
  const loc = await getAccurate(
    parseFloat(details.latitude!),
    parseFloat(details.longitude!),
    parseFloat(details.altitude!),
    details.date.getTime(),
  );
  console.log(loc);
  console.log(details);
  switch (details.type) {
    case "tomorrow":
      subject = `${details.satellite} scan is near`;
      text = `${details.satellite} will pass above your location:

LAT: ${details.latitude}
LON: ${details.longitude}

Estimated time: ${timeConverter(loc[details.satellite as "landsat_8" | "landsat_9"]!.startUTC)}

Prepare to take measurments!
`;
      break;
    case "near":
      subject = `${details.satellite} is near`;
      text = `${details.satellite} will be near your location soon:

LAT: ${details.latitude}
LON: ${details.longitude}

Estimated time: ${timeConverter(loc[details.satellite as "landsat_8" | "landsat_9"]!.startUTC)}

Prepare to take measurements.
`;
      break;
    case "data_ready":
      subject = `Data from ${details.satellite}`;
      text = `The data from ${details.satellite} is already available!

Check it out here: ${"example url"}
`;
      break;
    default:
      return;
  }
  await transporter.sendMail({
    from: '"Lessat" <lessat@bestem.dev>', // sender address
    to: "francescogentile1@hotmail.com, francescogentyle@gmail.com", // list of receivers
    subject,
    text,
  });
}

type Schedule = {
  date: Date;
  id: string;
  type: string | null;
  userId: string;
  latitude: string | null;
  longitude: string | null;
  altitude: string | null;
  satellite: string | null;
  sent: boolean | null;
  user: {
    email: string;
  };
};
