require('dotenv').config();
const nodemailer = require('nodemailer');
var otpGenerator = require("otp-generator")

let otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: 
false,lowerCaseAlphabets: false });

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure:false,
    auth: {
        user: process.env.SMTP_MAIL, // Your Gmail email address
        pass: process.env.SMTP_PASSWORD // Your Gmail password
    }
});

// Function to send OTP email
function sendOTP(email) {
    return new Promise((resolve, reject) => {
        // Email content
        let mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: 'OTP for Password Reset from GitHawk',
            text: `Your OTP for password reset is: ${otp}`
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred while sending email:', error);
                reject(error); // Reject the promise if there's an error
            } else {
                console.log('Email sent:', info.response);
                resolve(otp); // Resolve the promise with the OTP value
            }
        });
    });
}


module.exports.sendOtp = sendOTP;
