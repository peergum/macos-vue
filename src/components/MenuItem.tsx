import React from 'react';
import { MenuItem as MenuItemType } from '../types';
import SubMenu from './SubMenu';

interface MenuItemProps {
  item: MenuItemType;
  active?: boolean;
  onUpdateActive?: (item: MenuItemType) => void;
  onMouseEnter?: () => void;
  onMenuClick?: (name: string) => void;
  children?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({
  item,
  active = false,
  onUpdateActive,
  onMouseEnter,
  onMenuClick,
  children,
}) => {
  const handleClick = () => {
    if (onUpdateActive) {
      onUpdateActive(item);
    }
  };

  if (item.name === '---') {
    return <div className="w-px h-6 bg-gray-400 mx-2"></div>;
  }

  return (
    <div
      className="relative flex items-center px-2 py-1 cursor-pointer hover:bg-apple-selected rounded"
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
    >
      {children || <span className="text-sm font-medium">{item.name}</span>}
      {active && item.menu && (
        <SubMenu menu={item.menu} onMenuClick={onMenuClick} />
      )}
    </div>
  );
};

export default MenuItem;
