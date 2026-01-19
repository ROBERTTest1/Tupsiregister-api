const { db } = require("../db");
const Utilities = require("./Utilities");
const { uuidv7 } = require("uuidv7");

// --------------------------- SIGNUP/CREATE USER ---------------------------
exports.create = async (req, res) => {
  try {
    const { EmailAddress, Password, DisplayName, IsAdmin } = req.body;

    // Validation
    if (!EmailAddress || !Password || !DisplayName) {
      return res.status(400).send({
        error:
          "Missing required fields. EmailAddress, Password, and DisplayName are required.",
      });
    }

    // Check if user already exists
    const existingUser = await db.users.findOne({
      where: { EmailAddress },
    });

    if (existingUser) {
      return res.status(409).send({
        error: "User with this email already exists.",
      });
    }

    // Hash the password
    const PasswordHASH = await Utilities.hashPassword(Password);

    // Create new user
    const newUser = {
      UserID: uuidv7(),
      EmailAddress,
      PasswordHASH,
      DisplayName,
      IsAdmin: IsAdmin || false,
    };

    const createdUser = await db.users.create(newUser);

    // Don't send password hash back
    return res.status(201).send({
      UserID: createdUser.UserID,
      EmailAddress: createdUser.EmailAddress,
      DisplayName: createdUser.DisplayName,
      IsAdmin: createdUser.IsAdmin,
    });
  } catch (error) {
    console.error("Error in create user:", error);
    console.error("Error stack:", error.stack);
    res.status(500).send({
      error: "Server error creating user.",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// --------------------------- GET USER BY ID ---------------------------
exports.getByID = async (req, res) => {
  try {
    const id = req.params.UserID;
    const user = await db.users.findByPk(id, {
      attributes: { exclude: ["PasswordHASH"] }, // Don't send password
    });

    if (!user) {
      return res
        .status(404)
        .send({ error: `User with ID ${id} was not found.` });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error("Error in getByID user:", error);
    res.status(500).send({ error: "Server error fetching user." });
  }
};
