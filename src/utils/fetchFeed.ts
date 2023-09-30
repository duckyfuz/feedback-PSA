import axios from "axios";

export const fetchFeed = async () => {
  const firebaseDatabaseUrl =
    "https://feedback-psa-default-rtdb.asia-southeast1.firebasedatabase.app/";
  const endpointPath = "employees/Joseph"; //

  await axios
    .get(`${firebaseDatabaseUrl}${endpointPath}.json`)
    .then((response) => {
      // Handle the response data here
      const data = response.data;
      console.log(data);
      return data;
    })
    .catch((error) => {
      // Handle any errors here
      throw new Error("Error fetching data: " + error.message);
    });
};
