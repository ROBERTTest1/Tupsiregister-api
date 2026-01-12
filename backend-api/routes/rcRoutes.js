const WorkerController = require("../controllers/WorkerController");
const ShiftController = require("../controllers/ShiftController");
const ScheduleController = require("../controllers/ScheduleController");

module.exports = (app) => {
  // ------------------ WORKER ROUTES ------------------
  app
    .route("/worker")
    .get(WorkerController.getAll)
    .post(WorkerController.create);

  app
    .route("/worker/:WorkerID")
    .get(WorkerController.getByID)
    .delete(WorkerController.deleteByID)
    .put(WorkerController.modifyById);

  // ------------------ SHIFT ROUTES ------------------
  app.route("/shift").get(ShiftController.getAll).post(ShiftController.create);

  app
    .route("/shift/:ShiftID")
    .get(ShiftController.getByID)
    .delete(ShiftController.deleteByID);

  // ------------------ SCHEDULE ROUTES ------------------
  app
    .route("/schedule")
    .get(ScheduleController.getAll)
    .post(ScheduleController.create);

  app
    .route("/schedule/:ScheduleID")
    .get(ScheduleController.getByID)
    .delete(ScheduleController.deleteByID)
    .put(ScheduleController.modifyById);
};
