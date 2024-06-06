import React from 'react';
import '../stylesheets/scss/styles.scss';
import RepoComponent from '../components/RepoComponent';
import { SelectedRepoProvider, useSelectedRepo } from '../components/SelectedRepoProvider';
import { Button } from '../components/ui/get-started-button';
// import arrow from '../assets/icons/arrow.png';


const RepoDisplay: React.FC = () => {
  const { selected } = useSelectedRepo();
  console.log(selected, 'selected inside repodisplay')

  const handleClick = () => {
    if (selected.length > 0) {
      console.log('sending repos to backend')
    }
  }
  return (
    <>
      <div className='absolute top-0 left-0 z-10 p-4'>
        <img src='/assets/images/gitResume.png' alt='logo' />

      </div>
      <div className='absolute top-0 right-10 z-10 p-4'>
        <Button variant='default'><img src="" alt="" />Go Back</Button>
        {/* <HoverBorderGradientButton /> */}
      </div>
      <div className="flex flex-col justify-center items-center w-full h-screen">
        <h1 className="text-white font-sans text-2xl py-8">Select which repository you'd like to get bulletpoints from</h1>
        <RepoComponent />
        <Button 
        className="my-8 hover:bg-lavenderGR focus:bg-blueGR" 
        variant='default'
        onClick={handleClick}
        >Generate BulletPoints</Button>
      </div>
    </>
  );
};

export default RepoDisplay;

