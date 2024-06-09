import React from 'react';
import { useNavigate } from 'react-router-dom';

import { HeaderUi } from '../components/ui/Header-ui';


const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div>
      <div className='flex flex-col justify-between items-center w-full min-h-screen'>
        <HeaderUi
          buttonHide={true}>
        </HeaderUi>

        <main className='flex-grow flex flex-col items-center w-full pt-40 px-4'>
          <img src='/assets/images/catResume.png' alt='asterisk' className='w-1/6 h-1/6' />
          <h1 className="font-medium text-blueGR z-20 relative text-5xl py-1 text-center font-sans">Meow! Let's get you</h1>
<br/>
          <button className='btn font-medium text-5xl w-1/5 h-16 text-center font-sans' onClick={goHome}>home</button>
        </main>
      </div>
    </div>
  );
};

export default NotFoundPage;
