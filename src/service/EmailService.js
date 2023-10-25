require("dotenv").config();
const nodemailer = require("nodemailer");

let sendEmailService = async (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper

  const info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: data.email, // list of receivers
    subject: "Thông tin đặt lịch khám với KoutaCare", // Subject line
    html: getBodyHTMLEmail(data),
  });
};

const getBodyHTMLEmail = (data) => {
  let result = ``;
  if (data.language === "vi") {
    result = `
        <h2>Xin chào, ${data.patientName}</h2>
        <p>Bạn đã đặt lịch khám online với KoutaCare. 
        VÌ vậy chúng tôi gửi email này nhằm xác thực</p>
        
        <h2>Thông tin đặt lịch khám bệnh</h2>
        <div><b>Thời gian: ${data.time}</b></div>
        <div><b>Bác Sĩ: ${data.doctorName}</b></div>

        <p>Nếu thực sự là bạn đã đặt lịch khám với chúng tôi vui lòng <br />
        truy cập vào đường dẫn bên dưới để xác thực:</p>

        <button style="background-color:green;color:white;height:30px;width:200px;border-radius:5px;font-size:16px;border:none;margin:20px;"><a href=${data.redirectLink} style="text-decoration:none;color:white;" target="_blank">Xác thực thông tin</a></button>
        

        <div>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!!!</div>
      `;
  }
  if (data.language === "en") {
    result = `
        <h2>Dear, ${data.patientName}</h2>
        <p>You have booked an online examination appointment with KoutaCare.
          <br />So we send this email for authentication</p>
        
        <h2>Information on scheduling medical examinations:</h2>
        <div><b>Time: ${data.time}</b></div>
        <div><b>Doctor's name: ${data.doctorName}</b></div>

        <p>If you have indeed made an appointment with us, please visit the link below to confirm:</p>

        <button style="background-color:green;color:white;height:30px;width:200px;border-radius:5px;font-size:16px;border:none;margin:20px;"><a href=${data.redirectLink} style="text-decoration:none;color:white;" target="_blank">Verify information</a></button>
        

        <div>Thank you for using our service!!!</div>
      `;
  }

  return result;
};

const sendAttachment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.MAIL_ACCOUNT,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      // async..await is not allowed in global scope, must use a wrapper

      const info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT, // sender address
        to: data.email, // list of receivers
        subject: "Thông tin hóa đơn và đơn thuốc sau khám với KoutaCare", // Subject line
        html: getBodyHTMLEmailRemedy(data),
        attachments: [
          {
            filename: `KoutaCare_Remedy-${data.patientName}-${new Date().getTime()}.png`,
            content: data.imageBase64.split("base64,")[1],
            encoding: "base64",
          },
        ],
      });
      resolve({
        status: "OK",
        message: "Email was sent success!!",
      });
    } catch {
      reject(e);
    }
  });
};

const getBodyHTMLEmailRemedy = (data) => {
  let result = ``;
  if (data.language === "vi") {
    result = `
      <h3>Xin chào, ${data.patientName}</h3>
      <h4>Bạn nhận được mail này từ dịch vụ đặt lịch khám trực tuyến của KoutaCare</h4>
      <p>Thông tin đơn thuốc/Hóa đơn khám bệnh được chúng tôi gửi trong file đính kèm:</p>
      <div>Chúc bạn có thật nhiều sức khỏe!!!</div>
      <div>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!!</div>
    `;
  } else {
    result = `
      <h3>Dear, ${data.patientName}</h3>
      <h4>You received this email from KoutaCare's online appointment scheduling service</h4>
      <p>Prescription information/Medical examination invoice is sent by us in the attached file:</p>
      <div>Wishing you good health!!!</div>
      <div>Thank you for using our service!!</div>
    `;
  }
  return result;
};
module.exports = {
  sendEmailService,
  sendAttachment,
};
