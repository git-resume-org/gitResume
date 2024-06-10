import React from 'react';
import { NavigationMenu } from "./NavBar";
import { Button } from './get-started-button';

import { LogoUiHeader } from './Logo-ui';

interface HeaderUiProps {
  buttonOnClick?: () => void; // the question mark makes the prop optional. without it, it's required, throws an error otherwise.
  buttonContent?: string;
  buttonHide?: boolean;
}

const HeaderUi: React.FC<HeaderUiProps> = ({ buttonOnClick, buttonContent, buttonHide }) => {
  return (
    <header className='w-full fixed top-0 left-0 z-50 bg-blackGR backdrop-blur-sm shadow-lg h-[90px]'>
      <div className='w-full flex items-center justify-between p-5'>
        < LogoUiHeader />
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <NavigationMenu />
        </div>
       <Button
          variant='header'
          onClick={buttonOnClick}
          className={buttonHide ? 'invisible' : ''}
          size='lg'
         >
          {buttonContent}
        </Button>
      </div>
    </header>
  );
};

export { HeaderUi }
