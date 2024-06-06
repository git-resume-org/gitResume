import fetch from 'node-fetch';
import { config } from 'dotenv';
import OpenAI from "openai";
config();

import openaiTokenCounter from 'openai-gpt-token-counter';

const openaiKey = process.env.OPENAI_API_KEY;
const openaiOrg = process.env.OPENAI_API_ORG;
const openaiProject = process.env.OPENAI_API_PROJECT;

const openai = new OpenAI({
  organization: openaiOrg,
  project: openaiProject,
});

const openaiAuth = `Bearer ${openaiKey}`;

const chatCompletion = async (file) => {
  console.log('openaiService: chatCompletion');

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
          content: `Evaluate the commit diff in the attached file. Return 5-10 well written resume bullet points that reflect the changes made and the purpose of said changes. Focus on the major accomplishments, if any. Don't get lost in the weeds. Generally ignore gitignore, readmes, and config files. Avoid overselling the action taken.If the commit description/s has significant or substantial information, utilize that in your output. Spread the bullet points over the files changed rather than concentrating on one. Ensure each bullet is unique, not duplicating a point already made in a prior bullet. Use the following examples for inspiration and lack thereof, respectively. Aim for 125-500 words in total. Please return in JSON format. Don't describe deleting things.

          Examples to follow!:
          - 'Utilized React's component-based architecture and virtual DOM to create a modular and reusable UI, promoting code maintainability and enabling efficient rendering and updating of the user interface.'
          - 'Employed Redux and Redux Toolkit for centralized state management, leveraging modular slices and asynchronous thunks to ensure a predictable and maintainable state flow across components, improving scalability and debugging capabilities.'
          - 'Leveraged Puppeteer to control and serve a custom instance of Chrome, enabling efficient cross-origin DOM and CSS retrieval via CDP, which streamlined data extraction and manipulation processes for enhanced project performance.'
          - 'Implemented custom functions to parse, store, and display the  inline, regular, and user-agent CSS styles of clicked elements.'
          - 'Employed Node.js’ fs and regex to modify both regular and inline styles in the user’s source files – with changes instantly reflected in the browser – enabling real-time editing and smooth developer workflow.'
          - 'Utilized Vite’s dev server, HMR, and porting to minimize load times and code overhead during development.'
          `
        },
        {
          role: 'user',
          content: file
        },
      ],
      temperature: 0.9,
    }),
  });

  const data = await response.json();
  console.log('openaiService: data', data);
  return data
};

export { chatCompletion };
