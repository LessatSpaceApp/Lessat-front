import NoSsr from "@/components/NoSsr";
import { timeConverter } from "@/lib/utils";
import type { Pass } from "@/types/sat-query";
import { useQuery } from "@tanstack/react-query";
import { useGeolocation } from "@uidotdev/usehooks";
import axios from "axios";

export default function Prediction() {
  const state = useGeolocation();
  const sateliteQuery = useQuery({
    queryKey: ["satloc", state.latitude, state.longitude, state.altitude],
    queryFn: async () => {
      const res = await axios.get<Pass[]>(`api/passes`, {
        params: {
          latitude: state.latitude,
          longitude: state.longitude,
          altitude: state.altitude,
        },
      });
      return res.data;
    },
  });

  return (
    <NoSsr>
      <div className="bg-white">
        <p>{JSON.stringify(state, undefined, 4)}</p>
        <br />
        <h1>loading: {sateliteQuery.status}</h1>
        <p>{sateliteQuery.data?.length}</p>
        {sateliteQuery.data
          ?.filter(
            (p) => Math.abs(p.startUTC * 1000 - Date.now()) < 12 * 3600 * 1000,
          )
          .slice(0, 1)
          .map((p, i) => (
            <p key={i}>
              {timeConverter(p.startUTC)} - {JSON.stringify(p)}
            </p>
          ))}
      </div>
    </NoSsr>
  );
}
