const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
// const cors = require('cors');

const app = express();
const APP_PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors({ credentials: true, origin: true }));
// app.options('*', cors());

app.listen(APP_PORT, () => {
  console.log(`Now serving your Express app at http://localhost:${APP_PORT}`); // eslint-disable-line
});

app.get('/', (req, res) => {
  res.send('Welcome to contact-form-api!');
});

app.post('/api/v1', (req, res) => {
  const { data } = req;

  const smptTransport = nodemailer.createTransport({
    service: 'Gmail',
    port: 465,
    auth: {
      username: process.env.username,
      password: process.env.password,
    },
  });
  const mailOptions = {
    from: data.email,
    to: 'octavesapart@gmail.com',
    subject: 'Contact form submission',
    html: `<p>${data.name}</p>
          <p>${data.email}</p>
          <p>${data.message}</p>`,
  };
  smptTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      res.send(error);
    } else {
      res.send('Success');
    }
    smptTransport.close();
  });
});
