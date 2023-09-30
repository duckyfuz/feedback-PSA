import React, { useState } from "react";
// import { CssVarsProvider } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Slider from "@mui/joy/Slider";
import Button from "@mui/joy/Button";
import { Input } from "@mui/joy";

const Survey: React.FC = () => {
  const [openEnded1, setOpenEnded1] = useState("");
  const [openEnded2, setOpenEnded2] = useState("");
  const [slider1, setSlider1] = useState(0);
  const [slider2, setSlider2] = useState(0);

  const handleSubmit = () => {
    // Add logic to handle the submission of survey data
    // Add the survey data into database
    //return to the home page
  };

  return (
    // <CssVarsProvider>
    //   <Box
    //     sx={{
    //       position: "fixed",
    //       top: 0,
    //       left: 0,
    //       width: "100vw",
    //       height: "100vh",
    //       zIndex: 999, // Set an appropriate z-index if needed
    //     }}
    //   >
    <CssVarsProvider>
      <Sheet
        sx={{
          width: 400,
          height: 500,
          my: 4, // margin top & bottom
          py: 3, // padding top & bottom
          px: 2, // padding left & right
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "sm",
          boxShadow: "md",
          mx: "auto",
          overflow: "auto",
        }}
      >
        <Typography level="h4" component="h1">
          PSA Bi-Annually Satisfactory Survey
        </Typography>
        <div>
          <Typography level="body-sm">
            What is your satisfaction level in your current role? (1-10)
          </Typography>
          <Slider
            value={slider1}
            valueLabelDisplay="auto"
            max={10}
            min={1}
            onChange={(e, value) => {
              console.log(e);
              setSlider1(value as number);
            }}
            sx={{ my: 3 }}
          />
        </div>
        <div>
          <Typography level="body-sm">
            Suggestion to improve current work proccesses. (Be as detailed as
            possible!)
          </Typography>
          <Input
            type="text"
            value={openEnded1}
            onChange={(e) => setOpenEnded1(e.target.value)}
            sx={{ my: 3 }}
          />
        </div>
        <div>
          <Typography level="body-sm">
            What is your satisfaction level in your Work Life Balance? (1-10)
          </Typography>
          <Slider
            value={slider2}
            valueLabelDisplay="auto"
            max={10}
            min={1}
            onChange={(e, value) => {
              console.log(e);
              setSlider2(value as number);
            }}
            sx={{ my: 3 }}
          />
        </div>
        <div>
          <Typography level="body-sm">
            Suggestion to improve Work Life Balance. (Be as detailed as
            possible!)
          </Typography>
          <Input
            type="text"
            value={openEnded2}
            onChange={(e) => setOpenEnded2(e.target.value)}
            sx={{ my: 3 }}
          />
        </div>

        <Button onClick={handleSubmit}>Submit</Button>
      </Sheet>
    </CssVarsProvider>
  );
};

export default Survey;
