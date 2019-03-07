import * as express from 'express';
import authService from './service';
import logger from '../../../core/logger/log4js';
import config from '../../../../configs';
import { addCreationAuditInfo, addModificationAuditInfo } from '../../../core/helpers';
import { sendMail } from '../../../core/helpers/send-mail';
import * as crypto from 'crypto';

const authRouter = express.Router();

authRouter.post('/login', async (req: any, res) => {
  try {
    const token = await authService.loginLocal(req.body);
    res.cookie(`token`, token, {
      domain: config.nextjs.cookieDomain,
      maxAge: req.body.rememberMe ? config.auth.expiresIn_7days * 1000 : config.auth.expiresIn_1day * 1000,
    })
      .status(200)
      .json({ token });
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send({ message: error.message } || { message: 'Email Or Password Is Not Correct' });
  }
});

authRouter.post('/register', async (req: any, res) => {
  try {
    const token = await authService.registerUser(addCreationAuditInfo(req, req.body));
    res.status(200).send({ token });
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
  }
});

authRouter.post('/resetpassword/:token', async (req, res) => {
  try {
    if (!req.params.token) {
      res.status(401).send(config.responseMessages.Unauthorized);
      return;
    }
    const email = await authService.resetPassword(req.params.token, req.body.password);

    await sendMail({
      receiverEmail: email,
      subject: 'Lumileds Password Reset',
      body: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + email + ' has just been changed.\n',
    });
    res.status(200).send({ message: 'Success! Your password has been changed.' });
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
  }
});

authRouter.post('/forgotpassword', async (req: any, res) => {
  try {
    const user = await authService.getUserDetail(req.body.email);
    if (!user) {
      throw new Error('No account with that email address exists.');
    }

    const token = crypto.randomBytes(5).toString('hex');
    user.resetPasswordToken = token;
    const date = new Date();
    date.setHours(date.getHours() + 1);
    user.resetPasswordExpires = date;
    await authService.updateUserToken((addModificationAuditInfo(req.query.profile, user) as any)._doc);
    await sendMail({
      receiverEmail: user.email,
      subject: 'Lumileds Password Reset',
      body: 'You are receiving this because you (or someone else) have requested the reset of the password for your account. <br/><br/>' +
        'Please copy the following code and paste it on the recovery field to complete the process:<br/><br/>' +
        // `web: ${config.nextjs.apiUrl}/auth/resetpassword/${token} <br/><br/>` +
        // `mobile: <button href="${config.deepLink.url}${token}">mobile</button> <br/><br/>` +
        `code: <b>${token}</b> <br/> <br/>` +
        `Above code will exprire after 1 hour <br/><br/>` +
        'If you did not request this, please ignore this email and your password will remain unchanged.<br/>',
    });
    res.status(200).send({ message: `An e-mail has been sent to ${user.email} with further instructions.` });
  } catch (error) {
    logger.error(`${error.message} ${error.stack}`);
    res.status(error.status || 500).send({ message: error.message } || config.responseMessages.Internal);
  }
});
export default authRouter;
