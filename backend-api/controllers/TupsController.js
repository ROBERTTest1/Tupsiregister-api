const { db } = require("../db");
const Utilities = require("./Utilities");
const { uuidv7 } = require("uuidv7"); // UUID v7 generaator

// --------------------------- GET ALL ---------------------------
exports.getAll = async (req, res) => {
  try {
    const tups = await db.tups.findAll();
    res.status(200).send(
      tups.map(({ TupsID, Name, Brand }) => ({
        TupsID,
        Name,
        Brand,
      }))
    );
  } catch (error) {
    console.error("Error in getAll:", error);
    res.status(500).send({ error: "Server error fetching Tups list." });
  }
};

// --------------------------- GET BY ID ---------------------------
exports.getByID = async (req, res) => {
  const tups = await getTups(req, res);
  if (!tups) return; // getTups already sent response
  res.status(200).send(tups);
};

// --------------------------- CREATE ---------------------------
exports.create = async (req, res) => {
  try {
    const { Name, Description, Brand, Strength } = req.body;

    if (!Name || !Description || !Brand || !Strength) {
      return res.status(400).send({
        error: "Missing some parameter, please review your request data.",
      });
    }

    const newTups = {
      TupsID: uuidv7(),
      Name,
      Description,
      Brand,
      Strength,
    };

    const createdTups = await db.tups.create(newTups);

    return res
      .location(`${Utilities.getBaseURL(req)}/tups/${createdTups.TupsID}`)
      .sendStatus(201);
  } catch (error) {
    console.error("Error in create:", error);
    res.status(500).send({ error: "Server error creating Tups." });
  }
};

// --------------------------- DELETE ---------------------------
exports.deleteByID = async (req, res) => {
  try {
    const tupsToBeDeleted = await getTups(req, res);
    if (!tupsToBeDeleted) return; // getTups already handled 404

    await tupsToBeDeleted.destroy();
    return res.sendStatus(204); // No Content (must not include body)
  } catch (error) {
    console.error("Error in deleteByID:", error);
    res.status(500).send({ error: "Server error deleting Tups." });
  }
};

// --------------------------- HELPER FUNCTION ---------------------------
const getTups = async (req, res) => {
  try {
    const id = req.params.TupsID;

    const tups = await db.tups.findByPk(id);

    if (!tups) {
      res.status(404).send({ error: `Tups with ID ${id} was not found.` });
      return null;
    }

    return tups;
  } catch (err) {
    console.error("Error in getTups:", err);
    res.status(500).send({ error: "Server error fetching Tups." });
    return null;
  }
};
