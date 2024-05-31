import React from 'react';
// import '../stylesheets/scss/styles.scss'; // Make sure to import your styles
import { AuthComp } from './AuthComp';


const LandingComp: React.FC = () => {
  // const clientID = process.env.REACT_APP_GH_CLIENT_ID;
  // console.log('LandingComp clientID', clientID);
  // console.log(process.env);
  return (
    // This first style centers the text in the middle of the page
    // <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    //   <div>
    //     <span style={{ fontSize: '3rem' }}>get</span>
    //     <button className="btn" style={{ fontSize: '5rem', margin: '.5rem' }}>gitRésumé</button>
    //     <span style={{ fontSize: '3rem' }}>to get your résumé from git</span>
    //   </div>
    // </div>

    <AuthComp />
  );
};

export default LandingComp;
