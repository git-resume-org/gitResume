import { writeFileSync, mkdir, readFileSync } from 'node:fs';
import { openaiService } from '../services/openaiService.js';
import { ghService } from '../services/githubService.js';

// leave this false for now, until more progress is made on this.
// an error will be returned right now anyway, as calling openai requires specific org, project, and api keys in one's .env file.
const sendToOpenAIBool = true;

const generate = {};

generate.bulletPoints = async (req, res, next) => {
  console.log('openaiC: generateBulletPoints: start');
  mkdir((new URL('../../data/bullets/', import.meta.url)), { recursive: true }, (err) => {
    if (err) throw err;
  });

  console.log('openaiC: generateBulletPoints: req.body', req.body);
  const { repoName } = req.body;
  const { username } = req.user;
  const { commits, merges } = res.locals;

  // check if merges is empty, if it is, use commits
  // let commitsArray = merges.length > 0 ? merges : commits;
  let commitsArray = commits;

  // get the most recent three commits
  const recentCommits = commitsArray.slice(0, 3);

  // Convert to string and truncate to ~50000 characters
  let commitsString = JSON.stringify(recentCommits);
  if (commitsString.length > 40000) {
    commitsString = commitsString.substring(0, 40000);
  }

  if (sendToOpenAIBool) {
    console.log('sending to openai');
    const fetchBulletPoints = await openaiService.generateBulletPoints(commitsString);

    const responseContent = fetchBulletPoints.choices[0].message.content

    const data = JSON.parse(responseContent) != null ? JSON.parse(responseContent) : responseContent;
    if (typeof data === 'string') {
      console.warn('openaiC: generateBulletPoints: did not convert to json');
    }
    // console.log('openaiC: generateBullets: bullets', data);
    // console.log('openaiC: generateBullets: typeof(data)', typeof(data));
    // console.log('openaiC: generateBullets: typeof data.bulletPoints', typeof data.bulletPoints);
    // console.log('openaiC: generateBullets: fetchBulletPoints')

    writeFileSync(`./data/bullets/${username}_${repoName}_${new Date()}.json`, JSON.stringify(data, null, 2));


    res.locals.bulletPoints = data.bulletPoints;
  }

  next();
}

const openaiC = { generate };

export { openaiC };
