import NodeMailer from '../config/nodemailer.config.js';
class MailService{

   async sendMail(to, subject, body){

        try{
           await NodeMailer.send({
                to: to,
                subject: subject,
                body: body
            });
            return true;

        }
        catch(err){
            throw new Error('Failed to send email');
        }
    }
}

export default new MailService();