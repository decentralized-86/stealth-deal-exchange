import axios from "axios";
import config from "@/next.config";

const request = (graphql: unknown) =>
  axios
    .post("https://graph.defined.fi/graphql", JSON.stringify(graphql), {
      headers: {
        authorization: config.definedFi.key,
        "content-type": "application/json",
      },
    })
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      console.error("Error making the request", error);
      return null;
    });

export default request;
