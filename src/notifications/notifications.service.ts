import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  async sendMail(
    emailOptions: nodemailer.SendMailOptions,
    transporter: nodemailer.Transporter,
  ) {
    await transporter.sendMail(emailOptions);
  }
}
