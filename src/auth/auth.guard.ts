import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserPayload } from './interfaces/user_payload.interface';
import { Reflector } from '@nestjs/core';
import { SECURITY_LEVEL_KEY, SecurityLevel } from './security.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const security_level = this.reflector.getAllAndOverride<SecurityLevel>(SECURITY_LEVEL_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);


        const token = this.extractTokenFromHeader(request);
        console.log(request.headers)

        if (security_level === SecurityLevel.LOW) {
            if (token) {
                const payload: UserPayload = await this.jwtService.verifyAsync(token, {
                    secret: process.env.JWT_SECRET,
                });
                request['user'] = payload;
            }
            return true
        }

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload: UserPayload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            request['user'] = payload;
        } catch (e) {
            throw new UnauthorizedException(e);
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
