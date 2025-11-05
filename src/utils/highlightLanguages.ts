// lowlight 3.x 已经包含了 common 语言，不需要手动注册
// 如果需要额外的语言，可以在这里添加

export function registerLanguages() {
  // lowlight 3.x 使用 createLowlight(common) 已经包含了常用语言
  // 包括: javascript, typescript, python, java, c, cpp, csharp, go, rust,
  // php, ruby, swift, kotlin, bash, shell, sql, json, xml, yaml, markdown,
  // css, html 等

  // 如果需要注册额外的语言，可以这样做：
  // import { createLowlight } from 'lowlight'
  // import extraLang from 'highlight.js/lib/languages/extra-lang'
  // const lowlight = createLowlight()
  // lowlight.register('extra-lang', extraLang)

  console.log('代码高亮语言已加载（使用 lowlight common 语言集）')
}

