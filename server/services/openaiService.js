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
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Evaluate the commit diff in the attached file. See the Subject/s, if included, for an overview. Return 2-5 well written resume bullet points that reflect the changes made. Spread the bullet points over the files changed rather than concentrating on one. Ensure each bullet is unique, not duplicating a point already made in a prior bullet. Use the following examples for inspiration. Aim for 125-200 words in total. Please return in JSON format.

          Examples:
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

  //   const models = await openai.listModels();
  //   console.log('models', models);

  //   const text = "This is a test sentence.";
  // const model = "text-davinci-003"; // Replace with your desired OpenAI model

  // const tokenCount = openaiTokenCounter.text(text, model);
  // console.log(`Token count: ${tokenCount}`);

          // role: 'system',
          // content: `Evaluate the diff of the following files: ${files.map(file => file.filename).join(', ')}. Return 1-5 technical resume bullet points explaining what changes were made, in JSON format.`

          // content: files.flatMap(file => file.diff.split('\ndiff --git ').map((diff, i) => {
          //   const filename = file.filename.split(' ')[0];
          //   if (i === 0) {
          //     return `Evaluate the following diff of the file ${filename}. Return 1-5 technical resume bullet points explaining what changes were made, in JSON format.`;
          //   } else {
          //     return `--- ${filename}\n${diff}`;
          //   }
          // })).join('\n\n')

                    // content: file.map(segment => `--- ${segment.filename}\n${segment.diff}`).join('\n\n'),
