'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { OutputData } from '@editorjs/editorjs';

interface ClientEditorProps {
  onChange: (data: OutputData) => void;
  hasError?: boolean;
}

const EditorComponent = ({ onChange, hasError }: ClientEditorProps) => {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  
  // Update the ref when onChange changes to avoid re-initialization
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Memoize the handleChange function to prevent recreating it on each render
  const handleEditorChange = useCallback(async (api: any) => {
    const data = await api.saver.save();
    onChangeRef.current(data);
  }, []);

  // Initialize the editor only once and clean up properly
  useEffect(() => {
    let editor: any = null;
    
    const initEditor = async () => {
      if (!containerRef.current) return;
      
      try {
        // Clean up any existing editor instance first
        if (editorRef.current) {
          try {
            await editorRef.current.destroy();
            editorRef.current = null;
          } catch (e) {
            console.error('Error destroying previous editor:', e);
          }
        }
        
        const EditorJS = (await import('@editorjs/editorjs')).default;
        const Header = (await import('@editorjs/header')).default;
        const List = (await import('@editorjs/list')).default;

        editor = new EditorJS({
          holder: containerRef.current,
          tools: {
            header: Header,
            list: List,
          },
          placeholder: 'Write your product description here...',
          onChange: handleEditorChange,
          onReady: () => {
            console.log('Editor.js is ready to work!');
          },
        });

        editorRef.current = editor;
      } catch (error) {
        console.error('Error initializing editor:', error);
      }
    };

    const timeoutId = setTimeout(() => {
      initEditor();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      
      // Proper cleanup
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
        } catch (error) {
          console.error('Error destroying editor:', error);
        }
      }
    };
  }, []); // No dependencies to prevent re-initialization

  return (
    <div
      ref={containerRef}
      className={`bg-white p-4 border rounded ${hasError ? 'border-red-500' : ''}`}
    />
  );
};

export default EditorComponent; 