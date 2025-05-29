'use client';

import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
//@ts-expect-error this error can't be fixed
import Embed from '@editorjs/embed';
import type { OutputData } from '@editorjs/editorjs';

interface EditorProps {
  onChange: (data: OutputData) => void;
  hasError?: boolean;
}

const Editor = ({ onChange, hasError }: EditorProps) => {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    const initEditor = async () => {
      if (!editorRef.current) {
        const editor = new EditorJS({
          holder: 'editorjs',
          tools: {
            header: Header,
            list: List,
            embed: Embed,
          },
          placeholder: 'Write your product description here...',
          async onChange(api) {
            const data = await api.saver.save();
            onChange(data);
          },
        });
        editorRef.current = editor;
      }
    };

    initEditor();

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
        } catch (error) {
          console.error('Error destroying editor:', error);
        }
        editorRef.current = null;
      }
    };
  }, [onChange]);

  return (
    <div
      id="editorjs"
      className={`bg-white p-4 border rounded ${
        hasError ? 'border-red-500' : ''
      }`}
    />
  );
};

export default Editor; 