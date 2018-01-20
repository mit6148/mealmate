var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'LIU CUBED EMAIL HERE',
    pass: 'LIU CUBED PASSWORD HERE',
  }
});

/*
Sends email with parameters from our email
parameters: String receiverEmail: email of receiver,
	String subjectText: text for subject of email,
	String bodyText: text for body of email
*/
function sendEmail(receiverEmail, subjectText, bodyText){
	var mailOptions = {
	  from: 'LIU CUBED EMAIL HERE',
	  to: receiverEmail,
	  subject: subjectText,
	  text: bodyText
	};
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
}