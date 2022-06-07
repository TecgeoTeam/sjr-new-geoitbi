const nodemailer = require("nodemailer");
var database = require('../helpers/database');
const ejs = require("ejs");

module.exports.SendMail = async function (data) {
    const pg = await database.connection();
    try {
        var server_data = await pg.query("SELECT * FROM public.t_servidor_email;");

        let transporter = nodemailer.createTransport({
            host: server_data.rows[0].hostname,
            port: server_data.rows[0].smtp_port,
            secure: true, 
            auth: {
                user: server_data.rows[0].email,
                pass: server_data.rows[0].host_password
            }
        });
        var tolist = [
            data.toemail
        ];

        let templatePath = server_data.rows[0].template_path+"/"+data.template;
        let temp = await ejs.renderFile(templatePath, { data:data.content, message:data.message, title:data.title });

        var mailOptions = {
            from: server_data.rows[0].send_email1,
            to: tolist,
            subject: data.subject,
            html: temp
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log('Email Err: '+ err);
            } else if (data) {
                console.log('Operação de Email realizada');
            }
        });
        console.log('Email enviado com sucesso');
        return 'E-mail enviado com sucesso!'

    } catch (err) {
        console.log(err);
        return err;
    }
}