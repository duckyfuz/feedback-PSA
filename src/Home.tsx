import Button from "@mui/joy/Button";
import { CssVarsProvider } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/joy";

const Home = () => {
  const navigate = useNavigate();
  const handleClick = (param: string) => {
    if (param === "Employee") {
      navigate("/FeedbackPage");
    }
  };

  return (
    <CssVarsProvider>
      <Box
        display="flex"
        alignItems="center" // Center vertically
        justifyContent="center" // Center horizontally
        minHeight="100vh" // Set a minimum height to center vertically in the viewport
      >
        <Sheet
          sx={{
            width: 300,
            py: 3,
            px: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: "sm",
            boxShadow: "md",
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
          <Button sx={{ mt: 1 }} onClick={() => handleClick("Employer")}>
            Employer Access
          </Button>
        </Sheet>
      </Box>
    </CssVarsProvider>
  );
};

export default Home;
