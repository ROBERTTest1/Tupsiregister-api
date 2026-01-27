const WorkerController = require("../controllers/WorkerController");
const ShiftController = require("../controllers/ShiftController");
const ScheduleController = require("../controllers/ScheduleController");
const SessionController = require("../controllers/SessionController");
const UserController = require("../controllers/UserController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

module.exports = (app) => {
  // ------------------ SESSION ROUTES ------------------
  app.route("/session").post(SessionController.newSession);
  app.route("/session").get(requireAuth, SessionController.getCurrentSession);
  app.route("/session").delete(SessionController.logout);

  // ------------------ USER ROUTES ------------------
  app.route("/user").post(UserController.create); // Public - anyone can sign up
  app.route("/user/email/:EmailAddress").get(requireAuth, UserController.getByEmail); // Auth required
  app.route("/user/:UserID").get(requireAuth, UserController.getByID); // Auth required

  // ------------------ WORKER ROUTES ------------------
  app
    .route("/worker")
    .get(requireAuth, WorkerController.getAll) // Auth required - users can view
    .post(requireAdmin, WorkerController.create); // Admin only - create

  app
    .route("/worker/:WorkerID")
    .get(requireAuth, WorkerController.getByID) // Auth required - users can view
    .delete(requireAdmin, WorkerController.deleteByID) // Admin only - delete
    .put(requireAdmin, WorkerController.modifyById); // Admin only - modify

  // ------------------ SHIFT ROUTES ------------------
  app
    .route("/shift")
    .get(requireAuth, ShiftController.getAll) // Auth required - users can view
    .post(requireAdmin, ShiftController.create); // Admin only - create

  app
    .route("/shift/:ShiftID")
    .get(requireAuth, ShiftController.getByID) // Auth required - users can view
    .put(requireAdmin, ShiftController.modifyById) // Admin only - modify
    .delete(requireAdmin, ShiftController.deleteByID); // Admin only - delete

  // ------------------ SCHEDULE ROUTES ------------------
  app
    .route("/schedule")
    .get(requireAuth, ScheduleController.getAll) // Auth required - users can view
    .post(requireAdmin, ScheduleController.create); // Admin only - create

  app
    .route("/schedule/:ScheduleID")
    .get(requireAuth, ScheduleController.getByID) // Auth required - users can view
    .delete(requireAdmin, ScheduleController.deleteByID) // Admin only - delete
    .put(requireAdmin, ScheduleController.modifyById); // Admin only - modify
};
