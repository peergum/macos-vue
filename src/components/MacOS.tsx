import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import MenuBar from './MenuBar';
import Window from './Window';
import About from './About';
import { MacOSDefinitions, WindowDefinition } from '../types';
import { useWindowStore, useMenuStore } from '../stores';
import { extendCommands, Terminal } from '../terminal';
import sonomaBar from '../assets/images/sonoma-bar.png';
import notch from '../assets/images/notch.png';

const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;
const MOUSE_PX_SENSITIVITY = 5;

interface MacOSProps {
  definitions: MacOSDefinitions;
}

const MacOS: React.FC<MacOSProps> = ({ definitions }) => {
  const [screenLock, setScreenLock] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [antiNotch, setAntiNotch] = useState(false);
  const [now, setNow] = useState<Dayjs>(dayjs());
  const [windows, setWindows] = useState<WindowDefinition[]>(definitions.windows);
  const [windowOrder, setWindowOrder] = useState<number[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<Set<number>>(new Set());
  const [screenKey, setScreenKey] = useState(0);
  const [cursor, setCursor] = useState('default');
  const [moving, setMoving] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [sizer, setSizer] = useState(0);
  
  const lastMouse = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const item = useRef({ index: -1, x: 0, y: 0, w: 0, h: 0 });
  const passwordFieldRef = useRef<HTMLInputElement>(null);

  const { setTerminal } = useWindowStore();
  const { setClose } = useMenuStore();

  const sonomaDefault =
    'http://sylvan.apple.com/itunes-assets/Aerials126/v4/ec/eb/c8/ecebc8d2-5486-c2b2-52ae-6f0ab2d6b65f/W010_C003_F01_third_sdr_4k_qp24_15Mbps_240p_t2160_tsa.mov';

  const defs = useMemo(
    () => ({
      screen: {
        w: 1000,
        h: 1000,
        bg: 'white',
        text: 'rgb(82 82 82)',
      },
      menu: definitions.menu,
    }),
    [definitions.menu]
  );

  useEffect(() => {
    extendCommands(definitions.system?.commands);
    const initialOrder: number[] = [];
    windows.forEach((w, i) => {
      initialOrder.push(i);
      if (w.type === 'terminal') {
        const terminal = new Terminal(definitions.system, i);
        setTerminal(i, terminal);
      }
    });
    setWindowOrder(initialOrder);

    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, [definitions.system, setTerminal]);

  useEffect(() => {
    if (showPassword && passwordFieldRef.current) {
      passwordFieldRef.current.focus();
    }
  }, [showPassword]);

  const reorder = useCallback((index: number) => {
    setWindowOrder((prev) => {
      const filtered = prev.filter((v) => v !== index);
      return [...filtered, index];
    });
    setScreenKey((prev) => prev + 1);
  }, []);

  const raise = useCallback(
    (object: any) => {
      // Use the index passed from the window component directly
      const index = object.index !== undefined ? object.index : windows.findIndex((w) => w.name === object.item);
      if (index >= 0) {
        reorder(index);
      }
    },
    [windows, reorder]
  );

  const mouseStart = useCallback(
    (object: any) => {
      setMoving(object.sizer === 0);
      setResizing(object.sizer !== 0);
      setSizer(object.sizer);
      // Use the index passed from the window component directly
      const index = object.index !== undefined ? object.index : windows.findIndex((w) => w.name === object.item);
      if (index >= 0) {
        reorder(index);
        item.current.index = index;
        mouse.current.x = object.event.clientX;
        mouse.current.y = object.event.clientY;
        item.current.x = windows[index].x;
        item.current.y = windows[index].y;
        item.current.w = windows[index].w;
        item.current.h = windows[index].h;
      }
    },
    [windows, reorder]
  );

  const mouseStop = useCallback(() => {
    setMoving(false);
    setResizing(false);
  }, []);

  const handleWindowClose = useCallback(
    (index: number) => {
      console.log('handleWindowClose called with index:', index);
      setWindows((prev) => prev.filter((_, i) => i !== index));
      setWindowOrder((prev) => prev.filter((i) => i !== index).map((i) => i > index ? i - 1 : i));
      setMinimizedWindows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    },
    []
  );

  const handleWindowMinimize = useCallback(
    (index: number) => {
      console.log('handleWindowMinimize called with index:', index);
      setMinimizedWindows((prev) => new Set(prev).add(index));
    },
    []
  );

  const handleWindowRestore = useCallback(
    (index: number) => {
      console.log('handleWindowRestore called with index:', index);
      setMinimizedWindows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    },
    []
  );

  const mouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (
        (!moving && !resizing) ||
        (Math.abs(lastMouse.current.x - event.clientX) < MOUSE_PX_SENSITIVITY &&
          Math.abs(lastMouse.current.y - event.clientY) < MOUSE_PX_SENSITIVITY)
      ) {
        return;
      }

      lastMouse.current.x = event.clientX;
      lastMouse.current.y = event.clientY;

      const newWindows = [...windows];
      const idx = item.current.index;

      if (moving) {
        newWindows[idx].x = Math.floor(
          item.current.x +
            (defs.screen.w * (event.clientX - mouse.current.x)) / window.innerWidth
        );
        newWindows[idx].y = Math.floor(
          item.current.y +
            (defs.screen.h * (event.clientY - mouse.current.y)) / window.innerHeight
        );
      } else if (resizing) {
        const resizeLeft = () => {
          newWindows[idx].x = Math.floor(
            item.current.x +
              (defs.screen.w * (event.clientX - mouse.current.x)) / window.innerWidth
          );
          const diff =
            (defs.screen.w * (mouse.current.x - event.clientX)) / window.innerWidth;
          const v = Math.floor(item.current.w + diff);
          if (v < MIN_WIDTH) {
            setMoving(true);
            setResizing(false);
            newWindows[idx].w = MIN_WIDTH;
          } else {
            newWindows[idx].w = v;
          }
        };

        const resizeRight = () => {
          const diff =
            (defs.screen.w * (mouse.current.x - event.clientX)) / window.innerWidth;
          const v = Math.floor(item.current.w - diff);
          if (v < MIN_WIDTH) {
            setMoving(true);
            setResizing(false);
            mouse.current.x = event.clientX;
            newWindows[idx].w = MIN_WIDTH;
          } else {
            newWindows[idx].w = v;
          }
        };

        const resizeBottom = () => {
          const diff =
            (defs.screen.h * (mouse.current.y - event.clientY)) / window.innerHeight;
          const v = Math.floor(item.current.h - diff);
          if (v < MIN_HEIGHT) {
            setMoving(true);
            setResizing(false);
            mouse.current.y = event.clientY;
            newWindows[idx].h = MIN_HEIGHT;
          } else {
            newWindows[idx].h = v;
          }
        };

        const resizeTop = () => {
          newWindows[idx].y = Math.floor(
            item.current.y +
              (defs.screen.h * (event.clientY - mouse.current.y)) / window.innerHeight
          );
          const diff =
            (defs.screen.h * (mouse.current.y - event.clientY)) / window.innerHeight;
          const v = Math.floor(item.current.h + diff);
          if (v < MIN_HEIGHT) {
            setMoving(true);
            setResizing(false);
            newWindows[idx].h = MIN_HEIGHT;
          } else {
            newWindows[idx].h = v;
          }
        };

        switch (sizer) {
          case 1:
            resizeTop();
            resizeLeft();
            break;
          case 2:
            resizeTop();
            break;
          case 3:
            resizeTop();
            resizeRight();
            break;
          case 4:
            resizeRight();
            break;
          case 5:
            resizeRight();
            resizeBottom();
            break;
          case 6:
            resizeBottom();
            break;
          case 7:
            resizeBottom();
            resizeLeft();
            break;
          case 8:
            resizeLeft();
            break;
        }
      }

      newWindows[idx].key = Date.now();
      setWindows(newWindows);
    },
    [moving, resizing, sizer, windows, defs.screen]
  );

  const updateSizer = useCallback((object: any) => {
    if (!moving && !resizing) {
      const newSizer = object.sizer;
      setSizer(newSizer);
      switch (newSizer) {
        case 1:
        case 5:
          setCursor('nwse-resize');
          break;
        case 2:
        case 6:
          setCursor('ns-resize');
          break;
        case 3:
        case 7:
          setCursor('nesw-resize');
          break;
        case 4:
        case 8:
          setCursor('ew-resize');
          break;
        default:
          setCursor('default');
      }
    }
  }, [moving, resizing]);

  const desktopClick = useCallback(() => {
    setClose(true);
  }, [setClose]);

  const menuClicked = useCallback((name: string) => {
    if (name === 'logo') {
      setShowAbout(true);
    }
  }, []);

  const mouseMoved = useCallback(
    (event: React.MouseEvent) => {
      if (event.clientX <= 10 && event.clientY <= 20) {
        setShowLogin(false);
        setScreenLock(true);
      } else if (screenLock && event.clientX > 10 && event.clientY > 10) {
        setShowLogin(true);
      }
    },
    [screenLock]
  );

  const checkPassword = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        const target = event.currentTarget as HTMLInputElement;
        if (target.value === definitions.system.password) {
          setScreenLock(false);
        } else {
          // Wrong password - clear and hide
          target.value = '';
          setShowPassword(false);
          setShowLogin(false);
        }
      } else if (event.key === 'Escape') {
        setShowPassword(false);
        setShowLogin(false);
      }
    },
    [definitions.system.password]
  );

  if (screenLock) {
    return (
      <>
        <About
          show={showAbout}
          onClose={() => setShowAbout(false)}
          content={definitions.about}
        />
        <div
          className="w-screen h-screen bg-black p-4"
          onMouseMove={mouseMoved}
        >
          <div className="static absolute z-20 w-full h-0 bg-red-500 flex flex-col content-center">
            <div
              className={`absolute z-20 text-xs text-white top-0.5 self-center ${
                antiNotch ? 'block' : 'hidden'
              }`}
              onMouseEnter={() => setAntiNotch(true)}
              onMouseLeave={() => setAntiNotch(false)}
            >
              This notch sucks, Apple™!
            </div>
            <img
              src={notch}
              className="absolute z-10 w-48 h-8 self-center"
              onMouseEnter={() => setAntiNotch(true)}
              onMouseLeave={() => setAntiNotch(false)}
              alt="notch"
            />
            <div className="absolute font-inter font-semibold w-full h-fit top-20 flex flex-col gap-4 items-center justify-center text-white opacity-80">
              <div className="text-4xl">{now.format('dddd, MMMM D')}</div>
              <div className="text-9xl">{now.format('h:mm')}</div>
            </div>
          </div>
          {showLogin && (
            <div className="static absolute z-10 w-full h-full flex flex-col content-center font-extralight">
              <div className="absolute z-30 w-full flex flex-col items-center gap-4 bottom-20">
                <div className="mb-8 text-white">
                  {definitions.system?.message}
                </div>
                <div className="rounded-full w-14 h-14 bg-gray-400 text-white flex items-center justify-center text-2xl">
                  {definitions.system.initials}
                </div>
                {!showPassword ? (
                  <div
                    onClick={() => setShowPassword(true)}
                    className="text-white text-xl cursor-pointer"
                  >
                    {definitions.system.fullname}
                  </div>
                ) : (
                  <input
                    ref={passwordFieldRef}
                    type="password"
                    autoFocus
                    className="w-60 h-8 bg-neutral-400 rounded-2xl text-white px-4 border-none outline-none opacity-80 placeholder-gray-300"
                    placeholder="Enter password"
                    onKeyDown={checkPassword}
                  />
                )}
              </div>
            </div>
          )}
          <video
            className="w-full h-full overflow-hidden"
            src={definitions.saverUrl ?? sonomaDefault}
            autoPlay
            loop
            muted
          />
        </div>
      </>
    );
  }

  return (
    <>
      <About
        show={showAbout}
        onClose={() => setShowAbout(false)}
        content={definitions.about}
      />
      <div className="w-screen h-screen bg-black p-4" onMouseMove={mouseMoved}>
        <div className="w-full h-full bg-apple bg-cover bg-center flex flex-col rounded-2xl">
          <MenuBar
            logo={defs.menu.logo}
            items={defs.menu.items}
            about={defs.menu.about}
            onMenuClick={menuClicked}
          />
          <div
            key={screenKey}
            className="relative flex-grow flex-auto overflow-hidden cursor-pointer"
            style={{ cursor }}
            onMouseMove={mouseMove}
            onMouseUp={mouseStop}
            onClick={desktopClick}
          >
            {windowOrder.map((index) => (
              <Window
                key={windows[index].key || index}
                definitions={windows[index]}
                plugins={definitions.plugins}
                screen={defs.screen}
                order={windowOrder.indexOf(index) + 1}
                index={index}
                onMouseStart={mouseStart}
                onMouseStop={mouseStop}
                onUpdateSizer={updateSizer}
                onRaise={raise}
                onClose={handleWindowClose}
                onMinimize={handleWindowMinimize}
                onMaximize={handleWindowRestore}
                isMinimized={minimizedWindows.has(index)}
              />
            ))}
            {/* Dock for minimized windows */}
            {minimizedWindows.size > 0 && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 rounded-lg p-2">
                {Array.from(minimizedWindows).map((windowIndex) => (
                  <div
                    key={windowIndex}
                    className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors"
                    onClick={() => handleWindowRestore(windowIndex)}
                    title={windows[windowIndex]?.name || 'Window'}
                  >
                    <span className="text-white text-xs font-bold">
                      {windows[windowIndex]?.name?.charAt(0) || 'W'}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="absolute bottom-0 w-full flex justify-center">
              <img
                src={sonomaBar}
                width="60%"
                height="5%"
                className="self-center mb-2"
                alt="dock"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MacOS;
