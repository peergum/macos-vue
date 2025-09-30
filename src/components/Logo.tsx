import React from 'react';

interface LogoProps {
  image: string;
  width?: string;
  height?: string;
}

const Logo: React.FC<LogoProps> = ({ image, width = '20px', height = '20px' }) => {
  return (
    <img
      src={image}
      alt="Logo"
      style={{ width, height }}
      className="object-contain"
    />
  );
};

export default Logo;
