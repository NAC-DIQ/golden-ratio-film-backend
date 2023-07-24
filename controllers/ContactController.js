const nodemailer = require('nodemailer');

const add = async (req, res) => {
  // get my user id
  const { type, name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    let subject = 'Contact Form Submission | Golden Ratio Films';
    let to = 'admin@grfilms.in';
    switch (type) {
      case 1:
      case '1':
        subject =
          'Contact Form Submission | Golden Ratio Films - Sales and Distribution Enquiry';
        to = 'jaymin@vistasmediacapital.com';
        break;
      case 2:
      case '2':
        subject =
          'Contact Form Submission | Golden Ratio Films - Marketing Enquiry';
        to = 'kv@vistasmediacapital.com';
        break;
      case 3:
      case '3':
        subject = 'Contact Form Submission | Golden Ratio Films - Pitch';
        to = ' kumud@grfilms.in';
        break;
      case 4:
      case '4':
        subject = 'Contact Form Submission | Golden Ratio Films - Work with Us';
        to = 'career@grfilms.in';
        break;

      default:
        subject = 'Contact Form Submission | Golden Ratio Films';
        to = 'admin@grfilms.in';
        break;
    }

    const mailOptions = {
      from: '"No Reply GRF" <noreply@grf.com>',
      to,
      subject,
      html: ` <b> Name </b> : ${name} <br>
        <b> Email </b> : ${email} <br>
        <b> Message </b> : ${message} <br> `,
    };

    let info = await transporter.sendMail(mailOptions);
    res.status(201).json({ msg: 'Email sent successfully' });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  add,
};
