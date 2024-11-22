import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

interface CodeEditorProps {
  language: 'javascript' | 'html' | 'css';
  userId: string;
}

export function CodeEditor({ language, userId }: CodeEditorProps) {
  const [code, setCode] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  const getLanguageExtension = () => {
    switch (language) {
      case 'javascript':
        return javascript();
      case 'html':
        return html();
      case 'css':
        return css();
      default:
        return javascript();
    }
  };

  const validateCode = async () => {
    try {
      // For JavaScript validation
      if (language === 'javascript') {
        new Function(code); // This will throw if syntax is invalid
      }
      
      // Save to DynamoDB
      await client.models.CodeSnippet.create({
        language,
        code,
        isValid: true,
        validationMessage: 'Code is valid',
        userId,
      });
      
      setValidationMessage('Code is valid!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid code';
      
      await client.models.CodeSnippet.create({
        language,
        code,
        isValid: false,
        validationMessage: errorMessage,
        userId,
      });
      
      setValidationMessage(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <CodeMirror
        value={code}
        height="400px"
        theme={oneDark}
        extensions={[getLanguageExtension()]}
        onChange={(value) => setCode(value)}
        className="border border-gray-700 rounded-lg overflow-hidden"
      />
      <div className="mt-4 flex items-center gap-4">
        <button 
          onClick={validateCode}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                     transition-colors duration-200 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:ring-offset-2"
        >
          Validate Code
        </button>
        {validationMessage && (
          <div className={`px-4 py-2 rounded-md ${
            validationMessage.includes('Error')
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-green-100 text-green-800 border border-green-200'
          }`}>
            {validationMessage}
          </div>
        )}
      </div>
    </div>
  );


}