import React from 'react';

interface MenuInfoProps {
  children: React.ReactNode;
}

const MenuInfo: React.FC<MenuInfoProps> = ({ children }) => {
  return (
    <div className="flex items-center px-2 text-sm font-normal whitespace-nowrap">
      {children}
    </div>
  );
};

export default MenuInfo;
