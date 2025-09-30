import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { WindowDefinition } from '../types';

interface PDFViewerProps {
  definitions: WindowDefinition;
  index: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ definitions }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  if (!definitions.contentUrl) {
    return <div className="w-full h-full flex items-center justify-center">No PDF URL provided</div>;
  }

  return (
    <div className="w-full h-full overflow-auto">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={definitions.contentUrl}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </div>
  );
};

export default PDFViewer;
