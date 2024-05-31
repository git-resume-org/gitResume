import React from 'react';
import { useEffect, useState } from 'react';

const AuthComp: React.FC = () => {
  const [tokenExists, setTokenExists] = useState(false);

  // const checkAccessToken = async () => {
  //   try {
  //     const response = await fetch('/api/auth/get');
  //     const data = await response.json();
  //     if (data.tokenExists) {
  //       console.log('AuthComp: Access token! already logged in',);

  //       setTokenExists(true);
  //     }
  //   } catch (error) {
  //     console.error('Error checking access token:', error);
  //   }
  // };

  let authWindow: Window | null;

  // const handleAuthClick = async () => {
  //   console.log('AuthComp: gitResume button clicked');

  //   const response = await fetch('/api/auth/get', {
  //     method: 'GET',
  //   });

  //   // console.log('AuthComp: response', response);
  //   const data = await response.json();

  //   console.log('AuthComp: data', data);



  //   if (data.accessToken) {
  //     console.log('AuthComp: Access token! already logged in');
  //   } else {
  //     console.log('AuthComp: no Access token, not logged in');
  //     // authWindow = window.open('/api/auth/get', '_blank', 'width=800,height=600');
  //     authWindow = window.open('/api/auth/get', '_blank', 'width=800,height=600,toolbar=no,scrollbars=no,status=no,resizable=no,location=no,menuBar=no,left=500,top=100');
  //   }
  // };

  const handleAuthClick = async (): Promise<void> => {
    console.log('AuthComp: gitResume button clicked');
    const response = await fetch('/api/auth/checkToken');
    const data: { tokenExists: boolean, accessToken?: string } = await response.json();
    console.log('AuthComp: data.tokenExists', data.tokenExists);
    if (data.tokenExists !== false) {
      console.log('Token already exists');
      // Handle already authenticated case, e.g., show user info or proceed
    } else {
      console.log('Token does not exist. redirecting to github');
      authWindow = window.open('/api/auth/get', '_blank', 'width=800,height=600,toolbar=no,scrollbars=no,status=no,resizable=no,location=no,menuBar=no,left=500,top=100');
    }
  };

  // const handleAuthClick = async () => {
  //   console.log('AuthComp: gitResume button clicked');
  //   try {
  //     const response = await fetch('/api/auth/get');
  //     const data = await response.json();
  //     if (data.tokenExists) {
  //       console.log('Token already exists:', data.accessToken);
  //       // Handle already authenticated case, e.g., show user info or proceed
  //     } else {
  //       authWindow = window.open('/api/auth/get', '_blank', 'width=800,height=600,toolbar=no,scrollbars=no,status=no,resizable=no,location=no,menuBar=no,left=500,top=100');
  //     }
  //   } catch (error) {
  //     console.error('Error checking access token:', error);
  //   }
  // };

  useEffect(() => {

    // checkAccessToken();

    window.addEventListener('message', handleMessage);
    return () => {

      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) {
      console.log('AuthComp: Received message from another origin:', event.origin);
      // Ignore messages from other origins
      return;
    }

    if (event.data === 'authComplete') {
      // Close the popup window
      console.log('AuthComp: authComplete');
      if (authWindow) {
        authWindow.close();
        authWindow = null;
      }
    }

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
