import patientService from "../service/patientService";

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

const patientBookingAppointment = async (req, res) => {
  try {
    const response = await patientService.patientBookingAppointment(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Booking appointment is Failed!",
    });
  }
};

//verify booking
const patientVerifyBooking = async (req, res) => {
  try {
    const response = await patientService.patientVerifyBooking(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Verify is Failed! please, try again",
    });
  }
};
module.exports = {
  patientBookingAppointment,
  patientVerifyBooking,
};
