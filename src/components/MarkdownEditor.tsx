import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
import MarkdownPreview from './MarkdownPreview';
import SourceEditor from './SourceEditor';
import Toolbar from './Toolbar';
import './MarkdownEditor.css';

export type ViewMode = 'preview' | 'source';

const MarkdownEditor = () => {
  const [content, setContent] = useState('# Welcome to Markdown Editor\n\nStart typing to see the live preview...\n\n## Features\n\n- **Bold** and *italic* text\n- Lists and checkboxes\n- Code blocks with syntax highlighting\n- Tables\n- And much more!\n\n```javascript\nconst hello = "world";\nconsole.log(hello);\n```\n');
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [isDirty, setIsDirty] = useState(false);

  // Handle content changes
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setIsDirty(true);
  }, []);

  // Create new file
  const handleNew = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Do you want to continue?');
      if (!confirmed) return;
    }
    setContent('');
    setCurrentFile(null);
    setIsDirty(false);
  }, [isDirty]);

  // Open file
  const handleOpen = useCallback(async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Markdown',
          extensions: ['md', 'markdown', 'txt']
        }]
      });

      if (selected && typeof selected === 'string') {
        const fileContent = await invoke<string>('read_file', { path: selected });
        setContent(fileContent);
        setCurrentFile(selected);
        setIsDirty(false);
      }
    } catch (error) {
      console.error('Error opening file:', error);
      alert('Failed to open file: ' + error);
    }
  }, []);

  // Save file
  const handleSave = useCallback(async () => {
    try {
      if (currentFile) {
        await invoke('write_file', { path: currentFile, content });
        setIsDirty(false);
      } else {
        await handleSaveAs();
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file: ' + error);
    }
  }, [currentFile, content]);

  // Save file as
  const handleSaveAs = useCallback(async () => {
    try {
      const selected = await save({
        filters: [{
          name: 'Markdown',
          extensions: ['md']
        }]
      });

      if (selected) {
        await invoke('write_file', { path: selected, content });
        setCurrentFile(selected);
        setIsDirty(false);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file: ' + error);
    }
  }, [content]);

  // Toggle view mode
  const handleToggleView = useCallback(() => {
    setViewMode(prev => prev === 'preview' ? 'source' : 'preview');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        handleOpen();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNew();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleToggleView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, handleOpen, handleNew, handleToggleView]);

  return (
    <div className="markdown-editor">
      <Toolbar
        onNew={handleNew}
        onOpen={handleOpen}
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        onToggleView={handleToggleView}
        viewMode={viewMode}
        currentFile={currentFile}
        isDirty={isDirty}
      />
      <div className="editor-container">
        {viewMode === 'preview' ? (
          <MarkdownPreview content={content} onChange={handleContentChange} />
        ) : (
          <SourceEditor content={content} onChange={handleContentChange} />
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;

