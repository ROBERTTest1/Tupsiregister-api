const { db } = require("../db");
const Utilities = require("./Utilities");
const { v7: uuidv7 } = require("uuid"); // Standard way to import uuid v7

// --------------------------- GET ALL ---------------------------
exports.getAll = async (req, res) => {
  try {
    // 1. Fixed: Changed db.shifts -> db.shift to match your db.js
    const shifts = await db.shift.findAll({
      include: [
        {
          model: db.worker, // 2. Fixed: Changed db.workers -> db.worker
          attributes: ["FirstName", "LastName"],
        },
      ],
    });

    res.status(200).send(shifts);
  } catch (error) {
    console.error("DETAILED ERROR IN GETALL:", error.message);
    res.status(500).send({
      error: "Server error fetching Shift list.",
      details: error.message,
    });
  }
};

// --------------------------- CREATE ---------------------------
exports.create = async (req, res) => {
  try {
    // 1. Map incoming names (handles WorkerID or WorkerWorkerID)
    const WorkerID = req.body.WorkerID || req.body.WorkerWorkerID;
    const ScheduleID = req.body.ScheduleID || req.body.ScheduleScheduleID;
    const { ShiftDate, StartTime, EndTime } = req.body;

    // 2. Validation using the mapped variables
    if (!WorkerID || !ScheduleID || !ShiftDate || !StartTime || !EndTime) {
      return res.status(400).send({
        error: "Missing parameters",
        received: req.body,
      });
    }

    const newShift = {
      ShiftID: uuidv7(),
      WorkerWorkerID: WorkerID, // Matches your DB column
      ScheduleScheduleID: ScheduleID, // Matches your DB column
      ShiftDate,
      StartTime,
      EndTime,
    };

    // 3. Fixed: Changed db.shifts -> db.shift
    const createdShift = await db.shift.create(newShift);

    return res
      .status(201)
      .location(`${Utilities.getBaseURL(req)}/shift/${createdShift.ShiftID}`)
      .json(createdShift);
  } catch (error) {
    console.error("Error in create shift:", error);
    res
      .status(500)
      .send({ error: "Server error creating Shift.", details: error.message });
  }
};

// --------------------------- GET BY ID ---------------------------
exports.getByID = async (req, res) => {
  const shift = await getShift(req, res);
  if (!shift) return;
  res.status(200).send(shift);
};

// --------------------------- DELETE ---------------------------
exports.deleteByID = async (req, res) => {
  try {
    const shift = await getShift(req, res);
    if (!shift) return;

    await shift.destroy();
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error in delete shift:", error);
    res.status(500).send({ error: "Server error deleting Shift." });
  }
};

// --------------------------- HELPER FUNCTION ---------------------------
const getShift = async (req, res) => {
  try {
    const id = req.params.ShiftID;
    // Fixed: Changed db.shifts -> db.shift
    const shift = await db.shift.findByPk(id, {
      include: [{ model: db.worker }],
    });

    if (!shift) {
      res.status(404).send({ error: `Shift with ID ${id} was not found.` });
      return null;
    }
    return shift;
  } catch (err) {
    console.error("Error in getShift:", err);
    res.status(500).send({ error: "Server error fetching Shift." });
    return null;
  }
};
