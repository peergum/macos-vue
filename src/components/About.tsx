import React from 'react';

interface AboutProps {
  show: boolean;
  content?: string;
  onClose: () => void;
}

const About: React.FC<AboutProps> = ({ show, content, onClose }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <p className="text-gray-700 mb-6">
          {content || 'MacOS React - A modern macOS UI simulation built with React'}
        </p>
        <div className="text-sm text-gray-500 mb-4">
          <p>Version 3.0.0</p>
          <p>Built with React, TypeScript, and Tailwind CSS</p>
        </div>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default About;
