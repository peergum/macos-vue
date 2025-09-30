import React from 'react';
import WindowButton from './WindowButton';
import { PluginList } from '../types';

interface WindowBarProps {
  title: string;
  type: string;
  plugins?: PluginList;
  pluginName?: string;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
}

const WindowBar: React.FC<WindowBarProps> = ({
  title,
  plugins,
  pluginName,
  onMouseDown,
  onMouseUp,
}) => {
  const getIcon = () => {
    if (pluginName && plugins && plugins[pluginName]) {
      return (
        <img
          src={plugins[pluginName][1]}
          alt={title}
          className="w-5 h-5 mr-2"
        />
      );
    }
    return null;
  };

  return (
    <div
      className="flex items-center px-3 py-2 bg-apple-bar border-b border-gray-300 rounded-t-xl cursor-move"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <div className="flex gap-2">
        <WindowButton color="red" />
        <WindowButton color="yellow" />
        <WindowButton color="green" />
      </div>
      <div className="flex-grow flex items-center justify-center">
        {getIcon()}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="w-16" /> {/* Spacer for centering */}
    </div>
  );
};

export default WindowBar;
