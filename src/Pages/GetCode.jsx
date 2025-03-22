import React, { useState } from "react";

const codeSnippets = {
  react: `import React from 'react';

const App = () => {
  return <h1>Hello, React!</h1>;
};

export default App;`,
  nextjs: `import React from 'react';

const Home = () => {
  return <h1>Welcome to Next.js!</h1>;
};

export default Home;`,
  vanilla: `document.addEventListener('DOMContentLoaded', () => {
  document.body.innerHTML = '<h1>Hello, Vanilla JS!</h1>';
});`,
};

const CodeSnippetPopup = () => {
  const [copied, setCopied] = useState(null);
  const [activeTab, setActiveTab] = useState("react");
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = (code, type) => {
    navigator.clipboard.writeText(code);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 border rounded"
      >
        Open Code Snippets
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <div className="flex justify-between mb-4">
              <button
                onClick={() => setActiveTab("react")}
                className={activeTab === "react" ? "font-bold" : ""}
              >
                React
              </button>
              <button
                onClick={() => setActiveTab("nextjs")}
                className={activeTab === "nextjs" ? "font-bold" : ""}
              >
                Next.js
              </button>
              <button
                onClick={() => setActiveTab("vanilla")}
                className={activeTab === "vanilla" ? "font-bold" : ""}
              >
                Vanilla JS
              </button>
            </div>
            <div className="relative p-4 bg-gray-900 text-white rounded-md">
              <pre className="overflow-auto text-sm">
                <code>{codeSnippets[activeTab]}</code>
              </pre>
              <button
                className="absolute top-2 right-2 p-1 bg-gray-700 rounded"
                onClick={() => handleCopy(codeSnippets[activeTab], activeTab)}
              >
                Copy
              </button>
              {copied === activeTab && (
                <span className="absolute bottom-2 right-2 text-green-400 text-xs">
                  Copied!
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeSnippetPopup;
