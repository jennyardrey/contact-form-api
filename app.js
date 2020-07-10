const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const creds = require('./config.js');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.send('ready to gooo'));
/* app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}); */

const transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
};

const transporter = nodemailer.createTransport(transport);

transporter.verify(error => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

app.post('/send', (req, res, next) => {
  const { name } = req.body;
  const { email } = req.body;
  const { message } = req.body;
  const content = `name: ${name} \n email: ${email} \n message: ${message} `;

  const mail = {
    from: name,
    to: 'octavesapart@gmail.com', // Change to email address that you want to receive messages on
    subject: 'New Message from Contact Form',
    text: content,
  };

  transporter.sendMail(mail, err => {
    if (err) {
      res.json({
        msg: 'fail',
      });
    } else {
      res.json({
        msg: 'success',
      });
    }
    transporter.sendMail(
      {
        from: 'octavesapart@gmail.com',
        to: email,
        subject: 'Submission was successful',
        text: `Thank you for contacting us ${name}!\n\nHere's your enquiry:\nName: ${name}\n Email: ${email}\n Message: ${message}`,
        attachments: [
          {
            path: './broche.pdf',
          },
        ],
      },
      function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Message sent: ${info.response}`);
        }
      },
    );
  });
});

app.listen(process.env.PORT, () => console.log(`this is listening on port ${process.env.PORT}`));

module.exports = app;
