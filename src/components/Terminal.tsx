import React, { useState, useEffect, useRef } from 'react';
import { useWindowStore } from '../stores';
import { WindowDefinition } from '../types';

interface TerminalProps {
  definitions: WindowDefinition;
  index: number;
  focused: boolean;
  onClick?: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ definitions, index, focused, onClick }) => {
  const [textValue, setTextValue] = useState('');
  const [cursOn, setCursOn] = useState(false);
  const [outputKey, setOutputKey] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const { terminals } = useWindowStore();
  const terminal = terminals[index];

  useEffect(() => {
    if (terminal) {
      terminal.onChange = () => {
        setOutputKey((prev) => prev + 1);
      };
    }
  }, [terminal]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursOn((prev) => !prev);
      setOutputKey((prev) => prev + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (!terminal) return;

    const { key, ctrlKey } = event;

    if (ctrlKey) {
      if (key === 'c' || key === 'x') {
        terminal.ctrlC();
      }
      return;
    }

    if (key.length === 1 && key >= ' ' && key <= '~') {
      terminal.keypress(key);
    } else if (key === 'Enter') {
      terminal.exec();
      setTextValue('');
    } else if (key === 'Backspace') {
      terminal.backspace();
    } else if (key === 'ArrowUp') {
      terminal.goHistory(-1);
    } else if (key === 'ArrowDown') {
      terminal.goHistory(1);
    }
  };

  const convert = (text: string): string => {
    let out = '';
    let st = 0;
    for (let i = 0; i < text.length; i++) {
      let c = text[i];
      if (text[i] === '<') {
        st = 1;
      } else if (text[i] === '>') {
        st = 0;
      } else if (text[i] === ' ' && !st) {
        c = '&nbsp;';
      } else if (text[i] === '\n') {
        c = '<br/>';
      }
      out += c;
    }
    return out;
  };

  const cursorValue = cursOn ? '_' : ' ';

  if (!terminal) return null;

  return (
    <div
      className={`w-full h-full flex flex-col-reverse items-end bg-${definitions.bg} text-${definitions.text}`}
      style={{ backgroundColor: definitions.bg, color: definitions.text }}
      onClick={onClick}
    >
      <input
        ref={inputRef}
        className="absolute w-0 h-0 opacity-0"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        onKeyUp={handleKeyPress}
      />
      <div className="flex flex-col-reverse w-full h-fit overflow-auto">
        <div
          key={outputKey}
          className="h-fit text-sm font-mono p-2"
          dangerouslySetInnerHTML={{
            __html:
              convert(terminal.buffer) +
              terminal.typingBuffer +
              `<span style="background-color:white; color:white;">${cursorValue}</span> `,
          }}
        />
      </div>
    </div>
  );
};

export default Terminal;
