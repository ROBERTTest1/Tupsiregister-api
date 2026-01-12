const { db } = require("../db");
const Utilities = require("./Utilities");
const { uuidv7 } = require("uuidv7"); // UUID v7 generaator

// --------------------------- GET ALL ---------------------------
exports.getAll = async (req, res) => {
  try {
    const schedule = await db.schedule.findAll();
    res.status(200).send(schedule);
  } catch (error) {
    console.error("Error in getAll schedule:", error);
    res.status(500).send({ error: "Server error fetching Schedule list." });
  }
};

// --------------------------- GET BY ID ---------------------------
exports.getByID = async (req, res) => {
  try {
    const id = req.params.ScheduleID;
    // Leiame graafiku ja kaasame kõik sellega seotud vahetused
    const schedule = await db.schedule.findByPk(id, {
      include: [{ model: db.shifts, as: "shifts" }],
    });

    if (!schedule) {
      return res
        .status(404)
        .send({ error: `Schedule with ID ${id} was not found.` });
    }
    res.status(200).send(schedule);
  } catch (error) {
    console.error("Error in getByID schedule:", error);
    res.status(500).send({ error: "Server error fetching Schedule." });
  }
};

// --------------------------- CREATE ---------------------------
exports.create = async (req, res) => {
  try {
    const { ScheduleName, StartDate, EndDate } = req.body;

    if (!ScheduleName || !StartDate || !EndDate) {
      return res.status(400).send({
        error:
          "Missing parameters. ScheduleName, StartDate and EndDate are required.",
      });
    }

    const newSchedule = {
      ScheduleID: uuidv7(),
      ScheduleName,
      StartDate,
      EndDate,
    };

    const createdSchedule = await db.schedule.create(newSchedule);

    return res
      .location(
        `${Utilities.getBaseURL(req)}/schedule/${createdSchedule.ScheduleID}`
      )
      .sendStatus(201);
  } catch (error) {
    console.error("Error in create schedule:", error);
    res.status(500).send({ error: "Server error creating Schedule." });
  }
};

// --------------------------- DELETE ---------------------------
exports.deleteByID = async (req, res) => {
  try {
    const id = req.params.ScheduleID;
    const schedule = await db.schedule.findByPk(id);

    if (!schedule) {
      return res.status(404).send({ error: "Schedule not found." });
    }

    await schedule.destroy();
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error in delete schedule:", error);
    res.status(500).send({ error: "Server error deleting Schedule." });
  }
};

// --------------------------- MODIFY ---------------------------
exports.modifyById = async (req, res) => {
  try {
    const id = req.params.ScheduleID;
    const schedule = await db.schedule.findByPk(id);

    if (!schedule) {
      return res.status(404).send({ error: "Schedule not found." });
    }

    const { ScheduleName, StartDate, EndDate } = req.body;
    if (!ScheduleName || !StartDate || !EndDate) {
      return res.status(400).send({ error: "Missing parameters for update." });
    }

    schedule.ScheduleName = ScheduleName;
    schedule.StartDate = StartDate;
    schedule.EndDate = EndDate;

    await schedule.save();

    return res
      .location(`${Utilities.getBaseURL(req)}/schedule/${schedule.ScheduleID}`)
      .status(200)
      .send(schedule);
  } catch (error) {
    console.error("Error in modify schedule:", error);
    res.status(500).send({ error: "Server error updating Schedule." });
  }
};
