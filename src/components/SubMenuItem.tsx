import React from 'react';
import { MenuItem } from '../types';

interface SubMenuItemProps {
  item: MenuItem;
  onMenuClick?: (name: string) => void;
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({ item, onMenuClick }) => {
  const handleClick = () => {
    if (item.label && onMenuClick) {
      onMenuClick(item.label);
    }
  };

  if (item.name === '---') {
    return <hr className="my-1 border-gray-300" />;
  }

  return (
    <div
      className="px-4 py-1 hover:bg-apple-selected cursor-pointer text-sm"
      onClick={handleClick}
    >
      {item.name}
    </div>
  );
};

export default SubMenuItem;
