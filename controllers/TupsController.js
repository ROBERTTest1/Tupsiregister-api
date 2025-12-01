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

exports.GetByID =
async (req, res) => {
  const film = await getTups(req, res);
  if (!tups) {return res.status(404).send({error: 'Tups not found'})}
  return res.status(200).send(tups)
}

const getTups = 
async (req, res) => {
  const idNumber =req.params.TupsID;
  console.log(idNumber)
  //if(isNaN(idNumber)) {
    //res.status(400).send({error:`Entered id is not valid ${idNumber}`})
    //return null;
  //}
  const tups = await db.tups.findByPk(idNumber)
  if(!tups) {
    res.status(404).send({Error: `Tups with this id was not found ${idNumber}`})
    return null;
  }
  return tups;
}

};
