import * as nodemailer from 'nodemailer';
import config from '../../../configs';
import { MailSendingParams } from '../interfaces/mail-sending-params';
import logger from '../logger/log4js';

export const sendMail = async (data: MailSendingParams): Promise<void> => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                // type: 'OAuth2',
                // clientId: config.email.client_id,
                // clientSecret: config.email.client_secret,
                // refreshToken: config.email.refresh_token,
                // accessToken: config.email.access_token,
                user: config.email.mail_address,
                // expires: config.email.expires_in,
                pass: config.email.password,
            },
        });
        const mailOptions = {
            to: data.receiverEmail,
            from: config.email.mail_address,
            subject: data.subject,
            html: data.body,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        logger.error(`${error.message} ${error.stack}`);
        throw new Error('Internal Server Error');
    }
};
