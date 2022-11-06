const request = require("request");
const dotenv = require("dotenv");
dotenv.config();

const url_line_notification = "https://notify-api.line.me/api/notify";

const lineNotify = (message) => {
  request(
    {
      method: "POST",
      uri: url_line_notification,
      header: {
        "Content-Type": "multipart/form-data",
      },
      auth: {
        bearer: "21FqJmGHKfIh9hK2kYpciWBEltYXYH0BsFhUaH85zvN",
        // bearer: process.env.TOKEN,
      },
      form: {
        message: message,
      },
    },
    (err, httpResponse, body) => {
      if (err) {
        console.log(err);
      } else {
        console.log(body);
      }
    }
  );
};

// const lineNotifyOld = request(
//   {
//     method: "POST",
//     uri: url_line_notification,
//     header: {
//       "Content-Type": "multipart/form-data",
//     },
//     auth: {
//       bearer: process.env.TOKEN,
//     },
//     form: {
//       message: "Test Message!",
//     },
//   },
//   (err, httpResponse, body) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(body);
//     }
//   }
// );

// lineNotify("This is a test");
module.exports = { lineNotify };