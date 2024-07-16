// Example of supporting markdown text

// - Ave maria gratia plena
//   - Nesting list
// - Dominus tecum
// - Benedicta tu in mulieribus

// ---

// 1. Ave maria gratia plena
//    - Nested item
// 2. Dominus tecum
// 3. Benedicta tu in mulieribus

// ---

// https://naver.com

// ---

// [Google](https://naver.com)

// ---

// **Bold text**

// Pater noster, qui es in caelis. Sanctificetur nomen tuum. **Adveniat regnum tuum**. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie.

// ---

// *Italic text*

// Pater noster, qui es in caelis. Sanctificetur nomen tuum. *Adveniat regnum tuum*. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie.

// ---

// An inline code. When you use `try...catch...` keyword, you should handle error properly. Using `let` allows to reassign a value.

import MarkdownIt from "markdown-it";
import { Token } from "markdown-it/index.js";
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
  "text",
  "newline",
  // 'escape',
  "backticks",
  "strikethrough",
  "emphasis",
  "link",
  // 'image',
  // 'autolink',
  // 'html_inline',
  // 'entity'
]);

markdown.inline.ruler2.enableOnly([
  "balance_pairs",
  "strikethrough",
  "emphasis",
]);

// Custom plugin to add target="_blank" to links
const addTargetBlankToLinks = (md: MarkdownIt) => {
  const defaultRender =
    md.renderer.rules.link_open ||
    ((tokens, idx, options, env, self) => {
      return self.renderToken(tokens, idx, options);
    });

  md.renderer.rules.link_open = (
    tokens: Token[],
    idx: number,
    options: any,
    env: any,
    self: any
  ) => {
    const aIndex = tokens[idx].attrIndex("target");

    if (aIndex < 0) {
      tokens[idx].attrPush(["target", "_blank"]); // add new attribute
    } else {
      tokens[idx].attrs![aIndex][1] = "_blank"; // replace value of existing attr
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
  };
};

// Apply the plugin to the MarkdownIt instance
markdown.use(addTargetBlankToLinks);

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
