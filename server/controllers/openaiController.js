
import jwt from 'jsonwebtoken';
import { writeFileSync, mkdir, readFileSync } from 'node:fs';
import { chatCompletion } from '../services/openaiService.js';
// import { ghService } from '../services/githubService.js';

// leave this false for now, until more progress is made on this.
// an error will be returned right now anyway, as calling openai requires specific org, project, and api keys in one's .env file.
const sendToOpenAIBool = true;

const openaiC = {};

openaiC.generatePoints = async (req, res, next) => {
  mkdir((new URL('../../data/bullets/', import.meta.url)), { recursive: true }, (err) => {
    if (err) throw err;
  });
  const { token, username, repoName } = req.user;
  const { PRs } = res.locals;

  // const patchFilePath = './templates/git-resume-org_gitResume_6.patch';
  const filePath = './data/diffs/staged'

  const fileText = readFileSync(filePath, 'utf-8');
  console.log('openaiC: generatePoints: fileText');
  // console.log('fileText', fileText);

  if (sendToOpenAIBool){
    const openaiprPatchCompletion = await chatCompletion(fileText);

    console.log('openaiC: generatePoints: openaiprPatchCompletion')

    writeFileSync(`./data/bullets/${username}_openai_bullets${new Date()}.json`, JSON.stringify(openaiprPatchCompletion, null, 2));
  }

}


export { openaiC };
