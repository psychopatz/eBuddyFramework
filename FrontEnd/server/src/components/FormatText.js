import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism'; // or any other style

function FormatText({ text }) {
  const renderers = {
    code: ({ language, value }) => {
      return <SyntaxHighlighter style={materialLight} language={language} children={value} />
    }
  };

  return (
    <ReactMarkdown
      children={text}
      remarkPlugins={[remarkGfm]}
      components={renderers} // use 'components' prop in newer versions of react-markdown
    />
  );
}

export default FormatText;
