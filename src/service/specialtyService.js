const db = require("../models");

const createNewSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.nameSpecialty || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
        resolve({
          status: "ERROR",
          message: "Missing parameters for create specialty",
        });
      } else {
        await db.Specialty.create({
          name: data.nameSpecialty,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
          image: data.imageBase64,
        });
        resolve({
          status: "OK",
          message: "Create a new specialty success!!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//get specialty
const getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
        resolve({
          status: "OK",
          message: "Get specialty success!!",
          data: data,
        });
      } else {
        resolve({
          status: "ERROR",
          message: "No specialty!!  ",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
//get detail specialty by id
const getDetailSpecialtyById = (specialtyId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!specialtyId || !location) {
        resolve({
          status: "ERROR",
          message: "Missing parameter for get detail",
        });
      } else {
        let dataSpecialty = await db.Specialty.findOne({
          where: { id: specialtyId },
          attributes: ["descriptionHTML", "descriptionMarkdown"],
        });

        let doctorSpecialty = [];
        if (dataSpecialty) {
          if (location === "ALL") {
            doctorSpecialty = await db.DoctorInfo.findAll({
              where: { specialtyId: specialtyId },
              attributes: ["doctorId", "provinceId"],
            });
          } else {
            //find with location
            doctorSpecialty = await db.DoctorInfo.findAll({
              where: { specialtyId: specialtyId, provinceId: location },
              attributes: ["doctorId", "provinceId"],
            });
          }
          dataSpecialty.doctorSpecialty = doctorSpecialty;

          resolve({
            status: "OK",
            message: "Get detail's specialty success!",
            data: dataSpecialty,
          });
        } else {
          resolve({
            status: "ERROR",
            message: "Get detail's specialty failed!!",
            data: [],
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

//delete specialty by id
const deleteSpecialtyById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let specialty = await db.Specialty.findOne({
        where: { id: id },
      });
      if (!specialty) {
        resolve({
          status: "ERROR",
          message: `Specialty with id: ${id} is not exist!!`,
        });
      } else {
        await db.User.destroy({
          where: { id: id },
        });

        await db.Specialty.destroy({
          where: { id: id },
        });
        resolve({
          status: "OK",
          message: "The specialty was deleted!!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//edit specialty
const editSpecialtyById = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let specialty = await db.Specialty.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (!specialty) {
        resolve({
          status: "ERROR",
          message: "The Specialty is not define!!",
        });
      } else {
        specialty.name = data.name;
        specialty.image = data.image;
        specialty.descriptionHTML = data.descriptionHTML;
        specialty.descriptionMarkdown = data.descriptionMarkdown;
        specialty.updatedAt = data.updatedAt;
        specialty.save();
        resolve({
          status: "OK",
          message: "Updated specialty success!!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createNewSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
  deleteSpecialtyById,
  editSpecialtyById,
};
