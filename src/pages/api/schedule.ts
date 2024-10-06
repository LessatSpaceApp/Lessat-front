import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { reminders } from "@/server/db/schema";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerAuthSession({ req, res });
  await db.insert(reminders).values({
    ...req.body,
    userId: session?.user.id ?? "3dc1cfa0-0ae7-4de6-949e-2355d563d6ee",
    date: new Date(req.body.date),
    sent: false,
  });
  return res.status(200).send();
}
