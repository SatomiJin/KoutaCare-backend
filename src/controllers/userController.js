import userService from "../service/userService";

const helloWorld = (req, res) => {
  try {
    return res.status(200).json("Hello World!!!");
  } catch (e) {
    return res.status(200).json({
      status: "ERRORS",
      message: "Error from server",
    });
  }
};
const handleLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      status: "ERROR",
      message: "Missing inputs parameters!",
    });
  }

  const userData = await userService.handleUserLogin(email, password);

  return res.status(200).json({
    status: userData.status,
    message: userData.message,
    user: userData.user ? userData.user : {},
  });
};

//lấy thông tin toàn bộ ng dùng'
const handleGetAllUser = async (req, res) => {
  const id = req.query.id; //ALL, SINGLE
  if (!id) {
    return res.status(200).json({
      status: "ERROR",
      message: "Missing required parameters",
      users: [],
    });
  }
  const users = await userService.getAllUsers(id);
  return res.status(200).json({
    status: "OK",
    message: "Get infomation of users completed",
    users,
  });
};

//get details user
const getDetailUser = async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(200).json({
      status: "ERROR",
      message: "Missing required parameters",
      info: [],
    });
  }
  const inforUser = await userService.getDetailUser(email);
  return res.status(200).json(inforUser);
};
//Create a new user
const handleCreateNewUser = async (req, res) => {
  try {
    const message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
      e: e.toString(),
    });
  }
};

//Edit user
const handleEditUser = async (req, res) => {
  const data = req.body;
  const message = await userService.editUser(data);
  return res.status(200).json(message);
};
//Delete user
const handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      status: "ERROR",
      message: "Please choose a user you want to delete",
    });
  }
  const message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message);
};

//get all codes
const getAllCodes = async (req, res) => {
  try {
    const data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({
      status: "ERRORS",
      message: "Error from server",
    });
  }
};

module.exports = {
  handleLogin: handleLogin,
  handleGetAllUser: handleGetAllUser,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
  getAllCodes: getAllCodes,
  getDetailUser,
  helloWorld,
};
