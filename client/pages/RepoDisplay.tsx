import React from 'react';
import '../stylesheets/scss/styles.scss';
import RepoComponent from '../components/RepoComponent';
// import {NavigationMenu} from '../components/ui/NavBar'


const RepoDisplay: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <h1 className="text-blueGR">Select which repository you'd like to get bulletpoints from</h1>
      <RepoComponent/>
    </div>
  );
};

export default RepoDisplay;

