import fetch from 'node-fetch';
import { config } from 'dotenv';
import OpenAI from "openai";
config();

const openaiKey = process.env.OPENAI_API_KEY;
const openaiOrg = process.env.OPENAI_API_ORG;
const openaiProject = process.env.OPENAI_API_PROJECT;

const openai = new OpenAI({
  organization: openaiOrg,
  project: openaiProject,
});

const openaiAuth = `Bearer ${openaiKey}`;

const openaiService = {}

openaiService.generateBulletPoints = async (inputData) => {

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': openaiAuth,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `Evaluate the commit diffs in the attached file. Return 5 well written resume bullet points as elements of an array. Each bullet should be a unique point that reflect the changes made and the purpose of said changes. Focus on the major accomplishments. Don't get lost in the weeds. Do not name files; instead, describe the purpose/function/result of changes. Avoid overselling the action taken. If the commit description/s has significant or substantial information, utilize that in your output. Spread the bullet points over the files changed rather than concentrating on one. Ensure each bullet is unique, not duplicating a point already made in a prior bullet. Use the following examples for inspiration and lack thereof, respectively. Aim for 125-250 words in total. Always return a single JSON object containing one array of string elements with the key "bulletPoints". Never output anything other than the object containing the bullet points.

          Examples to follow!:
          'Utilized React's component-based architecture and virtual DOM to create a modular and reusable UI, promoting code maintainability and enabling efficient rendering and updating of the user interface.'
          'Employed Redux and Redux Toolkit for centralized state management, leveraging modular slices and asynchronous thunks to ensure a predictable and maintainable state flow across components, improving scalability and debugging capabilities.'
          'Leveraged Puppeteer to control and serve a custom instance of Chrome, enabling efficient cross-origin DOM and CSS retrieval via CDP, which streamlined data extraction and manipulation processes for enhanced project performance.'
          'Implemented custom functions to parse, store, and display the  inline, regular, and user-agent CSS styles of clicked elements.'
          'Employed Node.js’ fs and regex to modify both regular and inline styles in the user’s source files – with changes instantly reflected in the browser – enabling real-time editing and smooth developer workflow.'
          `
        },
        {
          role: 'user',
          content: inputData
        },
      ],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  // console.log('openaiService: data', data);
  return data
};

export { openaiService };
