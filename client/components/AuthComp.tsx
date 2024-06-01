import React from 'react';
import { useEffect } from 'react';

const AuthComp: React.FC = () => {
  let authWindow: Window | null;

  const handleClick = async (): Promise<void> => {
    const response = await fetch('/api/auth/signin');
    const tokenBool: boolean = await response.json();

    if (!tokenBool) {
      console.log('Token does not exist.');
      console.log('redirecting to github for authentication...');

      // if window is full screen, open in a new window, which is to say a new tab bc fullscreen.
      if (window.matchMedia('(display-mode: fullscreen)').matches) {
        authWindow = window.open('/api/auth/ghLogin', '_blank');
      } else {
        // otherwise pop up
        authWindow = window.open('/api/auth/ghLogin', '_blank', 'width=800,height=600,,toolbar=no,scrollbars=no,status=no,resizable=no,location=no,menuBar=no,left=500,top=100');
      }

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
    // the value of event.data is set in authController.closeGhLogin
    if (event.origin === window.location.origin && event.data === 'closeGhLogin') {
      console.log('Authorization complete');

      if (authWindow) {
        // Close the login window
        authWindow.close();
        authWindow = null;
      }
    }
  };

  return (
    <div>
      <button className="btn" style={{ fontSize: '5rem', marginTop: '.625rem', marginLeft: ' .5rem ', marginRight: '.5rem' }}
        onClick={handleClick}
      >gitRésumé</button> <span style={{ fontSize: '3rem' }}> to</span>
    </div>
  );

};

export { AuthComp };
