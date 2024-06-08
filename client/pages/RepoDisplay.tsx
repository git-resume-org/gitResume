import React, { useState, useEffect } from 'react';
import '../stylesheets/scss/styles.scss';
import RepoComponent from '../components/RepoComponent';
import RepoTestComp from '../components/RepoTestComp';
import { SelectedRepoProvider, useSelectedRepo } from '../components/SelectedRepoProvider';
import { Button } from '../components/ui/get-started-button';
import { NavigationMenu } from '../components/ui/NavBar';
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
      <header className='w-full fixed top-0 left-0 z-50 bg-blackGR backdrop-blur-sm shadow-lg h-[90px]'>
        <div className='w-full flex items-center justify-between p-5'>
          <a href='/'><img src='/assets/images/gitResume_lg.png' alt='logo' className="w-1/4" /></a>
          {/* centering the nav bar */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <NavigationMenu />
          </div>
          <Button variant='default'
            onClick={handleClickSignOut}><img src="" alt="" />sign out</Button>
        </div>
      </header>

      {/* <div className="flex flex-col justify-center items-center w-full h-screen"> */}
      <main className='flex-grow flex flex-col items-center justify-center w-full pt-32 px-4'>
        <h1 className="text-white font-sans text-2xl py-8">Select which repository you'd like to get bulletpoints from</h1>
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
          >Generate BulletPoints</Button>
          {displayError ?
            <h2 className="font-grotesk text-lavenderGR bg-blackGR ">*need to select at least one repository</h2> :
            ''}

      </footer>
    </div>
  );
};

export default RepoDisplay;
