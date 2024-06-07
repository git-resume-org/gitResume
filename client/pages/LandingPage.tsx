import React, { useState, useEffect } from 'react';

import { NavigationMenu } from '../components/ui/NavBar';
import { Button } from '../components/ui/get-started-button';
import { WobbleCard } from '../components/ui/wobble-card';
import { WobbleCardDemo } from '../components/ui/key-features';

const ghClientId = process.env.REACT_APP_GH_CLIENT_ID;

// import { HoverBorderGradientButton } from '../components/ui/get-started-button-v2';

const LandingPage: React.FC = () => {
  let authWindow: Window | null;
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const authVerify = async (): Promise<boolean> => {
    const response = await fetch('/api/auth/verify');
    const data = await response.json();

    setAuthorized(data.success);

    if (!data.success) {
      console.log('authorization: ❌');
      return false;
    }
    console.log('authorization: ✅');

    return true;

  };


  useEffect(() => {
    const verifyAuth = async () => {
      await authVerify();
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const handleClickTopRightButton = async (): Promise<void> => {
    const authorized = await authVerify();
    console.log('LandingPage: authorized', authorized);
    if (authorized) {
      window.location.href = '/RepoDisplay';
      return;
    }

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

    console.log('Token exists');
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleMessage = (event: MessageEvent) => {
    if (typeof event.data === 'string') {
      console.log('LandingPage: message', event);
      // Could be 'success' or 'failure'
      if (event.data === 'success') {
        console.log('LandingPage: success');
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
      <header className='w-full fixed top-0 left-0 z-50 bg-blackGR backdrop-blur-sm shadow-lg'>
        <div className='w-full flex items-center justify-between p-6'>
          <a href='/'><img src='/assets/images/gitResume.png' alt='logo' className="h-auto" /></a>
          {/* centering the nav bar */}
          <div className='flex-grow flex justify-center'>
            <NavigationMenu />
          </div>
          <Button
            variant='default'
            onClick={handleClickTopRightButton}>
            {authorized ? 'Your Repos' : 'Sign Up / Sign In'}
          </Button>
        </div>
      </header>

      {/* Main content section */}
      {/* <main className='flex-grow flex flex-col items-center justify-center w-full pt-32 px-4'>

      </main> */}
      <main className='flex-grow flex flex-col items-center w-full pt-40 px-4'>
        <div className='flex flex-col items-start justify-start'>
          <h1 className="text-greenGR z-20 relative text-6xl py-3">get</h1>
          <div className='z-20 relative py-3'>
            <button className="btn" style={{ fontSize: '6rem' }}>
              gitRésumé
            </button>
            <span className='ml-3 text-blueGR z-20 relative text-6xl py-3'>to</span>
          </div>
          <div>
            <span className='text-greenGR z-20 relative text-6xl py-3'>get </span>
            <span className='text-blueGR z-20 relative text-6xl py-3'>your résumé from</span>
          </div>
          <h4 className='text-greenGR z-20 relative text-6xl py-3'>git</h4>
        </div>
        {/* <img src='/assets/images/Asterisk.png' alt='asterisk' className='w-auto h-auto' /> */}

        <div className="h-24"></div>
      < hr className='w-3/4 border-1 border-greenGR' />
      <div className="h-24"></div>

        <h1 className="text-blueGR z-20 relative text-5xl py-1 text-center">Generate résumé bullet points</h1>
        <h2 className='text-blueGR z-20 relative text-5xl py-1 text-center'>from your git commit history,</h2>
        <h3 className='text-greenGR z-20 relative text-5xl py-1 text-center'>in just a few clicks.</h3>
        <p className='text-blueGR z-20 relative text-lg py-6 text-center'>
          No more wading back through your code or sparsely worded <br className="hidden md:block" />
          commit messages trying to rediscover the specifics of what you <br className="hidden md:block" />
          accomplished - that's done for you, with any authorized repo.
        </p>

      </main>
      <div className="h-20"></div>
      < hr className='w-3/4 border-1 border-greenGR' />
      <div className="h-20"></div>

      {/* Secondary content section */}
      <section className='flex-grow flex flex-col items-center justify-center w-3/4 pt-8 px-4'>
        {/* <div className='flex flex-col items-start'> */}
           {/* <div className='w-full flex flex-col items-center'> */}
           {/* <div className='w-full max-w-5xl pb-12 mx-auto'> */}
            <WobbleCardDemo />


        {/* </div> */}
      </section>

      <div className="h-28"></div>
      < hr className='w-3/4 border-1 border-greenGR' />
      <div className="h-6"></div>

      {/* Footer section */}
      <footer className='w-full flex flex-col md:flex-col justify-between items-center p-6 bg-blackGR mt-auto'>
        <div className='flex flex-col items-center md:items-center mb-4 md:mb-0'>
          <img src='/assets/images/gitResume.png' alt='logo' className='mb-2 h-auto' />
          <h1 className='text-blueGR text-sm text-center md:text-left'>© 2024 gitResume. All Rights Reserved.</h1>
        </div>
        {/* <div className='text-greenGR text-md text-center md:text-left'> */}
          {/* <h1 className="py-1">About Us</h1>
          <h1 className="py-1">Application</h1>
          <h1 className="py-1">Pricing</h1> */}
        {/* </div> */}
      <div className="h-6"></div>
      </footer>
    </div>
  );
};

export default LandingPage;
