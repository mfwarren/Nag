var parser = require('rssparser');
var options = {};

var secrets = require('../config/secrets');
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport('SMTP', {
  service: 'SendGrid',
  auth: {
       user: secrets.sendgrid.user,
       pass: secrets.sendgrid.password
  }
});

//TODO move these into the database
SETTINGS = [{'name':'Halotis.com', 'url':'http://www.halotis.com/feed/', 'email':'matt.warren@gmail.com', 'frequency':'7'},
            {'name':'mattwarren.co', 'url':'http://feeds.feedburner.com/AllThingsOtis', 'email':'matt.warren@gmail.com', 'frequency':'7'},
            ];

exports.checkAll = function(){
  for (var i in SETTINGS) {
    check_blog(SETTINGS[i]['name'], SETTINGS[i]['url'], SETTINGS[i]['email']);
  }
};

function check_blog(name, url, email) {
  var today = new Date();

  parser.parseURL(url, options, function(err, out){
    first_item = out.items[0];
    days_old = (today - first_item.published_at)/(60*60*24*1000);
    if (days_old >  7){
      console.log("SENDING EMAIL-- " + name + ' needs attention! last post ' + days_old + " days ago.");
      //sendEmail(name + ' needs attention! last post ' + days_old + " days ago.", 'Please write a post', email)
    } else {
      console.log( "good - last post" + days_old + " days ago.")
    }
  });

};


function sendEmail(subject, body, to) {

  var from = 'matt@halotis.com';

  var mailOptions = {
    to: to,
    from: from,
    subject: subject,
    text: body
  };

  smtpTransport.sendMail(mailOptions, function(err) {
    if (err) {
      console.log(err)
    }
  });
};
