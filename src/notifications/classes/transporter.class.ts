import {
  Transporter as NmTransporter,
  createTransport,
  TransportOptions,
} from 'nodemailer';

export class EmailTransporter {
  defaultTransporter: NmTransporter;
  email!: string;

  constructor() {
    this.defaultTransporter = this.createGmailTransporter();
  }

  private createGmailTransporter() {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    } as TransportOptions);

    this.email = process.env.EMAIL || 'flint.teams@gmail.com';

    return transporter;
  }
}
