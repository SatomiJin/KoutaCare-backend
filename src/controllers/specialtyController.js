import specialtyService from "../service/specialtyService";

const createNewSpecialty = async (req, res) => {
  try {
    const response = await specialtyService.createNewSpecialty(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Error from server",
      console: e,
    });
  }
};

//get specialty
const getAllSpecialty = async (req, res) => {
  try {
    const response = await specialtyService.getAllSpecialty();
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Error from server",
    });
  }
};

//get detail specialty by id
const getDetailSpecialtyById = async (req, res) => {
  try {
    const response = await specialtyService.getDetailSpecialtyById(req.query.specialtyId, req.query.location);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Error from server",
    });
  }
};
//edit specialty
const editSpecialtyById = async (req, res) => {
  try {
    const response = await specialtyService.editSpecialtyById(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Error from server",
    });
  }
};

//delete specialty by id
const deleteSpecialtyById = async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(200).json({
        status: "ERROR",
        message: "Missing parameter for delete!!",
      });
    }
    const response = await specialtyService.deleteSpecialtyById(req.query.id);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Error from server",
    });
  }
};
module.exports = {
  createNewSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
  deleteSpecialtyById,
  editSpecialtyById,
};
