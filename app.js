const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const creds = require('./config');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.send('hello'));
/* app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}); */

const transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: creds.user,
    pass: creds.pass,
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
    to: 'jenny@ardrey.co.uk', // Change to email address that you want to receive messages on
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
  });
});

app.listen(3333, () => console.log('this is listening on port 3000'));

module.exports = app;
