import {Central} from '@lionrockjs/central';

function getAdmin(){
  return process.env.EMAIL_ADMIN;
}

function getBCC(){
  return process.env.EMAIL_BCC;
}

const templatePath = Central.EXE_PATH + '/../public/media/edm'

export default {
  mail: {
    admin: getAdmin(),
    bcc: getBCC(),
    sender: process.env.EMAIL_SENDER,
    templatePath,

    rsvp:{
      sender: process.env.EMAIL_SENDER,
      subject: new Map([
        ['en', "RSVP Confirmation"],
        ['zh-hans', 'RSVP 确认'],
        ['zh-hant', 'RSVP 確認']
      ]),
      text: new Map([
        ['en', 'en/rsvp.txt'],
        ['zh-hans', 'zh-hans/rsvp.txt'],
        ['zh-hant', 'zh-hant/rsvp.txt']
      ]),
      html: new Map([
        ['en', 'en/rsvp.html'],
        ['zh-hans', 'zh-hans/rsvp.html'],
        ['zh-hant', 'zh-hant/rsvp.html']
      ]),
      attachments:new Map([
        ['en', []],
        ['zh-hans', []],
        ['zh-hant', []],
      ]),
    },
  },
}