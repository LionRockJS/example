import path from 'node:path';
import {Central, ORM} from '@lionrockjs/central';
import {Mail} from '@lionrockjs/mod-mail';
import {MailAdapterAWS} from '@lionrockjs/adapter-mail-aws';

export default class HelperRSVP {
  constructor(leadDB, mailDB, clientIP, landing) {
    this.leadDB = leadDB;
    this.helperMail = new Mail({
      database: mailDB,
      adapter : MailAdapterAWS,
      templateFolder : path.normalize(Central.config.edm.mail.templatePath)
    });
    this.clientIP = clientIP;
    this.landing = landing;
  }

  async sendReminder(instance, config){
    const language = instance.language;
    const userEmail = instance.email;
    const sender  = config.mail.reminder.sender;
    const subject = config.mail.reminder.subject.get(language);
    const text    = config.mail.reminder.text.get(language);
    const html    = config.mail.reminder.html.get(language);

    const tokens = Object.assign(
      {
        domain: this.landing,
        language: language,
      },
      instance,
      {
        email: userEmail.replaceAll('.', '<span>.</span>'),
      });

    await this.helperMail.send(subject, text, sender, userEmail, {
      bcc: config.mail.bcc,
      html,
      tokens
    });
  }

  async sendRSVP(instance, config){
    const language = instance.language;
    const userEmail = (instance.contact_type === 'email') ? instance.contact : instance.email;
    const sender  = config.mail.rsvp.sender;
    const subject = config.mail.rsvp.subject.get(language);
    const text    = config.mail.rsvp.text.get(language);
    const html    = config.mail.rsvp.html.get(language);
    const attachments = config.mail.rsvp.attachments.get(language);

    const tokens = Object.assign(
      {
        domain: this.landing,
        language: language,
      },
      instance,
      {
        email: userEmail.replaceAll('.', '<span>.</span>'),
      });

    await this.helperMail.send(subject, text, sender, userEmail, {
      bcc: config.mail.bcc,
      html,
      tokens,
      attachments
    });
  }
}