//@ts-nocheck
import { Exclude } from 'class-transformer';

export class UserResponseDto {
    user: {
        id: number;
        name: string;
        email: string;
        created_at: Date;
    }
    token: string;

    @Exclude()
    password: string;

    constructor(obj: any) {
        console.log(obj)
        this.user = {
            id: obj.user._id.toString(),
            name: obj.user.name,
            email: obj.user.email,
            created_at: obj.user.created_at
        }
        this.token = obj.token;
    }
}
