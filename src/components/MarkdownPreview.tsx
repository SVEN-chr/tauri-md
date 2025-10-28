import { useEffect, useRef } from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import './MarkdownPreview.css';

interface MarkdownPreviewProps {
  content: string;
  onChange: (content: string) => void;
}

const MarkdownPreview = ({ content, onChange }: MarkdownPreviewProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Initialize markdown-it with syntax highlighting
  const md = useRef(
    new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
          } catch (__) {}
        }
        return `<pre class="hljs"><code>${md.current.utils.escapeHtml(str)}</code></pre>`;
      }
    })
  ).current;

  // Update preview when content changes
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      const html = md.render(content);
      editorRef.current.innerHTML = html;
    }
  }, [content, md]);

  // Handle input events for live editing
  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      const newContent = extractMarkdownFromHtml(editorRef.current);
      onChange(newContent);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  };

  // Extract markdown from edited HTML (simplified version)
  const extractMarkdownFromHtml = (element: HTMLElement): string => {
    let markdown = '';
    
    const processNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();
        const children = Array.from(el.childNodes).map(processNode).join('');
        
        switch (tagName) {
          case 'h1':
            return `# ${children}\n\n`;
          case 'h2':
            return `## ${children}\n\n`;
          case 'h3':
            return `### ${children}\n\n`;
          case 'h4':
            return `#### ${children}\n\n`;
          case 'h5':
            return `##### ${children}\n\n`;
          case 'h6':
            return `###### ${children}\n\n`;
          case 'p':
            return `${children}\n\n`;
          case 'strong':
          case 'b':
            return `**${children}**`;
          case 'em':
          case 'i':
            return `*${children}*`;
          case 'code':
            if (el.parentElement?.tagName.toLowerCase() === 'pre') {
              return children;
            }
            return `\`${children}\``;
          case 'pre':
            const codeEl = el.querySelector('code');
            if (codeEl) {
              const lang = Array.from(codeEl.classList)
                .find(c => c.startsWith('language-'))
                ?.replace('language-', '') || '';
              return `\`\`\`${lang}\n${codeEl.textContent}\n\`\`\`\n\n`;
            }
            return `\`\`\`\n${children}\n\`\`\`\n\n`;
          case 'ul':
            return children + '\n';
          case 'ol':
            return children + '\n';
          case 'li':
            const parent = el.parentElement;
            if (parent?.tagName.toLowerCase() === 'ol') {
              const index = Array.from(parent.children).indexOf(el) + 1;
              return `${index}. ${children}\n`;
            }
            return `- ${children}\n`;
          case 'blockquote':
            return children.split('\n').map(line => `> ${line}`).join('\n') + '\n\n';
          case 'a':
            const href = el.getAttribute('href') || '';
            return `[${children}](${href})`;
          case 'img':
            const src = el.getAttribute('src') || '';
            const alt = el.getAttribute('alt') || '';
            return `![${alt}](${src})`;
          case 'hr':
            return '---\n\n';
          case 'br':
            return '\n';
          case 'table':
          case 'thead':
          case 'tbody':
          case 'tr':
          case 'th':
          case 'td':
            // Simplified table handling - just preserve content
            return children;
          default:
            return children;
        }
      }
      
      return '';
    };
    
    markdown = Array.from(element.childNodes).map(processNode).join('');
    return markdown.trim();
  };

  return (
    <div
      ref={editorRef}
      className="markdown-preview"
      contentEditable
      onInput={handleInput}
      suppressContentEditableWarning
      spellCheck={false}
    />
  );
};

export default MarkdownPreview;

