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
      className={`w-3 h-3 rounded-full ${colorClasses[color]} cursor-pointer border border-gray-400`}
      onClick={onClick}
    />
  );
};

export default WindowButton;
