import React from 'react';
import { NavigationMenu } from '../components/ui/NavBar';
import { AuthComp } from '../components/AuthComp';
import { VerifyTokenTestComp } from '../components/VerifyTokenTestComp';
import { Button } from '../components/ui/get-started-button';
import { WobbleCard } from '../components/ui/wobble-card';
import { WobbleCardDemo } from '../components/ui/key-features';
// import { HoverBorderGradientButton } from '../components/ui/get-started-button-v2';


// const LandingPage: React.FC = () => {
//   return (
//     <div className="bg-blackGR h-screen flex flex-col justify-center items-center top-0 z-0">
//       <div className='absolute top-0 left-0 z-10 p-4'>
//       <img src='/assets/images/gitResume.png' alt='logo' />

//       </div>
//       <div className="absolute top-0 z-10 p-4">
//         <NavigationMenu />
//       </div>
//       <div className= 'absolute top-0 right-10 z-10 p-4'>
//         <Button variant='default'>Get Started</Button>
//         {/* <HoverBorderGradientButton /> */}
//       </div>
//       <div className='flex flex-col justify-center items-center pt-32'>
//       <img src='/assets/images/Asterisk.png' alt='asterisk' className='w-auto h-auto'/>
//         <h1 className="text-blueGR z-20 relative align-text-top text-5xl py-1"> Generate bullets for your resume</h1>
//         <h2 className='text-blueGR z-20 relative align-text-top left-3 text-5xl py-1'> from your git commit history,</h2>
//         <h3 className='text-greenGR z-20 relative align-text-top left-4 text-5xl py-1'> in a few clicks. </h3>
//         <p className='text-white z-20 relative align text-top left 4 text-lg py-6 text-center'> 
//           No more wading back through your code or sparsely worded <br />
//           commit messages trying to rediscover the specifics of what you <br />
//           accomplished - that's done for you, with any repo.
//         </p>
//       </div>
//       <div className='w-full flex justify center items-center mt-10'>
//         <WobbleCardDemo />
//       </div>
//       {/* <AuthComp />
//       <VerifyTokenTestComp /> */}
//     </div>
//   );
// };

// export default LandingPage;

const LandingPage: React.FC = () => {
  return (
    <div className="bg-blackGR min-h-screen flex flex-col items-center">
      {/* Fixed header section */}
      <div className='absolute top-0 left-0 z-10 p-4'>
        <img src='/assets/images/gitResume.png' alt='logo' />
      </div>
      <div className="absolute top-0 z-10 p-4">
        <NavigationMenu />
      </div>
      <div className='absolute top-0 right-10 z-10 p-4'>
        <Button variant='default'>Get Started</Button>
      </div>
      
      {/* Main content section */}
      <div className='flex flex-col items-center w-full pt-32'>
        <img src='/assets/images/Asterisk.png' alt='asterisk' className='w-auto h-auto'/>
        <h1 className="text-blueGR z-20 relative text-5xl py-1 text-center">Generate bullets for your resume</h1>
        <h2 className='text-blueGR z-20 relative text-5xl py-1 text-center'>from your git commit history,</h2>
        <h3 className='text-greenGR z-20 relative text-5xl py-1 text-center'>in a few clicks.</h3>
        <p className='text-white z-20 relative text-lg py-6 text-center'>
          No more wading back through your code or sparsely worded <br />
          commit messages trying to rediscover the specifics of what you <br />
          accomplished - that's done for you, with any repo.
        </p>
      </div>
      
      {/* Secondary content section */}
      <div className='w-full flex flex-col items-center mt-10'>
        <h1 className='text-lavenderGR z-20 relative top-0 right-1/3 pb-12 text-4xl py-1 text-center'> Key Features</h1>
        <div className='w-10/12 pb-12'>
          <WobbleCardDemo />
        </div>
      </div>

      {/* <div className='w-full flex flex-col items-center mt-10' aria-label='footer'>
        <div className='relative top-0 -left-96 pr-36 pt-20'>
      <img src='/assets/images/gitResume.png' alt='logo' />
      <h1 className='text-white z-20 relative text-lg py-6 text-center'>© 2024 Company. All Rights Reserved. </h1>
        </div>
        <div className='relative top-0 -right-96 pl-36'>
          <h1 className='text-greenGR z-20 relative text-md pb-12'>
            hi <br />
            hello <br />
            goodbye <br />
          </h1>
        </div> */}
        <div className='w-full flex justify-between items-center mt-10 px-10' aria-label='footer'>
  <div className='flex flex-col items-start'>
    <img src='/assets/images/gitResume.png' alt='logo' className='mb-2' />
    <h1 className='text-white text-lg'>© 2024 Company. All Rights Reserved.</h1>
  </div>
  <div className='text-greenGR text-md mr-12 py-6'>
    <h1>About Us</h1>
    <h1>Application</h1>
    <h1>Pricing</h1>
  </div>
</div>

    // </div>
  );
};

export default LandingPage;