import MarkdownIt from "markdown-it";
// import { Ruler } from "markdown-it/index.js";
// import { RuleBlock } from "markdown-it/lib/parser_block.mjs";
// import { RuleCore } from "markdown-it/lib/parser_core.mjs";
// import { RuleInline, RuleInline2 } from "markdown-it/lib/parser_inline.mjs";

export const markdown = new MarkdownIt("zero", {
  breaks: true,
  linkify: true,
});

/**
 * Full list of available options:
 * - 'normalize'
 * - 'block'
 * - 'inline'
 * - 'linkify'
 * - 'replacements'
 * - 'smartquotes'
 * - 'text_join'
 *
 * For more information, see:
 * https://github.com/markdown-it/markdown-it/blob/master/lib/parser_core.mjs
 *
 */
markdown.core.ruler.enableOnly([
  "normalize",
  "block",
  "inline",
  "linkify",
  // 'replacements',
  // 'smartquotes',
  "text_join",
]);

/**
 * Full list of available options:
 * - 'table'
 * - 'code'
 * - 'fence'
 * - 'blockquote'
 * - 'hr'
 * - 'list'
 * - 'reference'
 * - 'html_block'
 * - 'heading'
 * - 'lheading'
 * - 'paragraph'
 *
 * For more information, see:
 * https://github.com/markdown-it/markdown-it/blob/master/lib/parser_block.mjs
 *
 */

markdown.block.ruler.enableOnly([
  // 'table',
  // 'code',
  // 'fence',
  // 'blockquote',
  // 'hr',
  "list",
  // 'reference',
  "html_block",
  // 'heading',
  // 'lheading',
  "paragraph",
]);

/**
 * Full list of available options:
 * - 'text'
 * - 'linkify'
 * - 'newline'
 * - 'escape'
 * - 'backticks'
 * - 'strikethrough'
 * - 'emphasis'
 * - 'link'
 * - 'image'
 * - 'autolink'
 * - 'html_inline'
 * - 'entity'
 *
 * For more information, see:
 * https://github.com/markdown-it/markdown-it/blob/master/lib/parser_inline.mjs
 *
 */
markdown.inline.ruler.enableOnly([
  // "text", "newline"
  "text",
  // 'linkify',
  "newline",
  // 'escape',
  // 'backticks',
  // 'strikethrough',
  // 'emphasis',
  // 'link',
  // 'image',
  // 'autolink',
  // 'html_inline',
  // 'entity'
]);

// NOTE: For debugging purposes

// /**
//  * Retrieves the names of all the rules in the given ruler.
//  *
//  * @param {Ruler<RuleCore | RuleBlock | RuleInline | RuleInline2>} ruler - The ruler object.
//  * @return {string[]} An array of rule names.
//  */
// const getRules = (
//   ruler: Ruler<RuleCore | RuleBlock | RuleInline | RuleInline2>
// ) => ruler.getRules("").map((rule) => rule.name);

// // Create an object to store the configuration
// const presetConfig = {
//   components: {
//     core: {
//       rules: getRules(markdown.core.ruler),
//     },
//     block: {
//       rules: getRules(markdown.block.ruler),
//     },
//     inline: {
//       rules: getRules(markdown.inline.ruler),
//       rules2: getRules(markdown.inline.ruler2),
//     },
//   },
// };

// // Console log the configuration
// console.log(JSON.stringify(presetConfig, null, 2));
