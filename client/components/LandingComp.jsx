import React from 'react';
import '../stylesheets/scss/styles.scss'; // make sure to import your styles

const LandingComp = () => {
  return (
    // this first style centers the text in the middle of the page
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div >
        <span style={{ fontSize: '3rem' }}>get</span>
        <button className="btn" style={{ fontSize: '5rem', margin: '.5rem' }}>gitRésumé</button>
        <span style={{ fontSize: '3rem' }}>to get your résumé from git</span>
      </div>
    </div>
  );
};

export default LandingComp;
