import React, { useState, useEffect } from 'react';
import RepoComponent from '../components/RepoComponent';
import RepoTestComp from '../components/RepoTestComp';
import { SelectedRepoProvider, useSelectedRepo } from '../components/SelectedRepoProvider';
import { Button } from '../components/ui/get-started-button';
import { HeaderUi } from '../components/ui/Header-ui';
// import arrow from '../assets/icons/arrow.png';

import { useNavigate } from 'react-router-dom';

const RepoDisplay: React.FC = () => {
  const { selected } = useSelectedRepo();
  const [displayError, setDisplayError] = useState(false)
  // console.log(selected, 'selected inside repodisplay')

  const navigate = useNavigate();

  const handleClickGenerate = () => {
    if (selected.length > 0) {
      console.log('sending repos to backend');
      navigate('/bulletpoints');
    }
  }

  const handleError = () => {
    console.log('yes')
    setDisplayError(true);
  }

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const authVerify = async (): Promise<boolean> => {
    const response = await fetch('/api/auth/verify');
    const data = await response.json();

    setAuthorized(data.success);

    if (!data.success) {
      console.log('repoDisplay: authorization: ❌');
      return false;
    }
    console.log('repoDisplay: authorization: ✅');

    return true;

  };

  const handleClickSignOut = async (): Promise<void> => {
    const response = await fetch('/api/auth/signout');
    const data = await response.json();
    if (!data.success) {
      console.log('error during signout');
      return;
    }
    console.log('signing out');
    setTimeout(() => {
      setAuthorized(false);

    }, 250);
    return;
  }

  useEffect(() => {
    const verifyAuth = async () => {
      const authorized: boolean = await authVerify();
      if (!authorized) {
        window.location.href = '/';
        return;
      }
      setLoading(false);
    };

    verifyAuth();
  }, [authorized]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Fixed header section */}
      <HeaderUi
        buttonOnClick={handleClickSignOut}
        buttonContent={'Sign Out'} >
      </HeaderUi>

      <main className='flex-grow flex flex-col items-center justify-center w-full pt-32 px-4'>
        {/* NOTE-KG: i think it looks pretty clean wihtout the description here. and with the select and generate bullet points buttons visible, i think relatively self-explanatory too */}
        {/* <h1 className="text-white font-sans text-2xl py-8">Select which repository you'd like to get bullet points from</h1> */}
        <RepoComponent />
        {/* < RepoTestComp /> */}
        <br />
        <br />

        {/* </div> */}

      </main>
      {/* <footer className='w-full flex items-center justify-center p-4 relative bottom-0 left-0 z-10'> */}
      <footer className='w-full fixed flex flex-col items-center left-0 bottom-0 z-50 bg-blackGR backdrop-blur-sm shadow-sm'>

        <Button
          // disabling the button if no repo is selected
          className={`hover:bg-lavenderGR focus:bg-lavenderGR active:bg-lavenderGR ${selected.length === 0 ? 'cursor-not-allowed bg-gray-500' : ''}`}
          variant='default'
          onClick={selected.length > 0 ? handleClickGenerate : handleError}
          disabled={selected.length === 0}
        >Generate Bullet Points</Button>
        {displayError ?
          <h2 className="font-grotesk text-lavenderGR bg-blackGR ">*need to select at least one repository</h2> :
          ''}

      </footer>
    </div >
  );
};

export default RepoDisplay;
