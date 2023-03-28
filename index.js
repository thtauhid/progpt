const express = require("express");
const app = express();
const morgan = require("morgan");

require("dotenv").config();

app.use(morgan("dev"));
app.use(express.json());
// set up the view engine
app.set("view engine", "ejs");

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.get("/", async (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    console.log(error);
  }
});

app.post("/chat", async (req, res) => {
  try {
    const { content } = req.body;

    // Checks if user is trying to bypass the instructions
    const restricted_words = [
      "ignore",
      "previous",
      "instruction",
      "instructions",
      "prompts",
      "prompt",
    ]; // new words need to be added

    const ignore =
      restricted_words.filter((word) => content.includes(word)).length >= 2;

    if (ignore) {
      return res.json({
        success: true,
        message: "Thank you for using the app :)",
      });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Make the response sound more professional",
        },
        {
          role: "user",
          content,
        },
      ],
    });

    console.log(response.data);

    res.json({
      success: true,
      message: response.data.choices[0].message.content,
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
