import {Central} from "@lionrockjs/central";

const links = ["handle", "title", "url"];
links.links = links;

export default {
  databasePath: `${Central.APP_PATH}/../database`,
  defaultLanguage: 'en',
  blueprint: {
    default: ['@date', 'name', 'body', 'link', {items: ["name"]}],
    menu:['@date', '@handle', 'name', {links}],
  },

  blocks: {
    default: ['@date', 'name', 'body', 'link', {items: ["name"]}],
    logos : ['label', {pictures:["url"]}],
    paragraphs:["subject", "body", "picture", "caption", "description"],
  },

  pageTypeSlugs: {
    default: ['pages', 'articles', 'posts']
  },

  inputs: {
    body: "textarea",
    name: "text",
    link: "link",
    picture: "picture",
    video: "video",
    subject: "text",
    caption: "text",
    handle: "text",
    title: "text",
    description: "textarea",
    date: "date",
    file: "file",
  },
};