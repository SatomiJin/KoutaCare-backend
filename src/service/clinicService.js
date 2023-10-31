const db = require("../models");

const createNewClinic = (dataClinic) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !dataClinic.nameClinic ||
        !dataClinic.address ||
        !dataClinic.imageBase64 ||
        !dataClinic.descriptionMarkdown ||
        !dataClinic.descriptionHTML
      ) {
        resolve({
          status: "ERROR",
          message: "Missing parameters",
        });
      } else {
        await db.Clinic.create({
          name: dataClinic.nameClinic,
          address: dataClinic.address,
          descriptionHTML: dataClinic.descriptionHTML,
          descriptionMarkdown: dataClinic.descriptionMarkdown,
          image: dataClinic.imageBase64,
        });
        resolve({
          status: "OK",
          message: "Create new clinic is success!!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//get all clinic
const getAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataClinic = await db.Clinic.findAll();
      if (dataClinic && dataClinic.length > 0) {
        dataClinic.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        status: "OK",
        message: "Get all clinic success",
        data: dataClinic,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const editClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataClinic = await db.Clinic.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (!dataClinic) {
        resolve({
          status: "ERROR",
          message: "The clinic is not exist!!",
        });
      } else {
        dataClinic.name = data.nameClinic;
        dataClinic.address = data.address;
        dataClinic.descriptionHTML = data.descriptionHTML;
        dataClinic.descriptionMarkdown = data.descriptionMarkdown;
        dataClinic.image = data.image;
        dataClinic.save();
        resolve({
          status: "OK",
          message: "Edited clinic is success!!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//delete
const deleteClinicById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinic = await db.Clinic.findOne({
        where: { id: id },
        raw: false,
      });
      if (!clinic) {
        resolve({
          status: "ERROR",
          message: "Clinic is not define!!",
        });
      } else {
        await clinic.destroy();
        resolve({
          status: "OK",
          message: "Deleted clinic is success!!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//get clinic by id
const getClinicById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinic = await db.Clinic.findOne({
        where: { id: id },
      });
      if (!clinic) {
        resolve({
          status: "ERROR",
          message: `The clinic with id ${id} is not exist`,
        });
      } else {
        if (clinic.image) {
          clinic.image = Buffer.from(clinic.image, "base64").toString("binary");
        }
        resolve({
          status: "OK",
          message: "Get detail clinic is success",
          data: clinic,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//get doctor be long to clinic
const getDoctorByClinic = (clinicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!clinicId) {
        resolve({
          status: "ERROR",
          message: "Missing parameters to get list doctors",
        });
      } else {
        let doctors = await db.DoctorInfo.findAll({
          where: { clinicId: clinicId },
          attributes: ["doctorId"],
        });
        resolve({
          status: "OK",
          message: "Get list doctor be long to clinic success!!!",
          doctors: doctors,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createNewClinic,
  getAllClinic,
  editClinic,
  deleteClinicById,
  getClinicById,
  getDoctorByClinic,
};
