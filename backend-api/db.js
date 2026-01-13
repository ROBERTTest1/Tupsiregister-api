const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DBNAME,
  process.env.DB_USERNAME,
  process.env.DB_USERPASS,
  {
    host: process.env.DB_HOSTNAME,
    dialect: "mariadb",
    logging: console.log,
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully!");
  } catch (error) {
    console.error("Unable to connect." + error);
  }
};

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.worker = require("./models/Worker.js")(sequelize, DataTypes);
db.schedule = require("./models/Schedule.js")(sequelize, DataTypes);
db.shift = require("./models/Shift.js")(
  sequelize,
  DataTypes,
  db.worker,
  db.schedule
);

db.worker.belongsToMany(db.schedule, { through: db.shift, as: "WorkerShifts" });
db.schedule.belongsToMany(db.worker, { through: db.shift });
db.schedule.belongsToMany(db.worker, {
  through: db.shift,
  as: "ScheduleWorkers",
});

db.shift.belongsTo(db.worker, { foreignKey: "WorkerWorkerID" });

const sync = async () => {
  try {
    await sequelize.sync();
    console.log("Database sync has been completed");
  } catch (err) {
    console.error("Database sync failed:", err);
  }
};

module.exports = { db, sync, testConnection };
