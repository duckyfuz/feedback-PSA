import React from "react";
import axios from "axios";
import OpenAI from "openai";
import Modal from "@mui/joy/Modal";

import {
  CssVarsProvider,
  CssBaseline,
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Sheet,
  Button,
  Stack,
  CircularProgress,
  ModalClose,
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
  const [analysisLoading, setAnalysisLoading] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [toggle, setToggle] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setAnalysisLoading(true);
      const firebaseDatabaseUrl =
        "https://feedback-psa-default-rtdb.asia-southeast1.firebasedatabase.app/";

      await axios
        .get(`${firebaseDatabaseUrl}.json`)
        .then((response) => {
          // Handle the response data here
          const data = response.data;
          setFirebaseData(data.employees);
          setPersonalityData(data.personality);
          console.log(data.personality);
          return data;
        })
        .catch((error) => {
          // Handle any errors here
          throw new Error("Error fetching data: " + error.message);
        });
      setAnalysisLoading(false);
    })();
  }, [toggle]);

  function extractFeedback(data: any) {
    const result = {};

    for (const person in data) {
      // @ts-ignore
      result[person] = Object.values(data[person]).map(
        // @ts-ignore
        (feedbackObj) => feedbackObj.feedback
      );
    }

    return result;
  }

  // Function that assesses the characteristic of an individual based on his/her feedback
  const handleAnalysis = async () => {
    setAnalysisLoading(true);

    // @ts-ignore
    if (firebaseData.length === 0) {
      alert("Employee data not loaded. Try again later.");
      return;
    }
    let employeeData = firebaseData;
    // @ts-ignore
    delete employeeData["Company"];
    employeeData = extractFeedback(employeeData);
    console.log(employeeData);

    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      const prompt = `Analyze the feedback and employees object and rank the employees based on their effort. Then, generate a list of 5 personality traits most appreciated by the employees.\n
      Additionally, generate a short report about the employee that sums up his or her strengths and weaknesses. Here's an example: "Jason is a hardworking employee who has... However, he lacks in time management skills...".\n
      Your response should be in a JSON format as such: {"keyTraits": [trait1, trait2], "ranking": [[employee1, shortReport], [employee2, shortReport]]}.\n
      EmployeesFeedback = ${JSON.stringify(employeeData)}`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 1,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const content = response.choices[0].message.content;
      console.log(content);
      try {
        // @ts-ignore
        const data = JSON.parse(content);
        console.log(data);
        addEntryToDatabase(data);
      } catch (error) {
        console.error("Error:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setAnalysisLoading(false);
  };

  // Function to add a new trait to the Firebase Realtime Database
  function addEntryToDatabase(data: any) {
    try {
      const firebaseDatabaseUrl =
        "https://feedback-psa-default-rtdb.asia-southeast1.firebasedatabase.app/";
      const endpointPath = `personality/`; // Update with your specific path
      axios.put(`${firebaseDatabaseUrl}${endpointPath}.json`, data);

      setToggle(!toggle);

      // setFirebaseData(data.employees);
      // setPersonalityData(data.personality);
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  }

  function viewHandler(index: number) {
    // @ts-ignore
    const employee = personalityData.ranking[index];
    console.log(employee);
    setSelectedEmployee(employee);
    setOpenModal(true);
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
            <Breadcrumbs size="sm" aria-label="breadcrumbs" sx={{ pl: 0 }}>
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
              loading={analysisLoading}
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
                  Employee leaderboards
                </Typography>
                <TopEmployeeTable
                  personalityData={personalityData}
                  viewHandler={viewHandler}
                />
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
      <Modal
        aria-labelledby="close-modal-title"
        open={openModal}
        onClose={() => {
          setSelectedEmployee([]);
          setOpenModal(false);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Sheet
          variant="outlined"
          sx={{
            width: "70%",
            maxHeight: "100%",
            minHeight: "70%",
            borderRadius: "md",
            p: 4,
          }}
          style={{ overflow: "auto" }}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            {selectedEmployee.length !== 0 ? (
              <>
                <Typography
                  component="h2"
                  id="modal-description"
                  level="h1"
                  textColor="inherit"
                  fontWeight="md"
                  paddingBottom={2}
                >
                  {selectedEmployee[0]} Review
                </Typography>
                <ModalClose variant="outlined" />
                <Typography
                  id="modal-description"
                  textColor="inherit"
                  fontWeight="md"
                  sx={{ whiteSpace: "pre-line" }}
                >
                  {/* @ts-ignore */}
                  {selectedEmployee[1].split("\n").map((i, key) => {
                    return <p key={key}>{i}</p>;
                  })}
                </Typography>
              </>
            ) : (
              <Stack alignItems="center">
                <CircularProgress sx={{ my: 3 }} size="md" />
                <Typography
                  // component="h2"
                  id="modal-description"
                  level="body-md"
                  textColor="inherit"
                  fontWeight="md"
                  paddingTop={1}
                >
                  Generating Summary...
                </Typography>
              </Stack>
            )}
          </Stack>
        </Sheet>
      </Modal>
    </CssVarsProvider>
  );
};

export default AdminPage;
