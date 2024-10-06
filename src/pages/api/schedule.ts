import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { reminders } from "@/server/db/schema";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerAuthSession({ req, res });
  await db.insert(reminders).values([
    {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      type: "tomorrow",
      userId: session?.user.id ?? "3dc1cfa0-0ae7-4de6-949e-2355d563d6ee",
      date: new addDays(Date(req.body.date), -1),
      sent: false,
    },
    {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      type: "near",
      userId: session?.user.id ?? "3dc1cfa0-0ae7-4de6-949e-2355d563d6ee",
      date: new Date(req.body.date),
      sent: false,
    },
    {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      type: "data_ready",
      userId: session?.user.id ?? "3dc1cfa0-0ae7-4de6-949e-2355d563d6ee",
      date: new addDays(Date(req.body.date), 1),
      sent: false,
    },
  ]);
  return res.status(200).send();
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
