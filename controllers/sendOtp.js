const nodemailer = require('nodemailer');
var otpGenerator = require("otp-generator")

let otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: 
false,lowerCaseAlphabets: false });

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure:false,
    auth: {
        user: 'adityagauraa@gmail.com', // Your Gmail email address
        pass: 'dvww ecsx bcjb tqxw' // Your Gmail password
    }
});

// Function to send OTP email
function sendOTP(email) {
    return new Promise((resolve, reject) => {
        // Email content
        let mailOptions = {
            from: 'adityagauraa@gmail.com',
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
