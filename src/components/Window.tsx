import React, { useState, useMemo, useCallback } from 'react';
import WindowBar from './WindowBar';
import WindowView from './WindowView';
import { WindowDefinition, ScreenDefinitions, PluginList } from '../types';
import { useWindowStore } from '../stores';

interface WindowProps {
  definitions: WindowDefinition;
  screen: ScreenDefinitions;
  index: number;
  plugins?: PluginList;
  order: number;
  onMouseStart?: (data: any) => void;
  onMouseStop?: (data: any) => void;
  onUpdateSizer?: (data: any) => void;
  onRaise?: (data: any) => void;
  onClose?: (index: number) => void;
  onMinimize?: (index: number) => void;
  onMaximize?: (index: number) => void;
  isMinimized?: boolean;
}

const Window: React.FC<WindowProps> = ({
  definitions,
  screen,
  index,
  plugins,
  order,
  onMouseStart,
  onMouseStop,
  onUpdateSizer,
  onRaise,
  onClose,
  onMinimize,
  onMaximize,
  isMinimized = false,
}) => {
  const [sizer, setSizer] = useState(0);
  const [moving, setMoving] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const { focused, setFocused } = useWindowStore();

  // Window control handlers
  const handleClose = useCallback(() => {
    console.log('handleClose called for window:', index, 'onClose:', !!onClose);
    if (onClose) {
      onClose(index);
    }
  }, [onClose, index]);

  const handleMinimize = useCallback(() => {
    console.log('handleMinimize called for window:', index, 'onMinimize:', !!onMinimize);
    if (onMinimize) {
      onMinimize(index);
    }
  }, [onMinimize, index]);

  const handleMaximize = useCallback(() => {
    console.log('handleMaximize called for window:', index, 'onMaximize:', !!onMaximize, 'isMaximized:', isMaximized);
    if (isMaximized) {
      // Restore to original dimensions
      setIsMaximized(false);
    } else {
      // Maximize the window
      setIsMaximized(true);
    }
    if (onMaximize) {
      onMaximize(index);
    }
  }, [isMaximized, onMaximize, index]);

  const defs = useMemo(
    () => {
      const baseW = Math.floor((window.innerWidth * definitions.w) / screen.w);
      const baseH = Math.floor((window.innerHeight * definitions.h) / screen.h);
      const baseX = Math.floor((window.innerWidth * (definitions.x || 0)) / screen.w);
      const baseY = Math.floor((window.innerHeight * (definitions.y || 0)) / screen.h);

      return {
        name: definitions.name || 'window',
        type: definitions.type,
        w: isMaximized ? window.innerWidth : baseW,
        h: isMaximized ? window.innerHeight - 40 : baseH, // 40px for menu bar
        x: isMaximized ? 0 : baseX,
        y: isMaximized ? 40 : baseY, // 40px for menu bar
        bg: definitions.bg || screen.bg,
        text: definitions.text || screen.text,
        opacity: (definitions.opacity || 100) / 100,
        picture: definitions.picture,
        content: definitions.content,
        contentUrl: definitions.contentUrl,
        class: definitions.class,
        pluginName: definitions.pluginName,
      };
    },
    [definitions, screen, isMaximized]
  );

  const windowStyle: React.CSSProperties = {
    width: `${defs.w}px`,
    height: `${defs.h}px`,
    marginLeft: `${defs.x}px`,
    marginTop: `${defs.y}px`,
    backgroundColor: defs.bg,
    color: defs.text,
    opacity: isMinimized ? 0.3 : defs.opacity,
    zIndex: order,
    position: 'absolute',
    display: isMinimized ? 'none' : 'flex',
    flexDirection: 'column',
    borderRadius: '12px',
    border: '1px solid #d1d5db',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    cursor: moving ? 'grabbing' : 'grab',
    userSelect: 'none',
    transition: (moving || resizing) ? 'none' : 'all 0.3s ease-in-out',
    transform: isMinimized ? 'scale(0.8)' : 'scale(1)',
  };

  const raise = useCallback(
    (event: React.MouseEvent) => {
      if (onRaise) {
        onRaise({ item: defs.name, event, index });
      }
      setFocused(index);
    },
    [onRaise, defs.name, index, setFocused]
  );

  const mouseStart = useCallback(
    (event: React.MouseEvent) => {
      if (onMouseStart) {
        onMouseStart({ sizer, item: defs.name, event, index });
      }
      setMoving(sizer === 0);
      setResizing(sizer !== 0);
      setFocused(index);
    },
    [onMouseStart, sizer, defs.name, index, setFocused]
  );

  const mouseStop = useCallback(
    (event: React.MouseEvent) => {
      if (onMouseStop) {
        onMouseStop({ item: defs.name, event });
      }
      setMoving(false);
      setResizing(false);
    },
    [onMouseStop, defs.name]
  );

  const checkCorners = useCallback(
    (event: React.MouseEvent) => {
      if (moving || resizing) return;

      const MARGIN = 7;
      const mx = event.nativeEvent.offsetX;
      const my = event.nativeEvent.offsetY;
      let newSizer = 0;

      if (mx < MARGIN && my < MARGIN) {
        newSizer = 1;
      } else if (my < MARGIN && mx > MARGIN && mx < defs.w - MARGIN) {
        newSizer = 2;
      } else if (my < MARGIN && mx > defs.w - MARGIN) {
        newSizer = 3;
      } else if (mx > defs.w - MARGIN && my > MARGIN && my < defs.h - MARGIN) {
        newSizer = 4;
      } else if (mx > defs.w - MARGIN && my > defs.h - MARGIN) {
        newSizer = 5;
      } else if (my > defs.h - MARGIN && mx > MARGIN && mx < defs.w - MARGIN) {
        newSizer = 6;
      } else if (mx < MARGIN && my > defs.h - MARGIN) {
        newSizer = 7;
      } else if (mx < MARGIN && my > MARGIN && my < defs.h - MARGIN) {
        newSizer = 8;
      }

      setSizer(newSizer);
      if (onUpdateSizer) {
        onUpdateSizer({ sizer: newSizer });
      }
    },
    [moving, resizing, defs.w, defs.h, onUpdateSizer]
  );

  return (
    <div
      style={windowStyle}
      onMouseMove={checkCorners}
      onMouseDown={(e) => {
        // Stop propagation to prevent desktop click from stealing focus
        e.stopPropagation();
        // Always raise window when clicking anywhere on it
        raise(e);
        // Only start move/resize when clicking on the window edges
        if (e.currentTarget === e.target) mouseStart(e);
      }}
      onClick={(e) => {
        // Stop propagation on click as well
        e.stopPropagation();
      }}
      onMouseUp={mouseStop}
    >
      <WindowBar
        title={defs.name}
        type={defs.type}
        plugins={plugins}
        pluginName={defs.pluginName}
        onMouseDown={mouseStart}
        onMouseUp={mouseStop}
        onClose={handleClose}
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
      />
      <div className="relative flex-grow rounded-b-xl m-2 h-full overflow-auto">
        <WindowView
          definitions={defs}
          plugins={plugins}
          index={index}
          focused={focused === index}
          onRaise={raise}
        />
      </div>
    </div>
  );
};

export default Window;
