// @desc      Sort notes
// @route     POST /sort
// @access    Public

// connect to open AI api
// add env variables
// bring in your askGPT function from DiscoFy
// Test to make sure you can ask GPT something in Postman

const axios = require('axios');

async function askGPT3(prompt) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
  };
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      max_tokens: 4000,
      messages: [
        {
          role: 'system',
          content: `${prompt}`,
        },
      ],
    },
    {
      headers: headers,
    }
  );
  return response.data.choices[0].message.content;
}

async function askClaude(prompt) {
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': `${process.env.ANTHROPIC_API_KEY}`,
    'anthropic-version': '2023-06-01',
  };
  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `${prompt}`,
        },
      ],
    },
    {
      headers: headers,
    }
  );
  return response.data.content[0].text;
}

// Ok so obvioously getting gpt3 to do everything in one go is not going to work
// you can experiment with anthropic
// you also probably need to break this down into at least three separate methods

// START HERE TOMRROW
// one method to spellcheck and grammar check notes, group them and consolidate them
// another method that returns x&y and size for the new notes based on their size
// a final method that builds a new redux state tree and returns that

exports.sort = async (req, res, next) => {
  console.log('State Tree from Request: ');
  console.log(JSON.stringify(req.body.notes));

  const prompt =
    'take the below redux state tree, summarize and consolidate the notes if they have things in common, ' +
    'then return a new state tree that holds the new notes and sets their x&y coordinates for a nice layout. ' +
    'Do not add any intro message, e.g. Here is the new state tree with consolidated notes and updated layout coordinates: ' +
    'When you are making a list and using dashses as bullets, do not put a space after the dash. ' +
    'Also I want you to generate new uuids in the same format that they are given to you. ' +
    'Also, give any new notes a new timestamp based on the current date and time' +
    JSON.stringify(req.body.notes);

  try {
    const response = await askClaude(prompt);
    console.log(response);
    res.status(200).json({ notes: response });
  } catch (err) {
    next(err);
  }
};
