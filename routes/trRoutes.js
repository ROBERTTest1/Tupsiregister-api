const TupsController = require("../controllers/TupsController")

module.exports = (app) => {
    app.route("/tups")
    .get(TupsController.getAll)
}