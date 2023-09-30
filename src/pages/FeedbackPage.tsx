import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
// icons
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import useScript from "../useScript";
import OrderTable from "../components_old/OrderTable";
import OrderList from "../components_old/OrderList";
import Header from "../components_old/Header";
import ColorSchemeToggle from "../components_old/ColorSchemeToggle";
import { sendAI } from "../utils/OpenAPI";

// const useEnhancedEffect =
//   typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export default function FeedbackView() {
  // const status = useScript(`https://unpkg.com/feather-icons`);

  // useEnhancedEffect(() => {
  //   // Feather icon setup: https://github.com/feathericons/feather#4-replace
  //   // @ts-ignore
  //   if (typeof feather !== "undefined") {
  //     // @ts-ignore
  //     feather.replace();
  //   }
  // }, [status]);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Header />
        {/* <FirstSidebar />
        <SecondSidebar /> */}
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
                href="#some-link"
                aria-label="Home"
              >
                <HomeRoundedIcon />
              </Link>
              <Link
                underline="hover"
                color="neutral"
                href="#some-link"
                fontSize={12}
                fontWeight={500}
              >
                Dashboard
              </Link>
              <Typography color="primary" fontWeight={500} fontSize={12}>
                Orders
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
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "start", sm: "center" },
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Typography level="h2">View Feedbacks</Typography>
            <Button
              color="primary"
              startDecorator={<DownloadRoundedIcon />}
              size="sm"
              onClick={() => {
                sendAI();
              }}
            >
              Download PDF
            </Button>
          </Box>
          <OrderTable />
          <OrderList />
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
