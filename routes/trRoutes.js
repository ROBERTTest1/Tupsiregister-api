const TupsController = require("../controllers/TupsController");

module.exports = (app) => {
  app.route("/tups").get(TupsController.getAll).post(TupsController.create);
  app.route("/tups/:TupsId").get(TupsController.getByID);
};
