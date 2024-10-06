/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Cycles } from "@/types/cycles";
import { NimbusResponse } from "@/types/nimbus";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("Query")
try{
  const query = await axios.request<NimbusResponse>({
    method: "get",
    url: `https://nimbus.cr.usgs.gov/arcgis/rest/services/LLook_Outlines/MapServer/1/query?where=MODE=%27D%27&geometry=${req.query.latitude},%20${req.query.longitude}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&returnTrueCurves=false&returnIdsOnly=false&returnCountOnly=false&returnZ=false&returnM=false&returnDistinctValues=false&f=json`,
  });
  const cycles = await axios.request<Cycles>({
    method: "get",
    url: "https://landsat.usgs.gov/sites/default/files/landsat_acq/assets/json/cycles_full.json",
  });
    

  // const row = query.data.features[0]?.attributes.ROW;
  const path = query.data.features[0]?.attributes.PATH;
  const ls8 = Object.entries(cycles.data.landsat_8).find(([d, e]) => {
    console.log({ d, e });
    return e.path.includes(path) && new Date(d) > new Date();
  });
  const ls9 = Object.entries(cycles.data.landsat_9).find(([d, e]) => {
    console.log({ d, e });
    return e.path.includes(path) && new Date(d) > new Date();
  });

  return res.status(200).json({ landsat8: ls8[0], landsat9: ls9[0] });
}
catch (error){
  console.error(error)
  console.log(error.message)
  return res.status(500).json("")
}

}
