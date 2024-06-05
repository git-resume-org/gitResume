import fetch from 'node-fetch';
import { writeFileSync, mkdir } from 'node:fs';

// set this to false if you dont want to write said data to files. (we're only doing this with our own data.)
const writeFSUserDataMegaBool = true;

const ghService = {};

const ghApiEndpoints = {
  subscriptions: 'subscriptions',
  received_events: 'received_events',
  events: 'events',
  orgs: `orgs`,
  reposA: `repos`,
  reposB: `repos`,
};


ghService.getPRs = async (token, username, eventsReceived) => {

  const prs = {};
  const prUrls = []
  let count = 0;

  // Use map to create an array of promises and then await Promise.all
  const prPromises = eventsReceived.map(async (event) => {
    if (event.type === 'PullRequestEvent' && event.payload.pull_request.user.login === username) {
      // console.log('ghService: getPRs: event', event);
      let full_name = event.payload.pull_request.base.repo.full_name;
      let prNum = event.payload.number;
      let prUrl = `https://github.com/${full_name}/pull/${prNum}.patch`;

      console.log('ghService: getPRs: prUrl', prUrl);

      const response = await fetchData(token, prUrl);

      prs[`${full_name}-${prNum}`] = await response.text();
    }
  });

  // Wait for all promises to resolve
  await Promise.all(prPromises);

  console.log('ghService: getPRs: count line 47', count);

  writeFileSync(`./data/user/prs`, JSON.stringify(prs, null, 2));

  return prs;

}

ghService.getEventsReceived = async (token, username) => {

  // console.log('ghService: ghApiEndpoints.received_events', ghApiEndpoints.received_events);
  const url = `https://api.github.com/users/${username}/${ghApiEndpoints.received_events}`;

  const response = await fetchData(token, url);
  const events = await response.json();

  return events;
}


ghService.getOrgs = async (token) => {
  const url = `https://api.github.com/user/orgs`;
  const response = await fetchData(token, url);

  const orgs = await response.json();
  // recursive = true: if the folder already exists, it doesn't throw an error
  mkdir((new URL('../../data/user/', import.meta.url)), { recursive: true }, (err) => {
    if (err) throw err;
  });

  writeFileSync(`./data/user/orgs`, JSON.stringify(orgs, null, 2));
  // console.log('authC: getUserInfo: userData', userData);
  return orgs;
}

const fetchData = async (token, url) => {
  console.log('ghService: fetchData: url', url);
  // console.log('fetch', fetch);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });


  if (!response.ok) {
    throw new Error('Failed to fetch user information');
  }

  // console.log('ghService: fetchData: response', response);

  return response;
  // recursive = true: if the folder already exists, it doesn't throw an error

  // console.log('authC: getUserInfo: userData', userData);
  // return data;


}

ghService.getUserDataMega = async (token, username) => {
  mkdir((new URL('../../data/user/', import.meta.url)), { recursive: true }, (err) => {
    if (err) throw err;
  });


  const userDataMegaDx = {}

  for (let [key, value] of Object.entries(ghApiEndpoints)) {
    try {
      let url = `https://api.github.com/users/${username}/${value}`
      if (key === 'reposB') {
        url = `https://api.github.com/search/repositories?q=user:${username}`
      }
      console.log('authC: fetchData: url', url);
      console.log('githubService: getUserDataMega:', key, value);
      const userDataMega = await fetchData(token, url);

      userDataMegaDx[key] = userDataMega;
      if (writeFSUserDataMegaBool) {
        writeFileSync(`./data/user/${key}`, JSON.stringify(userDataMega, null, 2));
      }

    } catch (err) {
      console.log(err);
    }
  }

  const reposA = userDataMegaDx['reposA'];
  const reposB = userDataMegaDx['reposB'];
  if (reposA && reposB) {
    userDataMegaDx['repos'] = [...reposA, ...reposB.items];
    delete userDataMegaDx['reposA'];
    delete userDataMegaDx['reposB'];
  }

  // remove duplicate repos
  const uniqueRepos = userDataMegaDx['repos'].reduce((acc, repo) => {
    const existingRepo = acc.find(r => r.id === repo.id);
    if (!existingRepo) {
      acc.push(repo);
    }
    return acc;
  }, []);
  userDataMegaDx['repos'] = uniqueRepos;

  console.log(userDataMegaDx['repos'].length);

  writeFileSync(`./data/user/repos`, JSON.stringify(userDataMegaDx[`repos`], null, 2));



  writeFileSync(`./data/user/dataMegaDx`, JSON.stringify(userDataMegaDx, null, 2));
  return true;
};

ghService.getUserDataMeta = async (token) => {
  // console.log('authC: getUserDataMeta: token', token);
  const url = 'https://api.github.com/user';
  const response = await fetchData(token, url);

  const userData = await response.json();
  // recursive = true: if the folder already exists, it doesn't throw an error
  mkdir((new URL('../../data/user/', import.meta.url)), { recursive: true }, (err) => {
    if (err) throw err;
  });

  writeFileSync(`./data/user/info`, JSON.stringify(userData, null, 2));
  // console.log('authC: getUserInfo: userData', userData);
  return userData;
}

export { ghService };


// async function getPaginatedData (token, username, key, value) {
//   let url = `https://api.github.com/users/${username}/${value}`
//   if (key === 'repos') {
//     url = value
//   }
//   console.log('githubService: getPaginatedData: url', url);

//   const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
//   let pagesRemaining = true;
//   let data = [];

//   while (pagesRemaining) {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: 'application/json',
//       },
//     });

//     // const parsedData = await parseData(response.data)
//     const parsedData = await response.json();
//     if (parsedData.length === 0) {
//       break;
//     }
//     data = [...data, ...parsedData];

//     const linkHeader = response.headers.link;

//     pagesRemaining = linkHeader && linkHeader.includes(`rel=\"next\"`);

//     if (pagesRemaining) {
//       url = linkHeader.match(nextPattern)[0];
//     }
//   }

//   return data;
// }


// function parseData(data) {
//   // If the data is an array, return that
//   if (Array.isArray(data)) {
//     return data
//   }

//   // Some endpoints respond with 204 No Content instead of empty array
//   //   when there is no data. In that case, return an empty array.
//   if (!data) {
//     return []
//   }

//   // Otherwise, the array of items that we want is in an object
//   // Delete keys that don't include the array of items
//   delete data.incomplete_results;
//   delete data.repository_selection;
//   delete data.total_count;
//   // Pull out the array of items
//   const namespaceKey = Object.keys(data)[0];
//   data = data[namespaceKey];

//   return data;
// }



// / const locatedIn = org ? `${org}` : `${username}`;
// let num = 1;
// let url = `https://github.com/${locatedIn}/${repoName}/pull/${num}.patch`;

// const prs = [];
// const response = await fetchData(token, url);
// while (response.status === 200 || num < 10) {
//   const lines = await response.text();
//   console.log(lines);
//   console.log('lines.length', lines.length);
//   prs.push(await response.json());
//   num++;
//   url = `https://github.com/${locatedIn}/${repoName}/pull/${num}.patch`;
// }
