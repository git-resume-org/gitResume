import React from 'react';
import { NavigationMenu } from '../components/ui/NavBar';
import { AuthComp } from '../components/AuthComp';
import { VerifyTokenTestComp } from '../components/VerifyTokenTestComp';
import { Button } from '../components/ui/get-started-button';
import { WobbleCard } from '../components/ui/wobble-card';
import { WobbleCardDemo } from '../components/ui/key-features';
// import { HoverBorderGradientButton } from '../components/ui/get-started-button-v2';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-blackGR min-h-screen flex flex-col">
      {/* Fixed header section */}
      <header className='w-full flex items-center justify-between p-4 absolute top-0 left-0 z-10'>
        <img src='/assets/images/gitResume.png' alt='logo' className="h-auto" />
        <div className='flex-grow flex justify-center ml-16'>
          <NavigationMenu />
        </div>
        <Button variant='default'>Get Started</Button>
      </header>
      
      {/* Main content section */}
      <main className='flex-grow flex flex-col items-center justify-center w-full pt-32 px-4'>
        <img src='/assets/images/Asterisk.png' alt='asterisk' className='w-auto h-auto' />
        <h1 className="text-blueGR z-20 relative text-5xl py-1 text-center">Generate bullets for your resume</h1>
        <h2 className='text-blueGR z-20 relative text-5xl py-1 text-center'>from your git commit history,</h2>
        <h3 className='text-greenGR z-20 relative text-5xl py-1 text-center'>in a few clicks.</h3>
        <p className='text-white z-20 relative text-lg py-6 text-center'>
          No more wading back through your code or sparsely worded <br className="hidden md:block" />
          commit messages trying to rediscover the specifics of what you <br className="hidden md:block" />
          accomplished - that's done for you, with any repo.
        </p>
      </main>
      
      {/* Secondary content section */}
      <section className='w-full flex flex-col items-center mt-10 px-4'>
      <h1 className='text-lavenderGR z-20 relative top-0 right-1/3 pb-12 pr-20 text-4xl py-1 text-center'> Key Features</h1>
        <div className='w-full max-w-6xl pb-12'>
          <WobbleCardDemo />
        </div>
      </section>

      {/* Footer section */}
      <footer className='w-full flex flex-col md:flex-row justify-between items-center p-6 bg-blackGR mt-auto'>
        <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
          <img src='/assets/images/gitResume.png' alt='logo' className='mb-2 h-auto' />
          <h1 className='text-white text-lg text-center md:text-left'>© 2024 Company. All Rights Reserved.</h1>
        </div>
        <div className='text-greenGR text-md text-center md:text-left'>
          <h1 className="py-1">About Us</h1>
          <h1 className="py-1">Application</h1>
          <h1 className="py-1">Pricing</h1>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;