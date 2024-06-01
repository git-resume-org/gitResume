import React from 'react';
import { useState } from 'react';

const VerifyTokenTestComp: React.FC = () => {
  const [tokenExists, setTokenExists] = useState(false);
  const [clickBool, setclickBool] = useState(false);

  const handleClick = async (): Promise<void> => {

    const response = await fetch('/api/auth/verifyTokenTest');
    const data: boolean = await response.json();
    setTokenExists(data);

    setclickBool(true);

    if (!data) {
      console.log('Token does not exist');
      return;
    }

    console.log('Token exists');
  };

  return (
    <div>
      <button className="btn" style={{ fontSize: '2rem', marginTop: '.625rem', marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '100%', backgroundColor: clickBool && tokenExists === true ? 'green' : clickBool && tokenExists === false ? 'maroon' : undefined }}
        onClick={handleClick}
      >token? {clickBool ? (tokenExists ? ' ✔️ ' : ' 🙅‍♂️ ') : null }</button>
    </div>
  );

};

export { VerifyTokenTestComp };
