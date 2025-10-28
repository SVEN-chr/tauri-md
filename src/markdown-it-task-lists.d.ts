/**
 * Type declarations for markdown-it-task-lists
 * This module provides GitHub Flavored Markdown task list support for markdown-it
 */

declare module 'markdown-it-task-lists' {
  import MarkdownIt from 'markdown-it';

  /**
   * Options for the task lists plugin
   */
  interface TaskListsOptions {
    /**
     * Enable task lists rendering
     * @default true
     */
    enabled?: boolean;

    /**
     * Wrap the rendered list items in a <label> element for UX purposes
     * @default false
     */
    label?: boolean;

    /**
     * Place the <label> after the checkbox
     * @default false
     */
    labelAfter?: boolean;
  }

  /**
   * markdown-it plugin for rendering GitHub-style task lists
   * 
   * @example
   * ```typescript
   * import MarkdownIt from 'markdown-it';
   * import taskLists from 'markdown-it-task-lists';
   * 
   * const md = new MarkdownIt().use(taskLists, {
   *   enabled: true,
   *   label: true,
   *   labelAfter: true
   * });
   * 
   * const result = md.render('- [ ] Unchecked\n- [x] Checked');
   * ```
   */
  function taskLists(md: MarkdownIt, options?: TaskListsOptions): void;

  export = taskLists;
}

