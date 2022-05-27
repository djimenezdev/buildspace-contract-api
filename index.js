const sendgrid = require("@sendgrid/mail");
const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
require("dotenv").config({
  path: ".env.local",
});

// set sendgrid apikey to access
sendgrid.setApiKey(process.env.EMAIL_PASS);
// converts request/response to json
app.use(express.json());

app.post(
  "/emailSend",
  cors({ origin: [`https://buildspace-ethcontract-api.herokuapp.com/`] }),
  async (req, res) => {
    const { email, firstName, lastName, subject, content } = req.body;

    await sendgrid
      .send({
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        templateId: process.env.EMAIL_ID,
        dynamicTemplateData: {
          email: email,
          firstName: firstName,
          lastName: lastName,
          subject: subject,
          content: content,
        },
      })
      .then(
        async () => {
          await sendgrid
            .send({
              from: process.env.EMAIL,
              to: email,
              templateId: process.env.EMAIL_ID_TWO,
              dynamicTemplateData: {
                firstName: firstName,
                lastName: lastName,
                subject: subject,
              },
            })
            .then(
              (response) => {
                res.status(200).send({ res: "success" });
              },
              (error) => {
                res.status(400).send({
                  res: "Not successful",
                  error: error?.response?.body,
                });
              }
            );
        },
        (error) => {
          res.send({ res: "not successful", error: error });
        }
      );
  }
);

// set listener for express server startup
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
