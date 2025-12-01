const TupsController = require("../controllers/TupsController")

module.exports = (app) => {
    app.route("/tups")
    .get(TupsController.getAll)
    app.route("/tups/:TupsId")
    .get(TupsController.GetByID)
}