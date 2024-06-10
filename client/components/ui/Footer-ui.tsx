import React from 'react';

import { LogoUiFooter } from './Logo-ui';

interface FooterUiProps {
  className?: string;
}

const FooterUi: React.FC<FooterUiProps> = ({ className }) => {
  return (
    <footer className={`w-full flex flex-col md:flex-col justify-between items-center p-6 bg-blackGR ${className}`}>
      <LogoUiFooter />
      <div className='text-white text-xs text-center md:text-left' >© 2024 gitResume.All Rights Reserved. </div>

      {/* <div className='text-greenGR text-md text-center md:text-left'>
          <h1 className="py-1">About Us</h1>
          <h1 className="py-1">Application</h1>
          <h1 className="py-1">Pricing</h1>
          </div> */}
      {/* <div className="h-6" > </div> */}

    </footer>
  );
};

export { FooterUi }
