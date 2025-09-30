import React from 'react';
import { MenuItem } from '../types';
import SubMenuItem from './SubMenuItem';

interface SubMenuProps {
  menu: MenuItem[];
  onMenuClick?: (name: string) => void;
}

const SubMenu: React.FC<SubMenuProps> = ({ menu, onMenuClick }) => {
  return (
    <div className="absolute top-full left-0 mt-1 bg-apple-bar border border-gray-400 rounded-md shadow-lg min-w-[200px] py-1 z-50">
      {menu.map((item, index) => (
        <SubMenuItem key={index} item={item} onMenuClick={onMenuClick} />
      ))}
    </div>
  );
};

export default SubMenu;
