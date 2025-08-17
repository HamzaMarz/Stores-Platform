const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // upgrade later with STARTTLS
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});
module.exports = async (email , title , html) => {
    try{
        const mailOption = {
            from:`Stores' Platform <${process.env.EMAIL}>`,
            to: email,
            bcc: "",
            subject: title,
            text: "message",
            html: html,
            headers: {
                "List-Unsubscribe": "",
                // "https://example.com/unsubscribe/" + email,
                "List-Help":
                    "mailto:clinttemoclint@gmail.com?subject=help",
            },
        };
        await transporter.sendMail(mailOption)
        return true;
    }catch (e){
        console.error(e);
        return false;
    }
}