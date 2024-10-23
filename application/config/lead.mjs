import {FormCaptchaAdapterRecaptcha} from '@lionrockjs/adapter-form-captcha-recaptcha';
import {MailAdapterAWS} from '@lionrockjs/adapter-mail-aws';
export default{
  captchaAdapter: FormCaptchaAdapterRecaptcha,
  mailAdapter: MailAdapterAWS
}