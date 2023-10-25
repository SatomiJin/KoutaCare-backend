import clinicService from "../service/clinicService";

const createNewClinic = async (req, res) => {
  try {
    let response = await clinicService.createNewClinic(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

//get all clinic
const getAllClinic = async (req, res) => {
  try {
    const response = await clinicService.getAllClinic();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

const editClinic = async (req, res) => {
  try {
    const response = await clinicService.editClinic(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

//delete
const deleteClinicById = async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(200).json({
        status: "ERROR",
        message: "Missing parameters...",
      });
    }
    const response = await clinicService.deleteClinicById(req.query.id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

//get clinic by id
const getClinicById = async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(200).json({
        status: "ERROR",
        message: "Missing parameters...",
      });
    }
    const response = await clinicService.getClinicById(req.query.id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};
module.exports = {
  createNewClinic,
  getAllClinic,
  editClinic,
  deleteClinicById,
  getClinicById,
};
