import React from 'react';
import { NavigationMenu } from '../components/ui/NavBar';
import { AuthComp } from '../components/AuthComp';
import { VerifyTokenTestComp } from '../components/VerifyTokenTestComp';
import { Button } from '../components/ui/get-started-button';
// import { HoverBorderGradientButton } from '../components/ui/get-started-button-v2';


const LandingPage: React.FC = () => {
  return (
    <div className="bg-blackGR h-screen flex justify-center items-center top-0 z-0">
      <div className='absolute top-0 left-0 z-10 p-4'>
      <img src='/assets/images/gitResume.png' alt='logo' />

      </div>
      <div className="absolute top-0 z-10 p-4">
        <NavigationMenu />
      </div>
      <div className= 'absolute top-0 right-10 z-10 p-4'>
        <Button variant='default'>Get Started</Button>
        {/* <HoverBorderGradientButton /> */}
      </div>
      <div className='flex flex-col justify-center items-center'>
      <img src='/assets/images/Asterisk.png' alt='asterisk' className='w-auto h-auto'/>
        <h1 className="text-blueGR z-20 relative align-text-top text-5xl py-1"> Generate bullets for your resume</h1>
        <h2 className='text-blueGR z-20 relative align-text-top left-4 text-5xl py-1'> from your git commit history,</h2>
        <h3 className='text-greenGR z-20 relative align-text-top left-4 text-5xl py-1'> in a few clicks. </h3>
      </div>
      <AuthComp />
      <VerifyTokenTestComp />
    </div>
  );
};

export default LandingPage;

