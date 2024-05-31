import React from 'react';
import { useEffect } from 'react';

const AuthComp: React.FC = () => {

  const fetchAuth = async () => {
    console.log('AuthComp: fetchAuth');
    const response = await fetch('/api/auth/github');
    const data = await response.json();
    console.log(data);
  };

  const handleAuthClick = () => {
    console.log('AuthComp: gitResume button clicked');
    fetchAuth();
  };

  return (
    // This first style centers the text in the middle of the page
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <span style={{ fontSize: '3rem' }}>get</span>
        {/* <button className="btn">Authenticate with GitHub</button> */}
        <button className="btn" style={{ fontSize: '5rem', margin: '.5rem' }}
        onClick={handleAuthClick}
        >gitRésumé</button>
        <span style={{ fontSize: '3rem' }}>to get your résumé from git</span>
      </div>
    </div>
  );

};

export { AuthComp };
