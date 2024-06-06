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

  return (
    <div>
      <div>
        <button className="btn" style={{ fontSize: '1.5rem', marginTop: '.25rem', marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '100%', backgroundColor: clickBool && tokenExists === false ? 'maroon' : clickBool && tokenExists === true ? 'green' : undefined }}
          onClick={handleClickToken}
        >token? {clickBool ? (tokenExists ? ' ✔️ ' : ' ❌ ') : null}</button>
      </div>
    </div>
  );

};


export { VerifyTestComp };
