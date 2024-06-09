import React from 'react';
import '../stylesheets/scss/styles.scss';
import { NavigationMenu } from '../components/ui/NavBar';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center w-full">
        {/* Fixed header section */}
        <header className='px-8 w-full fixed top-2 left-0 z-50 bg-blackGR backdrop-blur-sm shadow-lg h-[90px]'>
          <div className='w-full flex items-center justify-between p-5'>
            <a href='/'><img src='/assets/images/gitResume_lg.png' alt='logo' className="w-1/6" /></a>
            {/* centering the nav bar */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <NavigationMenu />
            </div>
          </div>
        </header>
      </div>

      {/* Main content section */}

        <main className='flex-grow flex flex-col items-center w-full pt-40 px-4'>
          <img src='/assets/images/catResume.png' alt='asterisk' className='w-1/6 h-1/6' />
          <h1 className="font-medium text-blueGR z-20 relative text-5xl py-1 text-center font-sans">Meow!</h1>
          <h2 className='font-medium text-blueGR z-20 relative text-5xl py-1 text-center font-sans'>Let's get you</h2>
          <span style={{ marginBottom: '1rem' }}></span>
          <button className='btn font-medium text-5xl w-1/5 h-16 text-center font-sans' onClick={goHome}>home</button>
        </main>

      <div>
        {/* Footer section */}
        <footer className='w-full fixed flex flex-col items-center left-0 bottom-0 z-50 bg-blackGR backdrop-blur-sm shadow-sm'>
          <div className='flex flex-col items-center md:items-center mb-4 md:mb-0'>
            <img src='/assets/images/gitResume_lg.png' alt='logo' className='w-1/6 transform-translate-y-1/2' />
            <h1 className='text-white text-sm text-center md:text-left'>© 2024 gitResume. All Rights Reserved.</h1>
          </div>
          <div className="h-6"></div>
        </footer>
      </div>
    </div>

  );
};

export default NotFoundPage;
