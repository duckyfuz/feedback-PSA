import React, { useState } from "react";
import { CssVarsProvider, Sheet, Input, Button, Textarea } from "@mui/joy";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

const GiveFeedbackPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    initial: "",
    email: "",
    feedback: "",
    feedbackTo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
              placeholder="Name"
              required
              sx={{ my: 2 }}
            />
            <Input
              type="text"
              name="initial"
              value={formData.initial}
              onChange={handleChange}
              placeholder="Initial"
              required
              sx={{ my: 2 }}
            />
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              sx={{ my: 2 }}
            />
            <Textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              placeholder="Feedback"
              minRows={6}
              maxRows={6}
              required
              sx={{ my: 2 }}
            />
            <Select
              name="feedbackTo"
              value={formData.feedbackTo}
              onChange={handleChange}
              placeholder="Select recipient"
              required
              sx={{ my: 2 }}
            >
              <Option value="recipient1">Recipient 1</Option>
              <Option value="recipient2">Recipient 2</Option>
              <Option value="recipient3">Recipient 3</Option>
            </Select>
            <Button type="submit">Submit</Button>
          </form>
        </Sheet>
      </div>
    </CssVarsProvider>
  );
};

export default GiveFeedbackPage;
