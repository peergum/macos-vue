import React from 'react';

interface WindowButtonProps {
  color: 'red' | 'yellow' | 'green';
  onClick?: () => void;
}

const WindowButton: React.FC<WindowButtonProps> = ({ color, onClick }) => {
  const colorClasses = {
    red: 'bg-red-500 hover:bg-red-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
    green: 'bg-green-500 hover:bg-green-600',
  };

  return (
    <div
      className={`w-4 h-4 rounded-full ${colorClasses[color]} cursor-pointer border border-gray-400 flex items-center justify-center`}
      onClick={(e) => {
        console.log('WindowButton clicked:', color, 'onClick:', !!onClick);
        e.stopPropagation();
        if (onClick) {
          console.log('Calling onClick handler');
          onClick();
        } else {
          console.log('No onClick handler provided');
        }
      }}
      style={{ minWidth: '16px', minHeight: '16px' }}
    />
  );
};

export default WindowButton;
