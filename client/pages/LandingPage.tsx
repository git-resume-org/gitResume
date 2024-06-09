import React, { useState, useEffect } from 'react';

import { NavigationMenu } from '../components/ui/NavBar';
import { Button } from '../components/ui/get-started-button';
import { WobbleCard } from '../components/ui/wobble-card';
import { WobbleCardDemo } from '../components/ui/key-features';
import { HeaderUi } from '../components/ui/Header-ui';
import { FooterUi } from '../components/ui/Footer-ui';

const ghClientId = process.env.REACT_APP_GH_CLIENT_ID;

// import { HoverBorderGradientButton } from '../components/ui/get-started-button-v2';

const LandingPage: React.FC = () => {
  let authWindow: Window | null;
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const authVerify = async (): Promise<boolean> => {
    // console.log('LandingPage: authVerify starting...');
    try {
      const response = await fetch('/api/auth/verify');
      const data = await response.json();

      setAuthorized(data.success);

      if (!data.success) {
        console.log('authorization: ❌');
        return false;
      }
      console.log('authorization: ✅');

      return true;

    } catch (error) {
      console.error('LandingPage: An error occurred in authVerify', error);
      return false;
    }

  };


  useEffect(() => {
    const verifyAuth = async () => {
      // console.log('LandingPage: verifyAuth starting...');
      await authVerify();
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const handleClickTopRightButton = async (): Promise<void> => {
    // console.log('LandingPage: handleClickTopRightButton');
    const authorized = await authVerify();
    console.log('LandingPage: authorized', authorized);
    if (authorized) {
      window.location.href = '/RepoDisplay';
      return;
    }
    try {
      const response = await fetch('/api/auth/signin');
      const data = await response.json();

      setAuthorized(data.success);

      if (!data.success) {
        console.log('authC: No token present. Redirecting to github signin...');
        const redirectURI = `https://github.com/login/oauth/authorize?client_id=${ghClientId}&scope=repo`;
        // now always opens in a new tab
        authWindow = window.open(redirectURI, '_blank');

        return;
      }

      console.log('Token already exists');

    } catch (error) {
      console.error('LandingPage: An error occurred in handleClickTopRightButton', error);

    }
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleMessage = async (event: MessageEvent) => {
    if (typeof event.data === 'string') {
      console.log('LandingPage: message', event);
      // Could be 'success' or 'failure'
      if (event.data === 'success') {
        console.log('LandingPage: handleMessage: success');
        try {
          const response = await fetch('/api/github/repos');
          const data = await response.json();
          console.log('LandingPage: repos fetched', data);
        } catch (error) {
          console.error('LandingPage: An error occurred in fetching repos', error);
        }
        setTimeout(() => {
          // momentarily delaying the redirect so the user can see the homepage again after the auth window is closed
          window.location.href = '/RepoDisplay';
        }, 250);

      } else {
        console.error('LandingPage: An error occurred in listening to the message event', event.data);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Fixed header section */}
      {/*  <header className='px-8 w-full fixed top-0 left-0 z-50 bg-blackGR backdrop-blur-sm shadow-lg h-[90px]'>
        <div className='w-full flex items-center justify-between p-5'>
          <a href='/'><img src='/assets/images/gitResume_lg.png' alt='logo' className="w-1/6" /></a>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <NavigationMenu />
          </div>
          <Button
            variant='default'
            onClick={handleClickTopRightButton}>
            {authorized ? 'Your Repos' : 'Sign Up / Sign In'}
          </Button>
        </div>
      </header> */}
        <HeaderUi
          buttonOnClick={handleClickTopRightButton}
          buttonContent={authorized ? 'Your Repos' : 'Sign Up / Sign In'}>
        </HeaderUi>

      {/* Main content section */}
      {/* <main className='flex-grow flex flex-col items-center justify-center w-full pt-32 px-4'>

      </main> */}
      <main className='flex-grow flex flex-col items-center w-full pt-40 px-4'>
        <img src='/assets/images/catResume.png' alt='asterisk' className='w-1/6 h-1/6' />
        <h1 className="font-medium text-blueGR z-20 relative text-5xl py-1 text-center font-sans">Generate resume bullet points</h1>
        <h2 className='font-medium text-blueGR z-20 relative text-5xl py-1 text-center font-sans'>from your git commit history,</h2>
        <h3 className='font-medium text-greenGR z-20 relative text-5xl py-1 text-center font-sans'>in just a few clicks.</h3>
        <p className='leading-tight text-white z-20 relative text-lg py-4 text-center font-grotesk font-thin'>
          No more wading back through your code or sparsely worded <br className="hidden md:block" />
          commit messages trying to rediscover the specifics of what you <br className="hidden md:block" />
          accomplished - that's done for you, with any authorized repo.
        </p>

      </main>
      {/* <div className="h-20"></div>
      < hr className='w-3/4 border-1 border-lavenderGR' />
      <div className="h-20"></div> */}

      {/* Secondary content section */}
      <section className='flex-grow flex flex-col w-3/4 px-4 py-12'>
        <h2 className="text-lavenderGR font-grotesk text-3xl py-8">Key Features</h2>
        {/* <div className='flex flex-col items-start'> */}
        {/* <div className='w-full flex flex-col items-center'> */}
        {/* <div className='w-full max-w-5xl pb-12 mx-auto'> */}
        <WobbleCardDemo />

        {/* </div> */}
      </section>

      {/* <div className="h-28"></div>
      < hr className='w-3/4 border-1 border-lavenderGR' />
      <div className="h-6"></div> */}

      {/* Footer section */}
      {/* <footer className='w-full flex flex-col md:flex-col justify-between items-center p-6 bg-blackGR mt-auto'>
        <div className='flex flex-col items-center md:items-center mb-4 md:mb-0'>
          <img src='/assets/images/gitResume_lg.png' alt='logo' className='w-1/6 transform-translate-y-1/2' />
          <h1 className='text-white text-sm text-center md:text-left'>© 2024 gitResume. All Rights Reserved.</h1>
        </div>
        <div className='text-greenGR text-md text-center md:text-left'>
        <h1 className="py-1">About Us</h1>
          <h1 className="py-1">Application</h1>
          <h1 className="py-1">Pricing</h1>
        </div>

        <img src='/assets/images/Asterisk.png' alt='asterisk' className='w-auto h-auto' />
        <div className="h-6"></div>
      </footer> */}

      <FooterUi className='mt-auto'/>
    </div>
  );
};

export default LandingPage;
