const WorkerController = require("../controllers/WorkerController");

module.exports = (app) => {
  app.route("/tups").get(WorkerController.getAll).post(WorkerController.create);
  app
    .route("/tups/:WorkerID")
    .get(WorkerController.getByID)
    .delete(WorkerController.deleteByID)
    .put(WorkerController.modifyById);
};
