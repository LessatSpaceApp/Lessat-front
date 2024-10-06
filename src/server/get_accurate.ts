import { type SatQueryRes } from "@/types/sat-query";
import axios from "axios";

export async function getAccurate(
  latitude: number,
  longitude: number,
  altitude: number,
  date: number,
) {
  const ls8 = await axios.get<SatQueryRes>(
    `https://api.n2yo.com/rest/v1/satellite/radiopasses/39084/${latitude}/${longitude}/${altitude}/10/0?apiKey=${process.env.N2YO_API_KEY}`,
  );
  const ls9 = await axios.get<SatQueryRes>(
    `https://api.n2yo.com/rest/v1/satellite/radiopasses/49260/${latitude}/${longitude}/${altitude}/10/0?apiKey=${process.env.N2YO_API_KEY}`,
  );

  console.log({ ls8, ls9 });

  return {
    landsat_8: ls8.data.passes.map((p) => ({ ...p, sat: "landsat8" }))[0],
    // .find((p) => Math.abs(p.startUTC * 1000 - date) < 24 * 3600 * 1000),
    landsat_9: ls9.data.passes.map((p) => ({ ...p, sat: "landsat9" }))[0],
    // .find((p) => Math.abs(p.startUTC * 1000 - date) < 24 * 3600 * 1000),
  };
}
