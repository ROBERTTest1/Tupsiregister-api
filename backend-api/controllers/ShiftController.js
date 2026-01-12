const { db } = require("../db");
const Utilities = require("./Utilities");
const { uuidv7 } = require("uuidv7"); // UUID v7 generaator

// --------------------------- GET ALL ---------------------------
exports.getAll = async (req, res) => {
  try {
    // Tavaliselt tahad vahetusi nähes teada ka töötaja nime
    const shifts = await db.shifts.findAll({
      include: [
        {
          model: db.workers,
          as: "worker",
          attributes: ["FirstName", "LastName"],
        },
      ],
    });
    res.status(200).send(shifts);
  } catch (error) {
    console.error("Error in getAll shifts:", error);
    res.status(500).send({ error: "Server error fetching Shift list." });
  }
};

// --------------------------- CREATE ---------------------------
exports.create = async (req, res) => {
  try {
    const { WorkerID, ScheduleID, ShiftDate, StartTime, EndTime } = req.body;

    // Kontrollime, et kõik vajalikud väljad on olemas
    if (!WorkerID || !ScheduleID || !ShiftDate || !StartTime || !EndTime) {
      return res.status(400).send({
        error:
          "Missing parameters. WorkerID, ScheduleID, Date and Times are required.",
      });
    }

    const newShift = {
      ShiftID: uuidv7(),
      WorkerWorkerID,
      ScheduleScheduleID,
      ShiftDate,
      StartTime,
      EndTime,
    };

    const createdShift = await db.shifts.create(newShift);

    return res
      .location(`${Utilities.getBaseURL(req)}/shift/${createdShift.ShiftID}`)
      .sendStatus(201);
  } catch (error) {
    console.error("Error in create shift:", error);
    res.status(500).send({ error: "Server error creating Shift." });
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
    const shift = await db.shifts.findByPk(id, {
      include: ["worker"], // Võtab kaasa töötaja andmed
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
