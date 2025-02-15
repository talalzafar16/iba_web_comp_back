import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dtos/requestDtos/signup.dto';
import { comparePassword, hashPassword } from 'src/utils/data.encryption';
import { UserResponseDto } from './dtos/responseDtos/userResponse.dto';
import { GetOtpResponseDto } from './dtos/responseDtos/getOtpResponse.dto';
import { generateOTP } from 'src/utils/otp.generator';
import { NotificationsService } from 'src/notifications/notifications.service';
import { EmailTransporter } from 'src/notifications/classes/transporter.class';
import { SendMailOptions } from 'nodemailer';
import * as ejs from 'ejs';
import {
    forget_password_otp_template,
    otpTemplate,
} from 'src/notifications/templates/otp.template';
import { SignUpResponseDto } from './dtos/responseDtos/signupResponse.dto';
import { VerifyEmailByOtpResponse } from './dtos/responseDtos/verifyOtpResponse.dto';
import { EmailVerificationStatus, OtpStatus } from './auth.enums';
import { SuccessResDto } from 'src/commons/dtos/response_dtos/success.dto';
import { UserPayload } from './interfaces/user_payload.interface';
import { UserService } from 'src/user/user.service';
import { ResetPasswordPayload } from './types/reset_password.types';
import { RedisConnector } from 'src/database/redisConnector.database';

@Injectable()
export class AuthService {
    constructor(
        private user_service: UserService,
        private jwtService: JwtService,
        private notificationService: NotificationsService,
    ) { }

    async userSignUp(signUpDto: CreateUserDto): Promise<SignUpResponseDto> {
        try {
            const isEmailAvailable = (await this.user_service.get_one_user_by_email(
                signUpDto.email,
            ))
                ? false
                : true;

            if (!isEmailAvailable) {
                throw new BadRequestException('User with this email already exists.');
            }

            signUpDto.password = await hashPassword(signUpDto.password);

            const user = await this.user_service.create(signUpDto);

            if (!user) {
                throw new BadRequestException(['Could not create user!']);
            }

            const payload: UserPayload = {
                id: user._id.toString(),
                email: user.email,
                is_email_verified: user.is_email_verified
            };
            const token = await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET
            });

            const otp_res = await this.authenticateByOtp(user.email);
            const userRes = new UserResponseDto({ token, user });

            return new SignUpResponseDto({ user: userRes, otp_res });
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException(e);
        }
    }

    async userSignIn(email: string, pass: string): Promise<UserResponseDto> {
        try {
            const user = await this.user_service.get_one_user_by_email(email);

            if (!user) {
                throw new BadRequestException('Incorrect email or password');
            }

            const isPasswordValid = await comparePassword(pass, user.password);

            if (!isPasswordValid) {
                throw new BadRequestException('Incorrect email or password');
            }

            const payload: UserPayload = {
                id: user._id.toString(),
                email: user.email,
                is_email_verified: user.is_email_verified
            };

            const token = await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET,
            });

            return new UserResponseDto({ token, user });
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async authenticateByOtp(
        email: string,
        name?: string,
        expires_in: number = 600,
    ): Promise<GetOtpResponseDto> {
        try {
            const user = await this.user_service.get_one_user_by_email(email);
            if (!user) {
                throw new BadRequestException('User does not exist with this email.');
            }

            if (user.is_email_verified === true) {
                throw new BadRequestException('User is already verified!');
            }

            const otp = generateOTP();
            const redis = new RedisConnector().connect();
            const created_at = new Date();

            await redis.hset(email + '_otp', { otp, created_at });
            await redis.expire(email + '_otp', expires_in);

            const transporter = new EmailTransporter();
            const options: SendMailOptions = {
                from: transporter.email,
                to: email,
                subject: 'CineVerse: Verify you account',
                html: ejs.render(otpTemplate(name || 'User', otp, expires_in)),
            };
            await this.notificationService.sendMail(
                options,
                transporter.defaultTransporter,
            );
            return new GetOtpResponseDto({ email, expires_in, created_at });
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async forget_password(
        email: string,
        name?: string,
        expires_in: number = 600,
    ): Promise<GetOtpResponseDto> {
        try {
            const user = await this.user_service.get_one_user_by_email(email);
            if (!user) {
                throw new BadRequestException('User does not exist with this email.');
            }

            const otp = generateOTP();
            const redis = new RedisConnector().connect();
            const created_at = new Date();

            await redis.hset(email + '_otp', { otp, created_at });
            await redis.expire(email + '_otp', expires_in);

            const transporter = new EmailTransporter();
            const options: SendMailOptions = {
                from: transporter.email,
                to: email,
                subject: 'Cine Verse: Verify you account',
                html: ejs.render(
                    forget_password_otp_template(name || 'User', otp, expires_in),
                ),
            };
            await this.notificationService.sendMail(
                options,
                transporter.defaultTransporter,
            );
            return new GetOtpResponseDto({ email, expires_in, created_at });
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async verifyOtp(email: string, otp: string): Promise<OtpStatus> {
        try {
            const redis = new RedisConnector().connect();
            const otpData = await redis.hgetall(email + '_otp');

            if (!otpData) {
                return OtpStatus.EXPIRED;
            }
            if (otpData?.otp?.toString() === otp) {
                return OtpStatus.CORRECT;
            }
            return OtpStatus.WRONG;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async verifyEmailByOtp(
        email: string,
        otp: string,
    ): Promise<VerifyEmailByOtpResponse> {
        const res: OtpStatus = await this.verifyOtp(email, otp);

        switch (res) {
            case OtpStatus.WRONG:
                return new VerifyEmailByOtpResponse({
                    status: EmailVerificationStatus.UNVERIFIED,
                    email,
                    verified: false,
                    message: 'Wrong OTP.',
                });
            case OtpStatus.EXPIRED:
                return new VerifyEmailByOtpResponse({
                    status: EmailVerificationStatus.UNVERIFIED,
                    email,
                    verified: false,
                    message: 'OTP expired.',
                });
            case OtpStatus.CORRECT:
                const reset_password_payload: ResetPasswordPayload = {
                    allow_reset: true,
                    email,
                    time: new Date(),
                };
                const reset_password_token = await this.jwtService.signAsync(
                    reset_password_payload,
                    {
                        expiresIn: '3600s',
                        secret: process.env.JWT_SECRET,
                    },
                );
                await this.user_service.update_one_by_email(email, {
                    is_email_verified: true,
                });
                return new VerifyEmailByOtpResponse({
                    status: EmailVerificationStatus.VERIFIED,
                    email,
                    verified: true,
                    message: 'OTP verified.',
                    reset_password_token,
                });
        }
    }

    async reset_password(
        email: string,
        password: string,
        confirm_password: string,
        reset_password_token: string,
    ): Promise<SuccessResDto> {
        try {
            if (!reset_password_token)
                throw new UnauthorizedException('not Authorized');

            const user_password_payload: ResetPasswordPayload =
                await this.jwtService.verifyAsync(reset_password_token, {
                    secret: process.env.JWT_SECRET,
                });

            if (
                user_password_payload.email !== email ||
                !user_password_payload.allow_reset
            ) {
                throw new UnauthorizedException('Not authorized to change password');
            }

            if (password !== confirm_password)
                throw new BadRequestException('passwords dont match');

            const hashed_password = await hashPassword(password);
            this.user_service.update_one_by_email(email, {
                password: hashed_password,
            });

            return new SuccessResDto({ success: true, message: 'Password updated' });
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
