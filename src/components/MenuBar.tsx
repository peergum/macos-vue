import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple } from '@fortawesome/free-brands-svg-icons';
import { MenuItem as MenuItemType } from '../types';
import MenuItem from './MenuItem';
import MenuInfo from './MenuInfo';
import Logo from './Logo';
import dayjs from 'dayjs';
import { useMenuStore } from '../stores';
import icons from '../assets/images/icons.png';
import notch from '../assets/images/notch.png';

interface MenuBarProps {
  logo?: string;
  items: MenuItemType[];
  about?: string;
  onMenuClick?: (name: string) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ logo, items, about, onMenuClick }) => {
  const [clock, setClock] = useState('');
  const [menuActive, setMenuActive] = useState<MenuItemType>({ name: '' });
  const [antiNotch, setAntiNotch] = useState(false);
  const { close, closed, setClose, setClosed } = useMenuStore();

  const logoMenu: MenuItemType = {
    name: '@',
    menu: [
      {
        name: about ?? 'About MacOS React',
        label: 'about',
      },
    ],
  };

  useEffect(() => {
    const updateClock = () => {
      setClock(dayjs().format('ddd MMM D hh:mm:ss A'));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (close && !closed) {
      setMenuActive({ name: '' });
      setClose(false);
      setClosed(true);
    }
  }, [close, closed, setClose, setClosed]);

  const menuChanged = (item: MenuItemType) => {
    if (menuActive.name !== item.name) {
      setMenuActive(item);
      setClosed(false);
      setClose(false);
    } else {
      setClose(true);
    }
  };

  const hover = (item: MenuItemType) => {
    if (menuActive.name && menuActive.name !== item.name) {
      setMenuActive(item);
      setClose(false);
      setClosed(false);
    }
  };

  const handleMenuClick = (name: string) => {
    if (onMenuClick) {
      onMenuClick(name);
    }
  };

  return (
    <div className="static w-full px-2 shadow-sm border-b border-gray-500 shadow-gray-300 bg-apple-bar h-9 flex flex-row justify-start font-[Roboto] rounded-t-2xl">
      <div
        className="static absolute z-10 w-full h-0 flex flex-col content-center"
        onMouseEnter={() => setAntiNotch(true)}
        onMouseLeave={() => setAntiNotch(false)}
      >
        {antiNotch && (
          <div className="absolute z-30 text-xs text-white top-0.5 self-center">
            This notch sucks, Apple™!
          </div>
        )}
        <img src={notch} className="absolute z-20 w-48 h-8 self-center" alt="notch" />
      </div>
      
      <MenuItem
        item={logoMenu}
        onMouseEnter={() => hover(logoMenu)}
        onUpdateActive={menuChanged}
        active={logoMenu.name !== '---' && menuActive.name === logoMenu.name}
        onMenuClick={() => handleMenuClick('logo')}
      >
        {logo ? (
          <Logo image={logo} width="20px" height="20px" />
        ) : (
          <FontAwesomeIcon icon={faApple} className="text-lg mb-1" />
        )}
      </MenuItem>

      {items.map((item, index) => (
        <MenuItem
          key={index}
          item={item}
          onMouseEnter={() => hover(item)}
          onUpdateActive={menuChanged}
          active={item.name !== '---' && menuActive.name === item.name}
          onMenuClick={handleMenuClick}
        />
      ))}

      <div className="flex-grow" />

      <div className="flex items-center -mx-4">
        <img src={icons} width="230px" height="4px" alt="icons" />
      </div>

      <MenuInfo>{clock}</MenuInfo>
    </div>
  );
};

export default MenuBar;
