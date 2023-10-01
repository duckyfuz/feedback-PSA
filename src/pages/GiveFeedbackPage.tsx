import React, { useState } from "react";
import { CssVarsProvider, Sheet, Input, Button, Textarea } from "@mui/joy";

const GiveFeedbackPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    initial: "",
    email: "",
    feedback: "",
    feedbackTo: "",
  });

  //potentially make this line dynamic in the future??
  const recipients = ["Joseph", "Joshua", "Katie", "Moses", "Ruby"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e && e.target) {
      console.log(e.target);
      const { name, value } = e.target;
      console.log(name, value);
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    // Add logic for submitting form data
  };

  return (
    <CssVarsProvider>
      <div style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
        <Sheet
          sx={{
            width: 600,
            my: 4,
            py: 3,
            px: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: "sm",
            boxShadow: "md",
            mx: "auto",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              autoComplete="off"
              required
              sx={{ mb: 2 }}
            />
            <Input
              type="text"
              name="initial"
              value={formData.initial}
              onChange={handleChange}
              placeholder="Your Initial"
              autoComplete="off"
              required
              sx={{ mb: 2 }}
            />
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              sx={{ mb: 2 }}
            />
            <Textarea
              name="feedback"
              value={formData.feedback}
              // @ts-ignore
              onChange={handleChange}
              placeholder="Feedback"
              minRows={4}
              maxRows={4}
              required
              sx={{ mb: 2 }}
            />
            <select
              name="feedbackTo"
              defaultValue={recipients[0]}
              placeholder="Select Recipient"
              // @ts-ignore
              onChange={handleChange}
              required
              style={{
                marginBottom: 20,
                width: 200,
                height: 30,
                display: "block",
              }}
            >
              {recipients.map((recipient) => {
                return (
                  <option value={recipient} key={recipient}>
                    {recipient}
                  </option>
                );
              })}
            </select>
            <Button type="submit">Submit</Button>
          </form>
        </Sheet>
      </div>
    </CssVarsProvider>
  );
};

export default GiveFeedbackPage;
