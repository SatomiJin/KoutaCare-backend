const { Sequelize } = require("sequelize");
// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("satomidb_zmg1", "satomidb_zmg1_user", "yhQwIrluPEnuN0D6Qvd62LFOgcviJMV1", {
  host: "dpg-ckrom7hrfc9c738fjvl0-a.oregon-postgres.render.com",
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = {
  connectDB,
};
