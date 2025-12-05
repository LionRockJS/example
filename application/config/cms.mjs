import {Central} from "@lionrockjs/central";

const links = ["handle", "title", "url"];
links.links = links;

export default {
  landing: "",
  databaseMap: new Map([
    ['draft', 'postgres://postgres:postgres@localhost:5432/lionrockjs?options=-c%20search_path%3Ddraft'],
    ['live', 'postgres://postgres:postgres@localhost:5432/lionrockjs?options=-c%20search_path%3Dlive'],
    ['trash', 'postgres://postgres:postgres@localhost:5432/lionrockjs?options=-c%20search_path%3Dtrash'],
    ['tag', 'postgres://postgres:postgres@localhost:5432/lionrockjs?options=-c%20search_path%3Dtag'],
  ]),

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