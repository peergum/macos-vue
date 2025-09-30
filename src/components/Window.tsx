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
}) => {
  const [sizer, setSizer] = useState(0);
  const [moving, setMoving] = useState(false);
  const [resizing, setResizing] = useState(false);
  const { focused, setFocused } = useWindowStore();

  const defs = useMemo(
    () => ({
      name: definitions.name || 'window',
      type: definitions.type,
      w: Math.floor((window.innerWidth * definitions.w) / screen.w),
      h: Math.floor((window.innerHeight * definitions.h) / screen.h),
      x: Math.floor((window.innerWidth * (definitions.x || 0)) / screen.w),
      y: Math.floor((window.innerHeight * (definitions.y || 0)) / screen.h),
      bg: definitions.bg || screen.bg,
      text: definitions.text || screen.text,
      opacity: (definitions.opacity || 100) / 100,
      picture: definitions.picture,
      content: definitions.content,
      contentUrl: definitions.contentUrl,
      class: definitions.class,
      pluginName: definitions.pluginName,
    }),
    [definitions, screen]
  );

  const windowStyle: React.CSSProperties = {
    width: `${defs.w}px`,
    height: `${defs.h}px`,
    marginLeft: `${defs.x}px`,
    marginTop: `${defs.y}px`,
    backgroundColor: defs.bg,
    color: defs.text,
    opacity: defs.opacity,
    zIndex: order,
  };

  const raise = useCallback(
    (event: React.MouseEvent) => {
      if (onRaise) {
        onRaise({ item: defs.name, event });
      }
      setFocused(index);
    },
    [onRaise, defs.name, index, setFocused]
  );

  const mouseStart = useCallback(
    (event: React.MouseEvent) => {
      if (onMouseStart) {
        onMouseStart({ sizer, item: defs.name, event });
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
        if (e.currentTarget === e.target) mouseStart(e);
      }}
      onMouseUp={mouseStop}
      className={`absolute flex flex-col border border-black rounded-xl shadow shadow-black ${defs.class || ''}`}
    >
      <WindowBar
        title={defs.name}
        type={defs.type}
        plugins={plugins}
        pluginName={defs.pluginName}
        onMouseDown={mouseStart}
        onMouseUp={mouseStop}
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
