import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
// icons
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

// @ts-ignore
import OrderTable from "../components_old/OrderTable";
// import OrderList from "../components_old/OrderList";
import Header from "../components_old/Header";
import ColorSchemeToggle from "../components_old/ColorSchemeToggle";
import { Option, Select } from "@mui/joy";
import { useState } from "react";

export default function FeedbackView() {
  const [char, setChar] = useState("Joshua");

  const handleCharChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    console.log(event);
    // alert(`You chose "${newValue}"`);
    // @ts-ignore
    setChar(newValue);
  };
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
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
              separator={
                <ChevronRightRoundedIcon
                // fontSize="sm"
                />
              }
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
                View Feedback
              </Typography>
              <Select defaultValue="Joshua" onChange={handleCharChange}>
                <Option value="Joshua">Joshua</Option>
                <Option value="Joseph">Joseph</Option>
                <Option value="Katie">Katie</Option>
                <Option value="Moses">Moses</Option>
                <Option value="Ruby">Ruby</Option>
              </Select>
            </Breadcrumbs>
            <ColorSchemeToggle
              sx={{ ml: "auto", display: { xs: "none", md: "inline-flex" } }}
            />
          </Box>
          <OrderTable char={char} />
          {/* <OrderList /> */}
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
