import * as React from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import List from "@mui/joy/List";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemButton from "@mui/joy/ListItemButton";
// icons
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import StarsIcon from "@mui/icons-material/Stars";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";

import { closeSidebar } from "../utils";

export default function SecondSidebar() {
  return (
    <React.Fragment>
      <Box
        className="SecondSidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--FirstSidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Sheet
        className="SecondSidebar"
        color="neutral"
        sx={{
          position: {
            xs: "fixed",
            lg: "sticky",
          },
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--FirstSidebar-width, 0px)))",
            lg: "none",
          },
          transition: "transform 0.4s",
          zIndex: 9999,
          height: "100dvh",
          top: 0,
          p: 2,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRight: "1px solid",
          borderColor: "divider",
        }}
      >
        <List
          size="sm"
          sx={{
            "--ListItem-radius": "6px",
            "--List-gap": "6px",
          }}
        >
          <ListSubheader role="presentation" sx={{ fontWeight: "lg" }}>
            Dashboard
          </ListSubheader>
          <ListItem>
            <ListItemButton selected>
              <ListItemDecorator>
                <BubbleChartIcon />
              </ListItemDecorator>
              <ListItemContent>Overview</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => closeSidebar()}>
              <ListItemDecorator>
                <StarsIcon />
              </ListItemDecorator>
              <ListItemContent>Saved reports</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => closeSidebar()}>
              <ListItemDecorator>
                <AccountBoxIcon />
              </ListItemDecorator>
              <ListItemContent>User reports</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListSubheader role="presentation" sx={{ fontWeight: 700, mt: 2 }}>
            Workspace
          </ListSubheader>
          <ListItem>
            <ListItemButton onClick={() => closeSidebar()}>
              <ListItemDecorator>
                <PeopleRoundedIcon />
              </ListItemDecorator>
              <ListItemContent>Groups</ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
      </Sheet>
    </React.Fragment>
  );
}
