const { db } = require("../db");
const Utilities = require("./Utilities");
const { uuidv7 } = require("uuidv7");

// --------------------------- GET ALL ---------------------------
exports.getAll = async (req, res) => {
  try {
    const schedules = await db.schedule.findAll();
    res.status(200).send(schedules);
  } catch (error) {
    console.error("Error in getAll schedule:", error);
    res.status(500).send({
      error: "Server error fetching Schedule list.",
      details: error.message,
    });
  }
};

// --------------------------- GET BY ID ---------------------------
exports.getByID = async (req, res) => {
  try {
    const id = req.params.ScheduleID;

    // 1. KASUTA: db.worker (mitte db.shifts)
    // 2. KASUTA: as: "ScheduleWorkers" (täpselt nagu db.js-is)
    const schedule = await db.schedule.findByPk(id, {
      include: [
        {
          model: db.worker,
          as: "ScheduleWorkers",
          attributes: ["FirstName", "LastName"],
          through: { attributes: [] }, // Peidab vahetabeli info
        },
      ],
    });

    if (!schedule) {
      return res
        .status(404)
        .send({ error: `Schedule with ID ${id} was not found.` });
    }
    res.status(200).send(schedule);
  } catch (error) {
    console.error("Error in getByID schedule:", error);
    res
      .status(500)
      .send({
        error: "Server error fetching Schedule.",
        details: error.message,
      });
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
      .status(201)
      .location(
        `${Utilities.getBaseURL(req)}/schedule/${createdSchedule.ScheduleID}`
      )
      .json(createdSchedule);
  } catch (error) {
    console.error("Error in create schedule:", error);
    res
      .status(500)
      .send({
        error: "Server error creating Schedule.",
        details: error.message,
      });
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

    schedule.ScheduleName = ScheduleName || schedule.ScheduleName;
    schedule.StartDate = StartDate || schedule.StartDate;
    schedule.EndDate = EndDate || schedule.EndDate;

    await schedule.save();
    return res.status(200).send(schedule);
  } catch (error) {
    console.error("Error in modify schedule:", error);
    res.status(500).send({ error: "Server error updating Schedule." });
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
