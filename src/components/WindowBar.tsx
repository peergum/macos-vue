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
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

const WindowBar: React.FC<WindowBarProps> = ({
  title,
  plugins,
  pluginName,
  onMouseDown,
  onMouseUp,
  onClose,
  onMinimize,
  onMaximize,
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
      onMouseDown={(e) => {
        e.stopPropagation();
        if (onMouseDown) onMouseDown(e);
      }}
      onMouseUp={onMouseUp}
    >
      <div 
        className="flex gap-2"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <WindowButton color="red" onClick={onClose} />
        <WindowButton color="yellow" onClick={onMinimize} />
        <WindowButton color="green" onClick={onMaximize} />
      </div>
      <div className="flex-grow flex items-center justify-center min-w-0">
        {getIcon()}
        <span className="text-sm font-medium truncate">{title}</span>
      </div>
      <div className="w-16" /> {/* Spacer for centering */}
    </div>
  );
};

export default WindowBar;
