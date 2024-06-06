import React from 'react';
import { useState } from 'react';

const VerifyTestComp: React.FC = () => {
  const [tokenExists, setTokenExists] = useState(false);
  const [clickBool, setclickBool] = useState(false);
  const [owner, setOwner] = useState('');
  const [repoName, setRepoName] = useState('');

  const handleClickToken = async (): Promise<void> => {

    const response = await fetch('/api/auth/verifyTest');
    const status: number = response.status;
    setTokenExists(status === 200 ? true : false);
    setclickBool(true);

    if (status !== 200) {
      console.log('VerifyTestComp: ❌');
      return;
    }
    console.log('VerifyTestComp: ✅');
  };

  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwner(e.target.value);
  }

  const handleRepoNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepoName(e.target.value);
  }

  const handleClickGetCommits = async (): Promise<void> => {

    const response = await fetch('/api/github/commits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ owner, repoName }),
    });
    try {
      const data = await response.json();
      if (data) {
        console.log('VerifyTestComp: data', data);
      }
    } catch (error) {
      console.log('VerifyTestComp: error', error);
    }
  };

  const handleClickGetRepos = async (): Promise<void> => {

    const response = await fetch('/api/github/repos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    try {
      const data = await response.json();
      if (data) {
        console.log('VerifyTestComp: data', data);
      }
    } catch (error) {
      console.log('VerifyTestComp: error', error);
    }
  };

  return (
    <div>
      <div>
        <button className="btn" style={{ fontSize: '1.5rem', marginTop: '.25rem', marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '100%', backgroundColor: clickBool && tokenExists === false ? 'maroon' : clickBool && tokenExists === true ? 'green' : undefined }}
          onClick={handleClickToken}
        >token? {clickBool ? (tokenExists ? ' ✔️ ' : ' ❌ ') : null}</button>
      </div>
      <br />
      < hr />
      <br />
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
          <input className="form" type="text" placeholder="owner" onChange={handleOwnerChange} style={{ flex: '1' }} />
          <input className="form" type="text" placeholder="repoName" onChange={handleRepoNameChange} style={{ flex: '1' }} />
        </div>
        <br />
        <button className="btn" style={{ fontSize: '1.5rem', marginTop: '.25rem', marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '100%' }}
          onClick={handleClickGetCommits}
        >get commits</button>
        <button className="btn" style={{ fontSize: '1.5rem', marginTop: '.25rem', marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '100%' }}
          onClick={handleClickGetRepos}
        >get repositories</button>
      </div>
    </div>
  );

};


export { VerifyTestComp };
