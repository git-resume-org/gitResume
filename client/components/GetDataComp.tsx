import React from 'react';
import { useState } from 'react';

const GetDataComp: React.FC = () => {
  const [owner, setOwner] = useState('');
  const [author, setAuthor] = useState('');
  const [repoName, setRepoName] = useState('');

  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwner(e.target.value);
  }

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
  }

  const handleRepoNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepoName(e.target.value);
  }

  const handleClickGetData = async (): Promise<void> => {
    console.log('GetDataComp: handleClickGetData', owner, author, repoName);

    const response = await fetch('/api/github/ghData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ owner, author, repoName }),
    });
    try {
      const data = await response.json();
      if (data) {
        console.log('GetDataComp: data', data);
      }
    } catch (error) {
      console.log('GetDataComp: error', error);
    }
  };

  return (
    <div>
      <div>
        <div style={{ maxWidth: '80%', alignSelf: 'center', display: 'flex', flexDirection: 'row', gap: '1rem' }}>
          <input className="form" type="text" placeholder="owner"
            onChange={handleOwnerChange}
            style={{ flex: '1' }} />

          <input className="form" type="text" placeholder="author"
            onChange={handleAuthorChange}
            style={{ flex: '1' }} />

          <input className="form" type="text" placeholder="repoName"
            onChange={handleRepoNameChange}
            style={{ flex: '1' }} />
        </div>
        <br />
        <button className="btn" style={{ fontSize: '1.5rem', marginTop: '.25rem', marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '100%' }}
          onClick={handleClickGetData}
        >get data</button>
      </div>
    </div>
  );

};


export { GetDataComp };
