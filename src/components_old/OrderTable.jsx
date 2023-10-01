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
import {
  Autocomplete,
  CircularProgress,
  FormControl,
  FormLabel,
  Stack,
  Textarea,
} from "@mui/joy";

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
  const [rows, setRows] = React.useState([]);
  const [response, setResponse] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);
  const [openDetailsModal, setOpenDetailsModal] = React.useState(false);
  const [openFeedModal, setOpenFeedModal] = React.useState(false);
  const [characters, setCharacters] = React.useState([]);
  const [feedbackForm, setFeedbackForm] = React.useState({
    customer: { email: "", initial: "", name: "" },
    date: "",
    feedback: "",
    id: "",
    status: "",
    recipient: "",
  });

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
          setRows(data);
          return data;
        })
        .catch((error) => {
          // Handle any errors here
          throw new Error("Error fetching data: " + error.message);
        });
    })();
  }, [char]);
  const [formLoading, setFormLoading] = React.useState(false);

  React.useEffect(() => {
    const tmp = ["Joshua", "Joseph"].filter(function (el) {
      return el != char;
    });
    setFeedbackForm((prevState) => {
      return {
        ...prevState,
        customer: { email: `${char}@gmail.com`, initial: char[0], name: char },
        recipient: tmp[0],
      };
    });
    setCharacters(tmp);
  }, [char]);

  const pushFire = (newEntry, id) => {
    (async () => {
      try {
        console.log(newEntry.recipient);
        const firebaseDatabaseUrl =
          "https://feedback-psa-default-rtdb.asia-southeast1.firebasedatabase.app/";
        const endpointPath = `employees/${newEntry.recipient}`;

        // console.log(rows);

        const response = await axios.get(
          `${firebaseDatabaseUrl}${endpointPath}.json`
        );

        // let currentData = response.data || {};

        let updatedRows = response.data;
        updatedRows[id] = newEntry;

        console.log(updatedRows);

        await axios.put(
          `${firebaseDatabaseUrl}${endpointPath}.json`,
          updatedRows
        );

        console.log("New entry added successfully:", newEntry);
        setFeedbackForm({
          customer: {
            email: `${char}@gmail.com`,
            initial: char[0],
            name: char,
          },
          recipient: characters[0],
          date: "",
          feedback: "",
          id: "",
          status: "",
        });
        setOpenFeedModal(false);
      } catch (error) {
        console.error("Error adding entry:", error);
        alert("Please try again later.");
      }
    })();
  };

  const handleFormSubmit = () => {
    (async () => {
      setFormLoading(true);
      let formData = feedbackForm;
      formData = {
        ...formData,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        id: `FED-${Math.floor(Math.random() * 10000)}`,
      };
      console.log(formData);

      if (formData.feedback.length !== 0) {
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
              content: `Please help me analyse the feedback given: "${formData.feedback}". If it is a postive feedback, reply "Positive". Else, reply "Negative".`,
            },
          ],
          temperature: 0.1,
          max_tokens: 100,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });

        console.log(response);
        formData = {
          ...formData,
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          id: `FED-${Math.floor(Math.random() * 10000)}`,
          status: response.choices[0].message.content,
        };
        console.log(formData);

        pushFire(formData, formData.id);
      } else {
        alert("You need to type in feedback.");
      }
      setFormLoading(false);
    })();
  };

  const handleSummarise = () => {
    (async () => {
      setOpenModal(true);
      // console.log(rows);

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const feedbackArray = [];

      for (let i = 0; i < Object.keys(rows).length; i++) {
        const values = Object.values(rows);

        const date = new Date(values[i].date);

        if (date > sixMonthsAgo) {
          feedbackArray.push(values[i].date + ": " + values[i].feedback);
        }
      }

      // sendAI(feedbackArray);
      console.log("Feedback Array: ", feedbackArray);

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
            content: `You are a LLM designed to review and summarise feedback. Act as if you were taking face-to-face to the employee as a superior. Do not write it in the form of a letter.\n
            Based on the feedback and time given, judge the employee's progress. Tell them about the area they have improved in across time as well as the areas in which they remained lacking in. For the areas in which they are lacking, provide them with specific ways to improve.\n
            Include a few courses the employee can attend to work on these skills. Encourage the user to ask their superiors for the chance to attend these courses.\n
            [${feedbackArray.join("],[")}]`,
          },
        ],
        temperature: 0.3,
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
    setOpenFeedModal(true);
    console.log("create feedback");
  };

  const viewHandler = (id) => {
    console.log(rows[id]);
    setDetails(rows[id]);
    setOpenDetailsModal(true);
  };

  return (
    <React.Fragment>
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
        }}
      >
        <Typography level="h2">Welcome back, {char}</Typography>
        <Stack direction={"row"} gap={2}>
          <Button
            color="primary"
            startDecorator={<EditNote />}
            size="md"
            onClick={() => {
              const tmp = ["Joshua", "Joseph"].filter(function (el) {
                return el != char;
              });
              setCharacters(tmp);
              setFeedbackForm((prevState) => {
                return {
                  ...prevState,
                  recipient: tmp[0],
                };
              });
              handleCreateFeedback();
            }}
          >
            Review your Peers!
          </Button>
          <Button
            color="primary"
            startDecorator={<EditNote />}
            size="md"
            onClick={() => {
              setCharacters(["Company"]);
              setFeedbackForm((prevState) => {
                return {
                  ...prevState,
                  recipient: "Company",
                };
              });
              handleCreateFeedback();
            }}
          >
            PSA Feedback
          </Button>
        </Stack>
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
              <th style={{ width: 10, padding: "12px 6px" }}> </th>
              <th style={{ width: 20, padding: "12px 6px" }}>Review ID</th>
              <th style={{ width: 15, padding: "12px 6px" }}>
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
              <th
                style={{ width: 20, padding: "12px 6px", textAlign: "center" }}
              >
                Status
              </th>
              <th style={{ width: 120, padding: "12px 6px" }}>
                Feedback Preview
              </th>
              <th style={{ width: 20, padding: "12px 6px" }}> </th>
            </tr>
          </thead>
          <tbody>
            {stableSort(Object.values(rows), getComparator(order, "date")).map(
              (row) => (
                <tr key={row.id}>
                  <td></td>
                  <td>
                    <Typography level="body-xs">{row.id}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row.date}</Typography>
                  </td>
                  <td style={{ textAlign: "center" }}>
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
                    <Typography noWrap level="body-xs">
                      {row.feedback}
                    </Typography>
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
              )
            )}
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
              Summary (Past 6 months)
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
      <Modal
        aria-labelledby="close-modal-title"
        open={openFeedModal}
        onClose={() => {
          setFeedbackForm({
            customer: {
              email: `${char}@gmail.com`,
              initial: char[0],
              name: char,
            },
            recipient: characters[0],
            date: "",
            feedback: "",
            id: "",
            status: "",
          });
          setOpenFeedModal(false);
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
            Send feedback
          </Typography>
          <FormControl id="controllable-states-demo">
            <FormLabel>Sending feedback to:</FormLabel>
            <Autocomplete
              disabled={characters[0] == "Company"}
              disableClearable={true}
              placeholder="..."
              value={feedbackForm.recipient}
              onChange={(event, newValue) => {
                setFeedbackForm((prevState) => {
                  return {
                    ...prevState,
                    recipient: newValue,
                  };
                });
              }}
              inputValue={feedbackForm.recipient}
              onInputChange={(event, newInputValue) => {
                setFeedbackForm((prevState) => {
                  return {
                    ...prevState,
                    recipient: newInputValue,
                  };
                });
              }}
              options={characters}
              sx={{ width: 300, marginBottom: 1 }}
            />
            <Textarea
              sx={{ marginBottom: 2 }}
              placeholder="Feedback goes here"
              minRows={15}
              value={feedbackForm.feedback}
              onChange={(event) => {
                setFeedbackForm((prevState) => {
                  return {
                    ...prevState,
                    feedback: event.target.value,
                  };
                });
              }}
            />
          </FormControl>
          <Button loading={formLoading} onClick={handleFormSubmit}>
            Submit
          </Button>
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
