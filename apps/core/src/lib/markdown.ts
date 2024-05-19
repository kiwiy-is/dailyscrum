import MarkdownIt from "markdown-it";

export const markdown = new MarkdownIt("zero")
  .enable("list")
  .enable("linkify")
  .enable("link");

markdown.options.breaks = true;
markdown.options.linkify = true;
