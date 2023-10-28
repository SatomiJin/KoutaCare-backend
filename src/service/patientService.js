import bcrypt from "bcryptjs";
import EmailService from "./EmailService";
const db = require("../models");
const salt = bcrypt.genSaltSync(10);
import { v4 as uuidv4 } from "uuid";
//build url verify token for booking examination
let buildUrlVerifyBooking = (token, doctorId) => {
  let urlVerify = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return urlVerify;
};
//hash password with bcryptjs
const hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

const patientBookingAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(
        !data.email,
        !data.doctorId,
        !data.fullName,
        !data.date,
        !data.timeType,
        !data.address,
        !data.gender,
        !data.phoneNumber
      );
      if (
        !data.email ||
        !data.doctorId ||
        !data.fullName ||
        !data.date ||
        !data.timeType ||
        !data.address ||
        !data.gender ||
        !data.phoneNumber
      ) {
        resolve({
          status: "ERROR",
          message: "Missing parameter!",
        });
      } else {
        let token = uuidv4();
        await EmailService.sendEmailService({
          email: data.email,
          patientName: data.fullName,
          time: data.time,
          doctorName: data.doctorName,
          redirectLink: buildUrlVerifyBooking(token, data.doctorId),
          language: data.language,
        });

        let hashPasswordDefault = await hashUserPassword("123456");
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
            password: hashPasswordDefault,
            lastName: data.fullName,
            address: data.address,
            gender: data.gender,
            phoneNumber: data.phoneNumber,
          },
        });

        //create booking
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: { token: token },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              token: token,
              timeType: data.timeType,
            },
          });
        }

        resolve({
          status: "OK",
          message: "Save patient success!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//verify booking
const patientVerifyBooking = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.doctorId || !data.token) {
        resolve({
          status: "ERROR",
          message: "Missing parameters for verify",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          resolve({
            status: "OK",
            message: "Verify success!!",
          });
        } else {
          resolve({
            status: "ERROR",
            message: "The appointment has been verified or not exist",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  patientBookingAppointment,
  patientVerifyBooking,
};
