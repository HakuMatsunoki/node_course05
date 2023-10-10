const nodemailer = require('nodemailer');
const path = require('path');
const pug = require('pug');
const { convert } = require('html-to-text');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  // #initTransport() - experimental JS private method feature
  _initTransport() {
    if (process.env.NODE_ENV === 'production') {
      // use MAILGUN, SENDGRID, etc..
      return nodemailer.createTransport({
        host: process.env.MAILGUN_HOST,
        port: process.env.MAILGUN_PORT,
        auth: {
          user: process.env.MAILGUN_USER,
          pass: process.env.MAILGUN_PASS,
        },
      });
    }

    // use MAILTRAP to test
    return nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async _send(template, subject) {
    const html = pug.renderFile(path.join(__dirname, '..', 'views', 'emails', `${template}.pug`), {
      name: this.name,
      url: this.url,
      subject,
    });

    const emailConfig = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this._initTransport().sendMail(emailConfig);
  }

  async sendHello() {
    await this._send('hello', 'Welcome email');
  }

  async sendRestorePassword() {
    await this._send('restorePassword', 'Password reset instruction.');
  }
}

module.exports = Email;

// https://github.com/leemunroe/responsive-html-email-template
// https://html2pug.vercel.app/
// https://mailtrap.io/ - service to test emails
// mailsac.com - temporary email box
