import axios from "axios";
let config = {
  method: "post",
  url: "http://localhost:3000/api/cron",
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
