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

const chatCompletion = async (owner, repoName, commitSha, files) => {
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
          content: `Evaluate the diff of the following files: ${files.map(file => file.filename).join(', ')}. Return 1-5 technical resume bullet points explaining what changes were made, in JSON format.`
        },
        {
          role: 'user',
          content: files.map(file => `--- ${file.filename}\n${file.diff}`).join('\n\n'),
        },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  console.log('openaiService: data', data);
  return data
};

export { chatCompletion };
