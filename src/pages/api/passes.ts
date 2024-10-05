/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { SatQueryRes } from "@/types/sat-query";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const ls8 = await axios.get<SatQueryRes>(
    `https://api.n2yo.com/rest/v1/satellite/visualpasses/39084/${req.query.latitude}/${req.query.longitude}/${req.query.altitude}/10/1?apiKey=${process.env.N2YO_API_KEY}`,
  );
  const ls9 = await axios.get<SatQueryRes>(
    `https://api.n2yo.com/rest/v1/satellite/visualpasses/49260/${req.query.latitude}/${req.query.longitude}/${req.query.altitude}/10/1?apiKey=${process.env.N2YO_API_KEY}`,
  );

  const data = [
    ...ls8.data.passes.map((p) => ({ ...p, sat: "landsat8" })),
    ...ls9.data.passes.map((p) => ({ ...p, sat: "landsat9" })),
  ];
  return res.status(200).json(data);
}
