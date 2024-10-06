import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { reminders } from "@/server/db/schema";
import { and, eq, gte } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await db.transaction(async (tx) => {
    const schedules = await tx.query.reminders.findMany({
      where: and(eq(reminders.sent, false), gte(reminders.date, new Date())),
    });
  });

  return res.status(200).send();
}
