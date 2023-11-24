var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
require('dotenv').config();
app.use(cors('*'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var nm = require('nodemailer');
let savedOTPS = {

};

var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
    host: process.env.REACT_APP_HOST,
    port: 465,
    secure: true,
  service: "Gmail",
  auth: {
    type: "OAuth2",
      user: process.env.REACT_APP_USER, // Your gmail address.
                                            // Not @developer.gserviceaccount.com
      clientId: process.env.REACT_APP_CLIENTID,
      clientSecret: process.env.REACT_APP_CLIENTSECRET,
      refreshToken: process.env.REACT_APP_REFRESHTOKEN
  }
});


// smtpTransport.sendMail(mailOptions, function(error, response) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(response);
//   }
//   smtpTransport.close();
// });


app.post('/sendotp', (req, res) => {
    let email = req.body.email;
    let digits = '0123456789';
    let limit = 4;
    let otp = ''
    for (i = 0; i < limit; i++) {
        otp += digits[Math.floor(Math.random() * 10)];

    }

    var mailOptions = {
        from: process.env.REACT_APP_FROM,
        to: `${email}`,
        subject: "Prevmedsol Email verification",
        generateTextFromHTML: true,
        html: `<b>Hello user, Please use this otp ${otp} for verification</b>`
      };

    smtpTransport.sendMail(mailOptions, function(error, response) {
            if (error) {
                console.log(error);
                // response.send("couldn't send")
            }
            else {
                savedOTPS[email] = otp;
                setTimeout(
                    () => {
                        delete savedOTPS.email
                    }, 60000
                )
                console.log(response);
                return res.json(response)
            }
            smtpTransport.close();
        }
    )
})

app.post('/verify', (req, res) => {
    let otprecived = req.body.otp;
    let email = req.body.email;
    if (savedOTPS[email] == otprecived) {
        res.send("Verfied");
    }
    else {
        res.status(500).send("Invalid OTP")
    }
})


app.listen(4000, () => {
    console.log("started")
})


// AIzaSyCWeGjHBTXWmkoyV7cpUtv2ozbpm6vr2iM  {key=API_KEY}