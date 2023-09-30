import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Link from "@mui/joy/Link";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
// icons
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import BlockIcon from "@mui/icons-material/Block";

import axios from "axios";
import { EditNote, Functions } from "@mui/icons-material";
import OpenAI from "openai";
import { CircularProgress, Stack } from "@mui/joy";

function descendingComparator(a, b, orderBy) {
  const dateA = new Date(a[orderBy]);
  const dateB = new Date(b[orderBy]);

  if (dateB < dateA) {
    return -1;
  }
  if (dateB > dateA) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function OrderTable({ char }) {
  const [order, setOrder] = React.useState("desc");
  const [openModal, setOpenModal] = React.useState(false);
  const [openDetailsModal, setOpenDetailsModal] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [response, setResponse] = React.useState("");
  const [details, setDetails] = React.useState("");

  React.useEffect(() => {
    (async () => {
      const firebaseDatabaseUrl =
        "https://feedback-psa-default-rtdb.asia-southeast1.firebasedatabase.app/";
      const endpointPath = `employees/${char}`; //

      await axios
        .get(`${firebaseDatabaseUrl}${endpointPath}.json`)
        .then((response) => {
          // Handle the response data here
          const data = response.data;
          console.log(Object.values(data));
          setRows(Object.values(data));
          return data;
        })
        .catch((error) => {
          // Handle any errors here
          throw new Error("Error fetching data: " + error.message);
        });
    })();
  }, [char]);

  const handleSummarise = () => {
    (async () => {
      setOpenModal(true);
      // console.log(rows);
      const feedbackArray = [];

      for (let i = 0; i < rows.length; i++) {
        // console.log(rows[i]);
        feedbackArray.push(rows[i].date + ": " + rows[i].feedback);
      }

      // sendAI(feedbackArray);
      console.log(feedbackArray);

      // TODO: HIDE THE ENV KEY WTF
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_KEY,
        dangerouslyAllowBrowser: true,
      });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `You are a LLM designed to review and summarise feedback. Act as if you were taking directly to the employee.\n
            Based on the feedback and time given, judge the employee's progress. Tell them about the area they have improved in across time as well as the areas in which they remained lacking in. For the areas in which they are lacking, provide them with specific ways to improve.\n
            Include a few fictatious courses the employee can attend to work on these skills. Bold the course names with html <b> tags. Encourage the user to ask their superiors for the chance to attend these courses.\n
            [${feedbackArray.join("],[")}]`,
          },
        ],
        temperature: 1,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      console.log(response);
      setResponse(response.choices[0].message.content);
    })();
  };

  const handleCreateFeedback = () => {
    // ERNEST LOOK HERE
    console.log("create feedback");
  };

  const viewHandler = (id) => {
    setDetails(rows.find((obj) => obj.id === id));
    setOpenDetailsModal(true);
  };

  return (
    <React.Fragment>
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
        <Typography level="h2">Welcome back, {char}</Typography>
        <Button
          color="primary"
          startDecorator={<EditNote />}
          size="md"
          onClick={handleCreateFeedback}
        >
          Write a feedback!
        </Button>
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
          width: "100%",
          maxHeight: "90%",
          // alignItems: "center",
          // justifyContent: "center",
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
            // m: 8,
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 20, padding: "12px 6px" }}> </th>
              <th style={{ width: 40, padding: "12px 6px" }}>Review ID</th>
              <th style={{ width: 40, padding: "12px 6px" }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                  fontWeight="lg"
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    "& svg": {
                      transition: "0.2s",
                      transform:
                        order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                    },
                  }}
                >
                  Date
                </Link>
              </th>
              <th style={{ width: 140, padding: "12px 6px" }}>Status</th>
              <th style={{ width: 40, padding: "12px 6px" }}> </th>
            </tr>
          </thead>
          <tbody>
            {stableSort(rows, getComparator(order, "date")).map((row) => (
              <tr key={row.id}>
                <td></td>
                <td>
                  <Typography level="body-xs">{row.id}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.date}</Typography>
                </td>
                <td>
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={
                      {
                        Positive: <CheckRoundedIcon />,
                        Negative: <BlockIcon />,
                      }[row.status]
                    }
                    color={
                      {
                        Positive: "success",
                        Negative: "danger",
                      }[row.status]
                    }
                  >
                    {row.status}
                  </Chip>
                </td>
                <td>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Button
                      height={"90%"}
                      onClick={() => {
                        viewHandler(row.id);
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <Modal
        aria-labelledby="close-modal-title"
        open={openModal}
        onClose={() => {
          setResponse("");
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
            <Typography
              component="h2"
              id="modal-description"
              level="h1"
              textColor="inherit"
              fontWeight="md"
              paddingBottom={2}
            >
              Summary (Previous Year)
            </Typography>
            <ModalClose variant="outlined" />
            {response.length !== 0 ? (
              <>
                <Typography
                  component="body-md"
                  id="modal-description"
                  textColor="inherit"
                  fontWeight="md"
                  sx={{ whiteSpace: "pre-line" }}
                >
                  {response.split("\n").map((i, key) => {
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
      <Modal
        aria-labelledby="close-modal-title"
        open={openDetailsModal}
        onClose={() => {
          setDetails("");
          setOpenDetailsModal(false);
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
            height: "70%",
            borderRadius: "md",
            p: 4,
          }}
          style={{ overflow: "auto" }}
        >
          <ModalClose variant="outlined" />
          <Typography
            component="h2"
            id="modal-description"
            level="h1"
            textColor="inherit"
            fontWeight="md"
            paddingBottom={2}
          >
            {details.date}
          </Typography>

          <Stack direction="column" justifyContent="center" alignItems="center">
            {details.length !== 0 ? (
              <Typography
                component="body-md"
                id="modal-description"
                textColor="inherit"
                fontWeight="md"
                sx={{ whiteSpace: "pre-line" }}
              >
                {details.feedback.split("\n").map((i, key) => {
                  return (
                    <React.Fragment key={key}>
                      {i.split("<b>").map((text, index) => {
                        if (index % 2 === 0) {
                          return <p key={index}>{text}</p>;
                        } else {
                          return <b key={index}>{text}</b>;
                        }
                      })}
                    </React.Fragment>
                  );
                })}
              </Typography>
            ) : (
              <CircularProgress size="lg" />
            )}
          </Stack>
        </Sheet>
      </Modal>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // height: "100vh",
          my: 2,
        }}
      >
        <Button
          color="primary"
          startDecorator={<Functions />}
          size="lg"
          onClick={handleSummarise}
        >
          Summarise Feedback
        </Button>
      </Box>
    </React.Fragment>
  );
}
