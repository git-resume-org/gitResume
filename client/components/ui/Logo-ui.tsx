import React from 'react';
import Image from "./Image";

interface LogoUiProps {
  variant?: string;
  tailclassName?: string;
}

const variants: { [key: string]: string } = {
  header: "w-1/6",
  footer: "w-1/6",
};

const LogoUi: React.FC<LogoUiProps> = ({ variant = '', tailclassName = '' }) => {
  const variantClassName = variants[variant];
  const combinedClassName = `${variantClassName} ${tailclassName}`;

  return (
    <a href='/'>
      <Image
        src='/assets/images/gitResume_lg.png'
        alt='logo'
        className={combinedClassName}
      />
    </a>
  );
};

const LogoUiHeader: React.FC = () => <LogoUi variant='header' />;
const LogoUiFooter: React.FC = () => <LogoUi variant='footer' tailclassName='relative bottom-2 left-1/2 transform -translate-x-1/2' />;

export { LogoUi, LogoUiHeader, LogoUiFooter };
