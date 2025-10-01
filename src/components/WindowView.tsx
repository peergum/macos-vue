import React, { useState, useEffect } from 'react';
import Convert from 'ansi-to-html';
import Terminal from './Terminal';
import { WindowDefinition, PluginList } from '../types';

const ansi = new Convert();

interface WindowViewProps {
  definitions: WindowDefinition;
  index: number;
  plugins?: PluginList;
  focused: boolean;
  onRaise?: (e: React.MouseEvent) => void;
}

const WindowView: React.FC<WindowViewProps> = ({
  definitions,
  index,
  plugins,
  focused,
  onRaise,
}) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (definitions.contentUrl && definitions.type === 'viewer') {
      fetch(definitions.contentUrl)
        .then((response) => response.text())
        .then((text) => {
          setContent(text.replace(/\r?\n/g, '<br/>').replace(/ /g, '&nbsp;'));
        })
        .catch(() => setContent(''));
    }
  }, [definitions.contentUrl, definitions.type]);

  const windowStyle: React.CSSProperties = {
    backgroundColor: definitions.bg,
  };

  if (definitions.picture) {
    windowStyle.backgroundImage = `url("${definitions.picture}")`;
    windowStyle.backgroundSize = 'contain';
    windowStyle.backgroundPosition = 'center';
    windowStyle.backgroundRepeat = 'no-repeat';
  }

  // Plugin component
  if (plugins && definitions.pluginName && plugins[definitions.pluginName]) {
    const PluginComponent = plugins[definitions.pluginName][0];
    return <PluginComponent definitions={definitions} index={index} />;
  }

  // Terminal
  if (definitions.type === 'terminal') {
    return (
      <div 
        onClick={(e) => {
          e.stopPropagation();
          if (onRaise) onRaise(e);
        }}
        className="w-full h-full"
      >
        <Terminal
          definitions={definitions}
          index={index}
          focused={focused}
        />
      </div>
    );
  }

  // Browser
  if (definitions.type === 'browser') {
    return (
      <div 
        className="flex flex-col h-full"
        onClick={(e) => {
          e.stopPropagation();
          if (onRaise) onRaise(e);
        }}
      >
        <iframe src={definitions.content} className="flex-grow w-full h-full" />
      </div>
    );
  }

  // Viewer or photo
  return (
    <div
      className={`h-full ${definitions.type === 'viewer' ? 'font-mono' : ''}`}
      style={windowStyle}
      onClick={(e) => {
        e.stopPropagation();
        if (onRaise) onRaise(e);
      }}
    >
      {content ? (
        <div
          className="overflow-clip"
          dangerouslySetInnerHTML={{ __html: ansi.toHtml(content) }}
        />
      ) : definitions.content ? (
        <div className="overflow-scroll scroll-smooth">{definitions.content}</div>
      ) : null}
    </div>
  );
};

export default WindowView;
