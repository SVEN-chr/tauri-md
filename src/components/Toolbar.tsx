import { ViewMode } from './MarkdownEditor';
import './Toolbar.css';

interface ToolbarProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onToggleView: () => void;
  viewMode: ViewMode;
  currentFile: string | null;
  isDirty: boolean;
}

const Toolbar = ({
  onNew,
  onOpen,
  onSave,
  onSaveAs,
  onToggleView,
  viewMode,
  currentFile,
  isDirty
}: ToolbarProps) => {
  const getFileName = () => {
    if (!currentFile) return 'Untitled';
    const parts = currentFile.split(/[\\/]/);
    return parts[parts.length - 1];
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button onClick={onNew} className="toolbar-btn" title="New (Ctrl+N)">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          New
        </button>
        <button onClick={onOpen} className="toolbar-btn" title="Open (Ctrl+O)">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
          </svg>
          Open
        </button>
        <button onClick={onSave} className="toolbar-btn" title="Save (Ctrl+S)">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 2-2H14V2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1z"/>
          </svg>
          Save
        </button>
        <button onClick={onSaveAs} className="toolbar-btn" title="Save As">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v4.5h2a.5.5 0 0 1 .354.854l-2.5 2.5a.5.5 0 0 1-.708 0l-2.5-2.5A.5.5 0 0 1 5.5 6.5h2V2a2 2 0 0 2-2H14V2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1z"/>
          </svg>
          Save As
        </button>
        <div className="toolbar-divider"></div>
        <button 
          onClick={onToggleView} 
          className={`toolbar-btn ${viewMode === 'source' ? 'active' : ''}`}
          title="Toggle View (Ctrl+E)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
          </svg>
          {viewMode === 'preview' ? 'Source' : 'Preview'}
        </button>
      </div>
      <div className="toolbar-center">
        <span className="file-name">
          {getFileName()}
          {isDirty && ' •'}
        </span>
      </div>
      <div className="toolbar-right">
        <span className="view-mode-indicator">
          {viewMode === 'preview' ? '👁️ Live Preview' : '📝 Source Code'}
        </span>
      </div>
    </div>
  );
};

export default Toolbar;

