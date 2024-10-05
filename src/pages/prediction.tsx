import NoSsr from "@/components/NoSsr";
import { Pass, type SatQueryRes } from "@/types/sat-query";
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
      <>
        <p>{JSON.stringify(state, undefined, 4)}</p>
        <br />
        <h1>loading: {sateliteQuery.status}</h1>
        <p>{sateliteQuery.data?.length}</p>
        {sateliteQuery.data?.map((p, i) => (
          <p key={i}>
            {timeConverter(p.startUTC)} - {p.duration} - {p.sat}
          </p>
        ))}
      </>
    </NoSsr>
  );
}

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}
