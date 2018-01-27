var nodemailer = require('nodemailer');

//HAS NOT BEEN TESTED W ENV VARIABLES, CHECK AFTER IMPLEMENTED!
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  }
});

/*
Sends email with parameters from our email
parameters: String receiverEmail: email of receiver,
	String subjectText: text for subject of email,
	String bodyText: text for body of email
*/
function sendEmail(receiverEmail, subjectText, bodyText, callback){
	var mailOptions = {
	  from: process.env.EMAIL_ADDRESS,
	  to: receiverEmail,
	  subject: subjectText,
	  html: bodyText
	};
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
	callback();
}

module.exports = { sendEmail };