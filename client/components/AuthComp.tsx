import React from 'react';
import { useEffect } from 'react';

const ghClientId = process.env.REACT_APP_GH_CLIENT_ID;

const AuthComp: React.FC = () => {
  let authWindow: Window | null;

  const handleClick = async (): Promise<void> => {
    const response = await fetch('/api/auth/signin');
    const tokenBool: boolean = await response.json();

    if (!tokenBool) {
      console.log('authC: No token present. Redirecting to github signin...');
      const redirectURI = `https://github.com/login/oauth/authorize?client_id=${ghClientId}&scope=repo`;
      // if window is full screen, open in a new window, which is to say a new tab bc fullscreen.
      authWindow = window.open(redirectURI, '_blank');
      // if (window.matchMedia('(display-mode: fullscreen)').matches) {

      //   // second parameter is the name of the window.
      //   // _blank means that the URL should be loaded into a new window.
      // } else {
      //   // otherwise pop up
      //   authWindow = window.open(redirectURI, '_blank', 'width=800,height=600,,toolbar=no,scrollbars=no,status=no,resizable=no,location=no,menuBar=no,left=500,top=100');
      //   // third parameter is the properties of the window. This creates a popup window.
      // }

      return;
    }
    console.log('Token exists');
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleMessage = (event: MessageEvent) => {
    // seems the contents of this have no bearing on the window closing. completely handled by authC.cookiesGet.
    // in case this breaks in the future, look to commit 9790a1d for the code that used to be here.
  };

  return (
    <div>
      <button className="btn" style={{ fontSize: '5rem', marginTop: '.625rem', marginLeft: ' .5rem ', marginRight: '.5rem' }}
        onClick={handleClick}
      >gitResume</button> <span style={{ fontSize: '3rem' }}> to</span>
    </div>
  );

};

export { AuthComp };
