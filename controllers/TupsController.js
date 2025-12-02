const { db } = require("../db");
const Utilities = require("./Utilities");

exports.getAll = async (req, res) => {
  const tups = await db.tups.findAll();
  console.log("getAll: " + tups);
  res.status(200).send(
    tups.map(({ TupsID, Name, Brand }) => {
      return { TupsID, Name, Brand };
    })
  );
};
