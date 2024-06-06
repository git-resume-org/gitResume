import fetch from 'node-fetch';
import { writeFileSync, mkdir } from 'node:fs';

// set this to false if you dont want to write said data to files. (we're only doing this with our own data.)
const writeFSUserDataMegaBool = true;

const getUserDataMega = async (token, username) => {
  mkdir((new URL('../../data/user/', import.meta.url)), { recursive: true }, (err) => {
    if (err) throw err;
  });

  const ghApiEndpoints = {
    subscriptions: 'subscriptions',
    received_events: 'received_events',
    events: 'events',
    orgs: `orgs`,  // not returning anything for Keith atm
    repos: `https://api.github.com/search/repositories?q=user:${username}`,  // the correct endpoint for getting both public and private repos for the user
  };

  const fetchData = async (key, value) => {
    let url = `https://api.github.com/users/${username}/${value}`
    if (key === 'repos'){
      url = value
    }
    console.log('authC: fetchData: url', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const ghData = await response.json();

    if (writeFSUserDataMegaBool) {
      writeFileSync(`./data/user/${key}`, JSON.stringify(ghData, null, 2));
    }
  }

  for (let [key, value] of Object.entries(ghApiEndpoints)) {
    try {
      console.log('authC: getGhData:', key, value);
      await fetchData(key, value);

    } catch (err) {
      console.log(err);
    }
  }
};

const getUserDataMeta = async (token) => {
  // console.log('authC: getUserDataMeta: token', token);
  const response = await fetch('https://api.github.com/user', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user information');
  }

  const userData = await response.json();
  // recursive = true: if the folder already exists, it doesn't throw an error
  mkdir((new URL('../../data/user/', import.meta.url)), { recursive: true }, (err) => {
    if (err) throw err;
  });

  // writeFileSync(`./data/user/info`, JSON.stringify(userData, null, 2));
  // console.log('authC: getUserInfo: userData', userData);
  return userData;
}

export { getUserDataMeta, getUserDataMega };
