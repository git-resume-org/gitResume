import React from 'react';
import '../stylesheets/scss/styles.scss';
import RepoDisplay from './RepoDisplay';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-blackGR">
      <h1 className="text-black">Hello, Worldd!</h1>
      <div>
        <RepoDisplay/>
      </div>
    </div>
  );
};

export default LandingPage;
