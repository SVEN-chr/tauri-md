# Markdown Editor - Usage Guide

## Quick Start

1. **Launch the Application**
   ```bash
   npm run tauri dev
   ```

2. **Start Editing**
   - The editor opens with a welcome message in Live Preview mode
   - Start typing to see your markdown rendered in real-time
   - Click on any text to edit it directly in the preview

## Editing Modes

### Live Preview Mode (Default)
- **WYSIWYG editing**: Edit markdown content directly in the rendered preview
- Click on any element to edit it
- Formatting is applied automatically as you type
- Perfect for focused writing without distractions

### Source Code Mode
- **Raw markdown editing**: Edit the markdown source code directly
- Full syntax highlighting for markdown
- Line numbers and code folding
- Ideal for precise control over markdown syntax
- Toggle with the "Source" button or press `Ctrl+E`

## File Operations

### Creating a New File
1. Click the **New** button in the toolbar (or press `Ctrl+N`)
2. If you have unsaved changes, you'll be prompted to confirm
3. The editor clears and you can start writing

### Opening a File
1. Click the **Open** button (or press `Ctrl+O`)
2. Select a markdown file (.md, .markdown, or .txt)
3. The file content loads into the editor

### Saving a File
1. Click the **Save** button (or press `Ctrl+S`)
2. If it's a new file, you'll be prompted to choose a location
3. The file is saved and the dirty indicator (•) disappears

### Save As
1. Click the **Save As** button
2. Choose a new location and filename
3. The file is saved with the new name

## Markdown Syntax Examples

### Headings
```markdown
# Heading 1
## Heading 2
### Heading 3
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~
`Inline code`
```

### Lists
```markdown
- Unordered list item 1
- Unordered list item 2
  - Nested item

1. Ordered list item 1
2. Ordered list item 2
```

### Task Lists (GitHub Flavored Markdown)
```markdown
- [ ] Unchecked task
- [x] Checked task
- [ ] Another unchecked task
  - [x] Nested checked task
```

### Links and Images
```markdown
[Link text](https://example.com)
![Image alt text](image-url.jpg)
```

### Code Blocks
````markdown
```javascript
const hello = "world";
console.log(hello);
```
````

### Tables
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

### Blockquotes
```markdown
> This is a blockquote
> It can span multiple lines
```

### Horizontal Rule
```markdown
---
```

## Tips and Tricks

1. **Keyboard Shortcuts**: Use keyboard shortcuts for faster workflow
   - `Ctrl+N`: New file
   - `Ctrl+O`: Open file
   - `Ctrl+S`: Save file
   - `Ctrl+E`: Toggle view mode

2. **Unsaved Changes**: The editor shows a dot (•) next to the filename when you have unsaved changes

3. **Dark Mode**: The editor automatically adapts to your system's dark mode preference

4. **Code Highlighting**: Code blocks automatically detect the language and apply syntax highlighting

5. **Live Preview Editing**: In preview mode, you can edit text directly by clicking on it. The markdown source is automatically updated.

## Troubleshooting

### Application won't start
- Ensure Node.js and Rust are installed
- Run `npm install` to install dependencies
- Check that ports 1420 is available

### File operations not working
- Check file permissions
- Ensure you have write access to the target directory
- Try running the application with appropriate permissions

### Rendering issues
- Try toggling between Preview and Source modes
- Refresh the view by switching modes twice
- Check the browser console for errors (F12 in dev mode)

## Building for Production

To create a distributable application:

```bash
npm run tauri build
```

The built application will be in `src-tauri/target/release/bundle/`

## Next Steps

- Explore the markdown syntax
- Try different formatting options
- Experiment with code blocks and syntax highlighting
- Create your own markdown documents

Enjoy writing with Markdown Editor! 📝

