const WorkerController = require("../controllers/WorkerController");

module.exports = (app) => {
  app
    .route("/worker")
    .get(WorkerController.getAll)
    .post(WorkerController.create);
  app
    .route("/worker/:WorkerID")
    .get(WorkerController.getByID)
    .delete(WorkerController.deleteByID)
    .put(WorkerController.modifyById);
};
