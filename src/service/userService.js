import { reject } from "lodash";
import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

const handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = {};
      const isExist = await checkUserEmail(email);

      if (isExist) {
        //nếu người dùng tồn tại
        const user = await db.User.findOne({
          attributes: ["id", "email", "roleId", "password", "firstName", "lastName"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          //compare password
          const checkPassword = await bcrypt.compareSync(password, user.password);

          if (checkPassword) {
            userData.status = "OK";
            userData.message = "Login Success";
            delete user.password;
            userData.user = user;
          } else {
            userData.status = "ERROR";
            userData.message = "Wrong password! Try again";
          }
        } else {
          userData.status = "ERROR";
          userData.message = `User's not found ~`;
        }
      } else {
        //return error
        userData.status = "ERROR";
        userData.message = `Your's email isn't exist in system. Please try other email!`;
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};
//check email user
const checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: {
          email: userEmail,
        },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

//Lấy thông tin của người dùng từ api
const getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }

      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

//get information user
const getDetailUser = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let info = {};
      if (email) {
        let userData = await db.User.findOne({
          where: { email: email },
          attributes: {
            exclude: ["password", "roleId", "positionId"],
          },
        });
        if (userData && userData.image) {
          userData.image = Buffer.from(userData.image, "base64").toString("binary");
        }
        resolve({
          status: "OK",
          message: "Get details user success!",
          userData,
        });
      } else {
        resolve({
          status: "OK",
          message: "User not found!",
          userData: [],
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//Create a new user
const createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check email is exist?
      const check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          status: "ERROR",
          message: "Your email is already used! Please try to another email",
        });
      } else {
        if (
          !data.email ||
          !data.password ||
          !data.phoneNumber ||
          !data.firstName ||
          !data.lastName ||
          !data.address ||
          !data.gender ||
          !data.roleId
        ) {
          resolve({
            status: "ERROR",
            message: "Please fill all parameters for create user",
          });
        } else {
          const hashPasswordFromBcrypt = await hashUserPassword(data.password);
          await db.User.create({
            email: data.email,
            password: hashPasswordFromBcrypt,
            phoneNumber: data.phoneNumber,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            gender: data.gender,
            roleId: data.roleId,
            positionId: data.positionId,
            image: data.avatar,
          });
          resolve({
            status: "OK",
            message: "Create a new User success!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
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

//delete user
const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { id: id },
      });
      if (!user) {
        resolve({
          status: "ERROR",
          message: `A user with id: ${id} isn't exist`,
        });
      }
      await db.User.destroy({
        where: { id: id },
      });
      resolve({
        status: "OK",
        message: "The user is delete completed",
      });
    } catch (e) {
      reject(e);
    }
  });
};
//update user
const editUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          status: "ERROR",
          message: "Missing parameters for update user",
        });
      }
      const user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;
        user.gender = data.gender;
        user.roleId = data.roleId;
        user.positionId = data.positionId;
        if (data.avatar) {
          user.image = data.avatar;
        }
        await user.save();
        // await db.User.save({
        //   firstName: data.firstName,
        //   lastName: data.lastName,
        //   address: data.address,
        // });

        resolve({
          status: "OK",
          message: "update user success!",
        });
      } else {
        resolve({
          status: "ERROR",
          message: "Update user's failed, User's not found",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//get all codes
const getAllCodeService = (type) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!type) {
        resolve({
          status: "ERROR",
          message: "Missing type parameters for search",
        });
      } else {
        const res = {};
        const allcode = await db.AllCode.findAll({
          where: { type: type },
        });
        res.data = allcode;

        res.status = "OK";
        res.message = "Get infomation successful";

        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  editUser: editUser,
  getAllCodeService: getAllCodeService,
  getDetailUser,
};
