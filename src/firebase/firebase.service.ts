import { Injectable } from '@nestjs/common'
import * as admin from "firebase-admin"
const path = require("path")

@Injectable()
export class FirebaseService {
    private bucket;
    constructor() {
        if (!admin.apps.length) {
            console.log(path?.join(__dirname,".." , ".." , "service_account.json"))
            const serviceAccount = require(path?.join(__dirname,".." , ".." , "service_account.json"));
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: 'timer-c5c18.appspot.com',
            });
        }
        this.bucket = admin.storage().bucket();
    }

    async uploadFile(file: Express.Multer.File, path : string): Promise<string> {
        const fileUpload = this.bucket.file(path);

        await fileUpload.save(file.buffer, {
            metadata: { contentType: file.mimetype },
        });

        const [url] = await fileUpload.getSignedUrl({
            action: 'read',
            expires: '03-01-2030',
        });

        return url;
    }

}
