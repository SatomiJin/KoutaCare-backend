import express from "express";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
let router = express.Router();

let initWebRoute = (app) => {
  //route sử dụng
  router.post("/api/login", userController.handleLogin);
  //APi các chức năng CRUD
  router.get("/api/get-all-users", userController.handleGetAllUser);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.get("/api/get-details-user", userController.getDetailUser);
  //API lấy dữ liệu từ bảng allCodes
  router.get("/api/allcodes", userController.getAllCodes);
  //APi quản lý bác sĩ
  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
  router.get("/api/get-all-doctors", doctorController.getAllDoctors);
  router.post("/api/save-details-doctor", doctorController.saveDetailDoctor);
  router.get("/api/get-details-doctor", doctorController.getDetailsDoctorById);
  router.put("/api/edit-details-doctor", doctorController.editDetailsDoctor);
  router.post("/api/create-schedule", doctorController.createSchedule);
  router.get("/api/get-schedule-by-date", doctorController.getScheduleByDate);
  router.get("/api/get-extra-info-doctor-by-id", doctorController.getExtraInfoDoctor);
  router.get("/api/get-profile-doctor", doctorController.getProfileDoctor);
  router.post("/api/send-remedy", doctorController.sendRemedy);
  //Patient
  router.post("/api/patient-booking", patientController.patientBookingAppointment);
  router.post("/api/verify-patient-booking", patientController.patientVerifyBooking);

  //specialty
  router.post("/api/create-new-specialty", specialtyController.createNewSpecialty);
  router.get("/api/get-all-specialty", specialtyController.getAllSpecialty);
  router.put("/api/edit-specialty", specialtyController.editSpecialtyById);
  router.get("/api/get-detail-specialty", specialtyController.getDetailSpecialtyById);
  router.delete("/api/delete-specialty", specialtyController.deleteSpecialtyById);
  //clinic
  router.post("/api/clinic/create-new-clinic", clinicController.createNewClinic);
  router.get("/api/clinic/get-all-clinic", clinicController.getAllClinic);
  router.get("/api/clinic/get-clinic-by-id", clinicController.getClinicById);
  router.put("/api/clinic/edit-clinic", clinicController.editClinic);
  router.delete("/api/clinic/delete-clinic", clinicController.deleteClinicById);
  //booking manage doctor
  router.get("/api/doctor/get-list-patient-booking", doctorController.getListPatientBooking);
  //return
  return app.use("/", router);
};

module.exports = initWebRoute;
