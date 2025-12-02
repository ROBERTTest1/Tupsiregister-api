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
exports.getByID = async (req, res) => {
  const tups = await getTups(req, res);
  if (!tups) {
    return res.status(404).send({ error: "Tups not found" });
  }
  return res.status(200).send(tups);
};

exports.create = async (req, res) => {
  if (
    !req.body.Name ||
    !req.body.Description ||
    !req.body.Brand ||
    !req.body.Strength
  ) {
    return res.status(400).send({
      error: "Missing some parameter, please review your request data.",
    });
  }
  const newTups = {
    TupsID: UUID.v7(),
    Name: req.body.Name,
    Description: req.body.Description,
    Brand: req.body.Brand,
    Strength: req.body.Brand,
  };
  const createdTups = await db.tups.create(newTups);
  return res
    .location(`${Utilities.getBaseURL(req)}/tups/${createdTups.TupsID}`)
    .sendStatus(201);
};

const getTups = async (req, res) => {
  const idNumber = req.params.TupsID;
  console.log(idNumber);
  //if(isNaN(idNumber)) {
  //res.status(400).send({error:`Entered id is not valid ${idNumber}`})
  //return null;
  //}
  const tups = await db.tups.findByPk(idNumber);
  if (!tups) {
    res
      .status(404)
      .send({ Error: `Tups with this id was not found ${idNumber}` });
    return null;
  }
  return tups;
};
