import {Central} from "@lionrockjs/central";

export default {
  databasePath: `${Central.APP_PATH}/../database`,
  defaultLanguage: 'en',
  blueprint: {
    default: ['@date', 'name', 'body', 'link__label', 'link__url', {items: ["name"]}],
  },

  blocks: {
    default: ['@date', 'name', 'body', 'link__label', 'link__url', {items: ["name"]}],
    logos : ['label', {pictures:["url"]}],
    paragraphs:["subject", "body", "picture", "caption", "description"],
    label: ["subject"],
  },

  pageTypeSlugs: {
    default: ['pages', 'articles', 'posts']
  },

  inputs: {
    body: "richtext",
    name: "text",
    link: "link",
    picture: "picture",
    video: "video",
    subject: "text",
    caption: "text",
    handle: "text",
    title: "text",
    description: "richtext",
    date: "date",
    file: "file",
    note: "richtext",
    address: "textarea",
  },
};