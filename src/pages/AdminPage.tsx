import React from "react";
import axios from "axios";
import OpenAI from "openai";

const AdminPage = () => {
  const [firebaseData, setFirebaseData] = React.useState({});

  React.useEffect(() => {
    (async () => {
      const firebaseDatabaseUrl =
        "https://feedback-psa-default-rtdb.asia-southeast1.firebasedatabase.app/";

      await axios
        .get(`${firebaseDatabaseUrl}.json`)
        .then((response) => {
          // Handle the response data here
          const data = response.data;
          // @ts-ignore
          setFirebaseData(Object.values(data)[0]);
          console.log(firebaseData);
          //   setRows(Object.values(data));
          return data;
        })
        .catch((error) => {
          // Handle any errors here
          throw new Error("Error fetching data: " + error.message);
        });
    })();
  }, []);

  const handleAnalysis = async () => {
    for (const name in firebaseData) {
      console.log(name);

      const feedbackArray = [];

      const feedbacks = firebaseData[name];
      for (const key in feedbacks) {
        const feedback = feedbacks[key];
        if (feedback && feedback.feedback && feedback.date) {
          feedbackArray.push(
            `feedback: ${feedback.feedback} | date: ${feedback.date} ||`
          );
        }
      }

      console.log(feedbackArray);

      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_KEY,
        dangerouslyAllowBrowser: true,
      });

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `You are a LLM designed to identify a person's key trait.\n
                Based on the feedback and time given, use one word to identify the trait of the individual that summarises his values and belief. Your response should only consist of one word with no punctuations. \n
                [${feedbackArray.join("],[")}]`,
            },
          ],
          temperature: 1,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });

        console.log(response.choices[0].message.content);
        addEntryToDatabase(response.choices[0].message.content, name);

        // Uncomment this line to handle the result
        // setKeyTrait(response.choices[0].message.content);
      } catch (error) {
        console.error("Error:", error);
        // Handle any errors here
      }
    }
  };

  // Function to add a new trait to the Firebase Realtime Database
  async function addEntryToDatabase(newTrait: string, name: string) {
    try {
      const firebaseDatabaseUrl =
        "https://feedback-psa-default-rtdb.asia-southeast1.firebasedatabase.app/";
      const endpointPath = `employees/${name}`; // Update with your specific path

      // Fetch the current data from the database
      const response = await axios.get(
        `${firebaseDatabaseUrl}${endpointPath}.json`
      );
      const currentData = response.data || {}; // If there's no data yet, initialize an empty object

      // Create the new entry with the generated key
      currentData["PersonalityType"] = newTrait;

      // Update the database with the new data
      await axios.put(
        `${firebaseDatabaseUrl}${endpointPath}.json`,
        currentData
      );

      console.log("New entry added successfully:", newTrait);
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  }

  return <button onClick={handleAnalysis}>Analysis</button>;
};

export default AdminPage;
