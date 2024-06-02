import fetch from 'node-fetch';
import { writeFileSync, mkdir } from 'node:fs';

// set this to false if you dont want to write said data to files. (we're only doing this with our own data.)
const writeFSUserDataDetailedBool = true;

const getUserDataDetailed = async (token, username) => {
  mkdir((new URL('../../data/user/', import.meta.url)), { recursive: true }, (err) => {
    if (err) throw err;
  });

  const ghApiEndpoints = {
    subscriptions: 'subscriptions',
    received_events: 'received_events',
    events: 'events',
    orgs: 'orgs',  // not returning anything for Keith atm
    repos: 'repos',  // not returning anything for Keith atm
    gists: 'gists', // not returning anything for Keith atm
  };

  const fetchData = async (key, value) => {
    const url = `https://api.github.com/users/${username}/${value}`
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

    if (writeFSUserDataDetailedBool) {
      writeFileSync(`./data/user/${key}`, JSON.stringify(ghData, null, 2));
    }
  }

  for (let [key, value] of Object.entries(ghApiEndpoints)) {
    try {
      console.log('authController: getGhData:', key, value);
      await fetchData(key, value);

    } catch (err) {
      console.log(err);
    }
  }

};

const getUserDataBasic = async (accessToken) => {
  // console.log('authController: getUserInfo: accessToken', accessToken);
  const response = await fetch('https://api.github.com/user', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
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

  writeFileSync(`./data/user/info`, JSON.stringify(userData, null, 2));
  // console.log('authController: getUserInfo: userData', userData);
  return userData;
}

export { getUserDataBasic, getUserDataDetailed };
