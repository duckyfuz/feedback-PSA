import Button from "@mui/joy/Button";
import { CssVarsProvider } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { useNavigate } from "react-router-dom";
import { Box, Modal } from "@mui/joy";
import { useState } from "react";

import Survey from "./pages/Survey";

const Home = () => {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const navigate = useNavigate();
  const handleClick = (param: string) => {
    if (param === "Employee") {
      navigate("/FeedbackPage");
    }
  };

  return (
    <CssVarsProvider>
      <Box
        mx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 999,
          backgroundColor: "#000000",
        }}
      >
        <Sheet
          sx={{
            width: 300,
            mx: "auto",
            my: 10, // margin top & bottom
            py: 3, // padding top & bottom
            px: 2, // padding left & right
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: "sm",
            boxShadow: "md",
            backgroundColor: "#363232",
          }}
        >
          <Typography level="h4" component="h1">
            Welcome!
          </Typography>
          <Typography level="body-sm">
            Choose the type of access to continue.
          </Typography>
          <Button sx={{ mt: 1 }} onClick={() => handleClick("Employee")}>
            Employee Access
          </Button>
          <Button
            sx={{ mt: 1 /* margin top */ }}
            onClick={() => handleClick("Employer")}
          >
            Employer Access
          </Button>
          {/* Do Survey */}
          <Button
            sx={{ mt: 1 /* margin top */ }}
            onClick={() => setOpenDetailsModal(true)}
          >
            Bi-Annual Satisfactory Survey
          </Button>
          <Modal
            aria-labelledby="close-modal-title"
            open={openDetailsModal}
            onClose={() => {
              setOpenDetailsModal(false);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Survey />
          </Modal>
        </Sheet>
      </Box>
    </CssVarsProvider>
  );
};

export default Home;
