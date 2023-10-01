import React from "react";
import axios from "axios";
import OpenAI from "openai";

import {
  CssVarsProvider,
  CssBaseline,
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Sheet,
  Button,
} from "@mui/joy";
import ColorSchemeToggle from "../components_old/ColorSchemeToggle";
import Header from "../components_old/Header";

//icons
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PsychologyIcon from "@mui/icons-material/Psychology";

//components
import TopEmployeeTable from "../adminPageComponents/TopEmployeeTable";

const AdminPage = () => {
  const [firebaseData, setFirebaseData] = React.useState({});
  const [personalityData, setPersonalityData] = React.useState({});

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
          // @ts-ignore
          setPersonalityData(Object.values(data)[1]);
          //   setRows(Object.values(data));
          return data;
        })
        .catch((error) => {
          // Handle any errors here
          throw new Error("Error fetching data: " + error.message);
        });
    })();
  }, []);

  //Function that assesses the characteristic of an individual based on his/her feedback
  const handleAnalysis = async () => {
    let rank = 1;
    for (const name in firebaseData) {
      console.log(name);

      const feedbackArray = [];
      if (name !== "Company") {
        const feedbacks = firebaseData[name];
        for (const key in feedbacks) {
          const feedback = feedbacks[key];
          if (feedback && feedback.feedback && feedback.date) {
            feedbackArray.push(
              `feedback: ${feedback.feedback} | date: ${feedback.date} ||`
            );
          }
        }
      }
      //@ts-ignore

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
              content: `You are a LLM designed to identify a person's key characteristic.\n
                Based on the feedback and time given, use one word to identify the characteristic of the individual that summarises his values and belief. Your response should only consist of one word with no punctuations. \n
                [${feedbackArray.join("],[")}]`,
            },
          ],
          temperature: 1,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });

        //@ts-ignore
        const content: string = response.choices[0].message.content;
        console.log(content);
        addEntryToDatabase(content, name, rank);
        rank += 1;

        // Uncomment this line to handle the result
        // setKeyTrait(response.choices[0].message.content);
      } catch (error) {
        console.error("Error:", error);
        // Handle any errors here
      }
    }
  };

  // Function to add a new trait to the Firebase Realtime Database
  function addEntryToDatabase(newTrait: string, name: string, rank: number) {
    try {
      const firebaseDatabaseUrl =
        "https://feedback-psa-default-rtdb.asia-southeast1.firebasedatabase.app/";
      const endpointPath = `personality/`; // Update with your specific path

      // Fetch the current data from the database
      const response = axios.get(`${firebaseDatabaseUrl}${endpointPath}.json`);
      const currentData = response.data || {}; // If there's no data yet, initialize an empty object

      if (currentData[name]) {
        // If it does, update the existing entry
        currentData[name]["key_trait"] = newTrait;
        currentData[name]["rank"] = rank;
      } else {
        // If not, create a new entry with a unique key using push()
        currentData[name] = {
          key_trait: newTrait,
          rank: rank,
        };
      }

      // Update the database with the new data
      axios.put(`${firebaseDatabaseUrl}${endpointPath}.json`, currentData);

      console.log("New entry added successfully:", newTrait);
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh", width: "100vw" }}>
        <Header />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: {
              xs: 2,
              md: 6,
            },
            pt: {
              xs: "calc(12px + var(--Header-height))",
              sm: "calc(12px + var(--Header-height))",
              md: 3,
            },
            pb: {
              xs: 2,
              sm: 2,
              md: 3,
            },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              //   separator={
              //     <ChevronRightRoundedIcon
              //     // fontSize="sm"
              //     />
              //   }
              sx={{ pl: 0 }}
            >
              <Link
                underline="none"
                color="neutral"
                href="../"
                aria-label="Home"
              >
                <HomeRoundedIcon />
              </Link>
              <Typography color="primary" fontWeight={500} fontSize={12}>
                Admin Page
              </Typography>
            </Breadcrumbs>
            <ColorSchemeToggle
              sx={{ ml: "auto", display: { xs: "none", md: "inline-flex" } }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              my: 1,
              marginBottom: 2,
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "start", sm: "center" },
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography level="h2" marginBottom={2}>
              Welcome Admin!
            </Typography>
            <Button
              color="primary"
              startDecorator={<PsychologyIcon />}
              size="md"
              onClick={handleAnalysis}
            >
              Reanalyse feedback!
            </Button>
            <Box
              sx={{
                width: "100%",
                display: "flex",
              }}
            >
              <Sheet
                sx={{
                  width: "60%", // Set width to 40% of parent element
                  padding: "16px", // Add some padding for content
                  borderRadius: "12px",
                  height: 400,
                  mr: 5,
                }}
              >
                <Typography level="h3" textAlign={"center"}>
                  Top Employees
                </Typography>
                <TopEmployeeTable personalityData={personalityData} />
              </Sheet>
              <Box sx={{ display: "block", marginLeft: "auto", width: "40%" }}>
                <Sheet
                  sx={{
                    width: "100%", // Set width to 40% of parent element
                    padding: "16px", // Add some padding for content
                    borderRadius: "12px",
                    height: 150,
                    mb: 5,
                  }}
                >
                  <Typography level="h3" textAlign={"center"}>
                    Top Personality
                  </Typography>

                  <Typography level="h4" textAlign={"center"}>
                    Kenneth
                  </Typography>
                </Sheet>
                <Sheet
                  sx={{
                    width: "100%", // Set width to 40% of parent element
                    padding: "16px", // Add some padding for content
                    borderRadius: "12px",
                    height: 210,
                  }}
                >
                  <Typography level="h3">
                    Bi-Annual Survey Feedback Results
                  </Typography>
                </Sheet>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
};

export default AdminPage;
