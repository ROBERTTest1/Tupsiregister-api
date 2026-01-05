const { db } = require("../db");
const Utilities = require("./Utilities");
const { uuidv7 } = require("uuidv7"); // UUID v7 generaator

// --------------------------- GET ALL ---------------------------
exports.getAll = async (req, res) => {
  try {
    const worker = await db.worker.findAll();
    res.status(200).send(
      worker.map(({ WorkerID, FirstName, LastName, Workload, IsActive }) => ({
        WorkerID,
        FirstName,
        LastName,
        Workload,
        IsActive,
      }))
    );
  } catch (error) {
    console.error("Error in getAll:", error);
    res.status(500).send({ error: "Server error fetching Worker list." });
  }
};

// --------------------------- GET BY ID ---------------------------
exports.getByID = async (req, res) => {
  const worker = await getWorker(req, res);
  if (!worker) return; // getWorker already sent response
  res.status(200).send(worker);
};

// --------------------------- CREATE ---------------------------
exports.create = async (req, res) => {
  try {
    const { FirstName, LastName, Workload, IsActive } = req.body;

    if (!FirstName || !LastName || !Workload || !IsActive) {
      return res.status(400).send({
        error: "Missing some parameter, please review your request data.",
      });
    }

    const newWorker = {
      WorkerID: uuidv7(),
      FirstName,
      LastName,
      Workload,
      IsActive,
    };

    const createdWorker = await db.worker.create(newWorker);

    return res
      .location(`${Utilities.getBaseURL(req)}/worker/${createdWorker.WorkerID}`)
      .sendStatus(201);
  } catch (error) {
    console.error("Error in create:", error);
    res.status(500).send({ error: "Server error creating Worker." });
  }
};

// --------------------------- DELETE ---------------------------
exports.deleteByID = async (req, res) => {
  try {
    const workerToBeDeleted = await getWorker(req, res);
    if (!workerToBeDeleted) return; // getWorker already handled 404

    await workerToBeDeleted.destroy();
    return res.sendStatus(204); // No Content (must not include body)
  } catch (error) {
    console.error("Error in deleteByID:", error);
    res.status(500).send({ error: "Server error deleting Worker." });
  }
};

exports.modifyById = async (req, res) => {
  const workerToBeChanged = await getWorker(req, res);
  if (!workerToBeChanged) {
    return;
  }
  if (
    !req.body.FirstName ||
    !req.body.LastName ||
    !req.body.Workload ||
    !req.body.IsActive
  ) {
    return res.status(400).send({
      error: "Missing some parameter, please review your request data.",
    });
  }
  workerToBeChanged.FirstName = req.body.FirstName;
  workerToBeChanged.LastName = req.body.LastName;
  workerToBeChanged.Workload = req.body.Workload;
  workerToBeChanged.IsActive = req.body.IsActive;
  await workerToBeChanged.save();
  return res
    .location(
      `${Utilities.getBaseURL(req)}/worker/${workerToBeChanged.WorkerID}`
    )
    .sendStatus(201)
    .send(workerToBeChanged);
};

// --------------------------- HELPER FUNCTION ---------------------------
const getWorker = async (req, res) => {
  try {
    const id = req.params.WorkerID;

    const worker = await db.worker.findByPk(id);

    if (!worker) {
      res.status(404).send({ error: `Worker with ID ${id} was not found.` });
      return null;
    }

    return worker;
  } catch (err) {
    console.error("Error in getWorker:", err);
    res.status(500).send({ error: "Server error fetching Worker." });
    return null;
  }
};
