import {Central} from "@lionrockjs/central";

export default {
  databasePath: `${Central.APP_PATH}/../database`,
  defaultLanguage: 'en',
  blueprint: {
    default: ['@date', 'name', 'body', 'link__label', 'link__url', {items: ["name"]}],
    vcard:["@picture", "name", "company", "title", "@email", "@mobile", "@work_phone", "address", "@zip", "region", "url", "note", {tel:["@type", "@number"]}, {sns:["provider","url"]}],
  },

  blocks: {
    default: ['@date', 'name', 'body', 'link__label', 'link__url', {items: ["name"]}],
    logos : ['label', {pictures:["url"]}],
    paragraphs:["subject", "body", "picture", "caption", "description"],
    label: ["subject"],
    facts : ['title', "subject", {items:["@picture", "title", "subject"]}],
    text_list: ["title", {items: ["name"]}],
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
    description: "richtext",
    date: "date",
    file: "file",
    note: "richtext",
    address: "textarea",
  },

  blockLists: {
    default: Central.config.cms.blockLists.default,
    vcard:['label'],
  },
  tagLists: {
    default: Central.config.cms.tagLists.default,
    vcard:['years'],
  },
};