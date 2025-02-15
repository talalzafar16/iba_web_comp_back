import { Controller } from '@nestjs/common';
//import { NotificationsService } from './notifications.service';
//import { EmailTransporter} from './classes/transporter.class';
//import { otpTemplate } from './templates/otp.template';
//import * as ejs from "ejs"

@Controller('notifications')
export class NotificationsController {
  //    constructor(private notificationService : NotificationsService){ }
  //
  //    @Get()
  //    async testingMail(){
  //
  //        return this.notificationService.sendMail({
  //            html: ejs.render(otpTemplate("usman", "39203")),
  //            subject:"Flint test",
  //            to:"usman.127.0.0.1@gmail.com",
  //            from:process.env.EMAIL
  //        }, new EmailTransporter().defaultTransporter)
  //    }
}
