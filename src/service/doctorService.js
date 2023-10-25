import db from "../models";
require("dotenv").config();
import _, { reject } from "lodash";
import EmailService from "./EmailService";
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

const getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await db.User.findAll({
        limit: limit,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          { model: db.AllCode, as: "positionData", attributes: ["valueEn", "valueVi"] },
          { model: db.AllCode, as: "genderData", attributes: ["valueEn", "valueVi"] },

          {
            model: db.DoctorInfo,
            attributes: {
              exclude: ["id", "doctorId"],
            },
            include: [{ model: db.Specialty, as: "specialtyTypeData", attributes: ["name"] }],
          },
        ],

        raw: true,
        nest: true,
      });
      if (users && users.length > 0) {
        users.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }

      resolve({
        status: "OK",
        message: "Get list top doctors is success!",
        list: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//get all doctors

const getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({
        status: "OK",
        message: "Get all doctors success!",
        users: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//let check require parameters
let checkRequireParameters = (users) => {
  let arr = [
    "doctorId",
    "contentHTML",
    "contentMarkdown",
    "selectedPrice",
    "selectedPayment",
    "selectedProvince",
    "nameClinic",
    "addressClinic",
    "specialtyId",
  ];
  let isValid = true;
  let element = "";
  for (let i = 0; i < arr.length; i++) {
    if (!users[arr[i]]) {
      isValid = false;
      element = arr[i];
      break;
    }
  }
  return {
    isValid,
    element,
  };
};
//save detaiils doctor
const saveDetailDoctor = (users) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkData = checkRequireParameters(users);

      if (checkData.isValid === false) {
        resolve({
          status: "ERROR",
          message: `Missing ${checkData.element} to save!!!`,
        });
      } else {
        await db.Markdown.create({
          contentHTML: users.contentHTML,
          contentMarkdown: users.contentMarkdown,
          description: users.description,
          doctorId: users.doctorId,
        });
        await db.DoctorInfo.create({
          doctorId: users.doctorId,
          priceId: users.selectedPrice,
          paymentId: users.selectedPayment,
          provinceId: users.selectedProvince,
          nameClinic: users.nameClinic,
          addressClinic: users.addressClinic,
          note: users.note,
          specialtyId: users.specialtyId,
          clinicId: users.clinicId,
        });
        resolve({
          status: "OK",
          message: "Save details doctors is success!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//edit details doctor
const editDetailsDoctor = (users) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!users.doctorId) {
        resolve({
          status: "ERROR",
          message: "Missing doctor for edit",
        });
      } else {
        //create doctor detail
        let doctor = await db.Markdown.findOne({
          where: { doctorId: users.doctorId },
          raw: false,
        });
        //doctor info
        let doctorInfo = await db.DoctorInfo.findOne({
          where: { doctorId: users.doctorId },
          raw: false,
        });
        if (doctor) {
          doctor.contentHTML = users.contentHTML;
          doctor.contentMarkdown = users.contentMarkdown;
          doctor.description = users.description;
          doctor.doctorId = users.doctorId;
          doctor.updateAt = new Date();
          await doctor.save();
        }
        if (doctorInfo) {
          doctor.doctorId = users.doctorId;
          doctorInfo.priceId = users.selectedPrice;
          doctorInfo.paymentId = users.selectedPayment;
          doctorInfo.provinceId = users.selectedProvince;
          doctorInfo.nameClinic = users.nameClinic;
          doctorInfo.addressClinic = users.addressClinic;
          doctorInfo.note = users.note;
          doctorInfo.specialtyId = users.specialtyId;
          doctorInfo.clinicId = users.clinicId;
          await doctorInfo.save();
        }
      }
      resolve({
        status: "OK",
        message: "Update details success!",
      });
    } catch (e) {
      reject(e);
    }
  });
};
//get details doctor by id
const getDetailsDoctorById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          status: "ERROR",
          message: "Missing required parameter!",
        });
      } else {
        let users = await db.User.findOne({
          where: { id: id },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },

            {
              model: db.DoctorInfo,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                { model: db.AllCode, as: "priceTypeData", attributes: ["valueEn", "valueVi"] },
                { model: db.AllCode, as: "paymentTypeData", attributes: ["valueEn", "valueVi"] },
                { model: db.AllCode, as: "provinceTypeData", attributes: ["valueEn", "valueVi"] },
              ],
            },
            { model: db.AllCode, as: "positionData", attributes: ["valueEn", "valueVi"] },
          ],
          raw: false,
          nest: true,
        });
        if (users && users.image) {
          users.image = Buffer.from(users.image, "base64").toString("binary");
        }
        resolve({
          status: "OK",
          message: "Get details is success!",
          users: users,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//create schedule for doctor
const createSchedule = (users) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!users.listSchedule || !users.doctorId || !users.date) {
        resolve({
          status: "ERROR",
          message: "Missing users for create schedule ",
        });
      } else {
        let listSchedule = users.listSchedule;
        if (listSchedule && listSchedule.length > 0) {
          listSchedule = listSchedule.map((schedule) => {
            schedule.maxNumber = MAX_NUMBER_SCHEDULE;
            return schedule;
          });
        }
        // find schedule in db
        let existing = await db.Schedule.findAll({
          where: { doctorId: users.doctorId, date: "" + users.date },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });
        // convert date to timestamp
        if (existing && existing.length > 0) {
          existing = existing.map((scheduleDoctor) => {
            scheduleDoctor.date = Number(scheduleDoctor.date);
            return scheduleDoctor;
          });
        }
        // new schedule not equals schedule in db
        let toCreate = _.differenceWith(listSchedule, existing, (a, b) => {
          return a.timeType === b.timeType && a.date === b.date;
        });
        // create schedule if schedule don't exist in db
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        } else {
          //schedule is required
          resolve({
            status: "ERROR",
            message: "Schedule is required!",
          });
        }
        resolve({
          status: "OK",
          message: "Save schedule for doctor success",
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

//get schedule by date
const getScheduleByDate = (id, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !date) {
        resolve({
          status: "ERROR",
          message: "Missing required parameters for get schedules",
        });
      } else {
        const scheduleData = await db.Schedule.findAll({
          where: { doctorId: id, date: date },
          include: [
            { model: db.AllCode, as: "timeTypeData", attributes: ["valueEn", "valueVi"] },
            { model: db.User, as: "doctorData", attributes: ["firstName", "lastName"] },
          ],
          raw: false,
          nest: true,
        });
        // if (scheduleData && scheduleData.length ) scheduleData = [];
        resolve({
          status: "OK",
          message: "Get schedule's doctor success!",
          schedules: scheduleData,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//get extra doctor information by id
const getExtraInfoDoctor = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          status: "ERROR",
          message: "Missing parameter for get extra info",
        });
      } else {
        const dataInfo = await db.DoctorInfo.findOne({
          where: { doctorId: id },

          attributes: {
            exclude: ["id", "doctorId"],
          },
          include: [
            { model: db.AllCode, as: "priceTypeData", attributes: ["valueEn", "valueVi"] },
            { model: db.AllCode, as: "paymentTypeData", attributes: ["valueEn", "keyMap", "valueVi"] },
            { model: db.AllCode, as: "provinceTypeData", attributes: ["valueEn", "valueVi"] },
          ],
          raw: false,
          nest: true,
        });

        resolve({
          status: "OK",
          message: "Get extra info success!",
          users: dataInfo,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//get description doctor
const getProfileDoctor = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          status: "ERROR",
          message: "Missing parameter for get profile doctor",
        });
      } else {
        const profileDoctor = await db.User.findOne({
          where: { id: id },
          attributes: {
            exclude: ["password", "roleId"],
          },
          include: [
            {
              model: db.AllCode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.DoctorInfo,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                { model: db.AllCode, as: "priceTypeData", attributes: ["valueVi", "valueEn"] },
                { model: db.AllCode, as: "paymentTypeData", attributes: ["valueVi", "valueEn"] },
                { model: db.AllCode, as: "provinceTypeData", attributes: ["valueVi", "valueEn"] },
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        if (profileDoctor && profileDoctor.image) {
          profileDoctor.image = Buffer.from(profileDoctor.image, "base64").toString("binary");
        }
        if (!profileDoctor) profileDoctor = [];
        resolve({
          status: "OK",
          message: "Get profile doctor success!",
          profile: profileDoctor,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//get all patient booking
const getListPatientBooking = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          status: "ERROR",
          message: "Missing parameters....",
        });
      } else {
        let listBooking = await db.Booking.findAll({
          where: {
            statusId: "S2",
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: ["email", "lastName", "address", "gender", "phoneNumber"],
              include: [{ model: db.AllCode, as: "genderData", attributes: ["valueEn", "valueVi"] }],
            },
            { model: db.AllCode, as: "timeTypeBooking", attributes: ["valueVi", "valueEn"] },
          ],
          raw: false,
          nest: true,
        });
        resolve({
          status: "OK",
          message: "Get list booking by patient success!!!",
          users: listBooking,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//send remedy
const sendRemedy = (users) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!users.email || !users.doctorId || !users.patientId || !users.timeType) {
        resolve({
          status: "ERROR",
          message: "Missing parameters....",
        });
      } else {
        //update patient status
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: users.doctorId,
            patientId: users.patientId,
            timeType: users.timeType,
            statusId: "S2",
          },
          raw: false,
        });

        if (appointment) {
          appointment.statusId = "S3";
          await appointment.save();
        }

        //send remedy to email

        await EmailService.sendAttachment(users);
        resolve({
          status: "OK",
          message: "Confirm appointment is success!!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveDetailDoctor: saveDetailDoctor,
  getDetailsDoctorById: getDetailsDoctorById,
  editDetailsDoctor: editDetailsDoctor,
  createSchedule,
  getScheduleByDate,
  getExtraInfoDoctor,
  getProfileDoctor,
  getListPatientBooking,
  sendRemedy,
};
