import doctorService from "../service/doctorService";

const getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;

  if (!limit) limit = 10;
  try {
    const response = await doctorService.getTopDoctorHome(+limit);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Get list top doctors is failed!",
      Error: e.toString(),
    });
  }
};

//get all doctor
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorService.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Error from get all doctors",
    });
  }
};
//save details doctor
const saveDetailDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDetailDoctor(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Save doctor's detail is failed! Pls try again",
    });
  }
};

//get details doctor
const getDetailsDoctorById = async (req, res) => {
  try {
    const response = await doctorService.getDetailsDoctorById(req.query.id);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Get doctor's detail is failed! ",
    });
  }
};
//edit detail doctor by id
const editDetailsDoctor = async (req, res) => {
  try {
    let response = await doctorService.editDetailsDoctor(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Can't updates details for doctor",
    });
  }
};

//create schedule for doctor
const createSchedule = async (req, res) => {
  try {
    const response = await doctorService.createSchedule(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      status: "ERROR",
      message: "Error from create schedule",
      e: e.toString(),
    });
  }
};

//get schedule by date
const getScheduleByDate = async (req, res) => {
  try {
    const response = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      status: "ERROR",
      message: "Get schedule's doctor is failed!",
    });
  }
};

//get extra information doctor by id
const getExtraInfoDoctor = async (req, res) => {
  try {
    const response = await doctorService.getExtraInfoDoctor(req.query.doctorId);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Error from server",
    });
  }
};

//get description doctor
const getProfileDoctor = async (req, res) => {
  try {
    const response = await doctorService.getProfileDoctor(req.query.doctorId);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e.toString());
    return res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

//get list patient booking
const getListPatientBooking = async (req, res) => {
  try {
    const response = await doctorService.getListPatientBooking(req.query.doctorId, req.query.date);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};
//send remedy
const sendRemedy = async (req, res) => {
  try {
    const response = await doctorService.sendRemedy(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveDetailDoctor: saveDetailDoctor,
  getDetailsDoctorById: getDetailsDoctorById,
  editDetailsDoctor: editDetailsDoctor,
  createSchedule: createSchedule,
  getScheduleByDate,
  getExtraInfoDoctor,
  getProfileDoctor,
  getListPatientBooking,
  sendRemedy,
};
