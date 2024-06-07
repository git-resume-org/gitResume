import React, { useState, useEffect } from 'react';
import '../stylesheets/scss/styles.scss';
import RepoComponent from '../components/RepoComponent';
import { SelectedRepoProvider, useSelectedRepo } from '../components/SelectedRepoProvider';
import { Button } from '../components/ui/get-started-button';
import { NavigationMenu } from '../components/ui/NavBar';
// import arrow from '../assets/icons/arrow.png';


const RepoDisplay: React.FC = () => {
  const { selected } = useSelectedRepo();
  console.log(selected, 'selected inside repodisplay')

  const handleClickSelect = () => {
    if (selected.length > 0) {
      console.log('sending repos to backend')
    }
  }

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
    <div>
      <header className='w-full flex items-center justify-between p-4 absolute top-0 left-0 z-10'>
        <a href='/'><img src='/assets/images/gitResume.png' alt='logo' className="h-auto" /></a>
        {/* centering the nav bar */}
        <div className='flex-grow flex justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <NavigationMenu />
        </div>
        {/* <HoverBorderGradientButton /> */}
        <Button variant='default'
          onClick={handleClickSignOut}><img src="" alt="" />sign out</Button>
      </header>

      {/* <div className="flex flex-col justify-center items-center w-full h-screen"> */}
      <main className='flex-grow flex flex-col items-center justify-center w-full pt-32 px-4'>
        <h1 className="text-white font-sans text-2xl py-8">Select which repository you'd like to get bulletpoints from</h1>
        <RepoComponent />
        <Button
          className="my-8 hover:bg-lavenderGR focus:bg-blueGR"
          variant='default'
          onClick={handleClickSelect}
        >Generate BulletPoints</Button>
        {/* </div> */}

      </main>
    </div>
  );
};

export default RepoDisplay;
