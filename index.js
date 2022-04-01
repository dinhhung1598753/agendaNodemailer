const express = require('express');
const Agenda = require('agenda');
const nodemailer = require('nodemailer');

const app = express();

const mongoConnectionString = "mongodb://127.0.0.1/agenda-test";

const agenda = new Agenda(
    {
        db: { address: mongoConnectionString },
      }
);



agenda.define('send email', { priority: 'high', concurrency: 10 }, function (job, done) {
    console.log("sending")

    let content = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            body {
                text-align: center;
            }
        </style>
    </head>
    <body>
    <h1>RHP Island</h1>    
    <div>This is email send by nodemailer</div>
    <footer>@dinhhung159</footer>
    </body>
    </html>`;
    let transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: '*****@gmail.com',
                pass: '********'
            }
        });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'RHP is Land', // sender address
        to: 'trantoan.fox.97@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ?', // plain text body
        html: content // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            transporter.close();
            done();
        }
    });
});


agenda.on('ready',async function () {
    console.log("agenda start")
    await agenda.every('5 seconds', 'send email');
    await agenda.start();
    
});

agenda.on('start', function (job) {
    console.log("Job %s starting", job.attrs.name);
});

agenda.on('complete', function (job) {
    console.log("Job %s finished", job.attrs.name);
});


app.listen(5000, () => {
    console.log(`app started at port: 5000`)
})
