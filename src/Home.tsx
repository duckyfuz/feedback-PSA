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

    if (param === "Employer") {
    }
  };
  return (
    <CssVarsProvider>
      <Box
        display="flex"
        alignItems={"center"}
        justifyContent={"center"}
        color={"red"}
      >
        <Sheet
          sx={{
            width: 300,
            // mx: "auto",
            // my: 0, // margin top & bottom
            py: 3, // padding top & bottom
            px: 2, // padding left & right
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
            Choose type of access to continue.
          </Typography>
          <Button
            sx={{ mt: 1 /* margin top */ }}
            onClick={() => handleClick("Employee")}
          >
            Employee Access
          </Button>
          <Button
            sx={{ mt: 1 /* margin top */ }}
            onClick={() => handleClick("Employer")}
          >
            Employer Access
          </Button>
        </Sheet>
      </Box>
    </CssVarsProvider>
  );
};

export default Home;
