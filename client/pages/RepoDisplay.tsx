import React from 'react';
import '../stylesheets/scss/styles.scss';
import RepoComponent from '../components/RepoComponent';


const RepoDisplay: React.FC = () => {
  return (
    <div>
      <h1>Repository comp</h1>
      <RepoComponent/>
    </div>
  );
};

export default RepoDisplay;

