const { db } = require("../db");
const Utilities = require("./Utilities");

exports.newSession = async (req, res) => {
  console.log(req.body);
  if (
    req.body.LoginEmail === undefined ||
    req.body.LoginPassword === undefined
  ) {
    var missingparams = "";
    if (!req.body.LoginEmail) {
      missingparams += " No email provided. ";
    }
    if (!req.body.LoginPassword) {
      missingparams += " No password provided. ";
    }
    return res
      .status(400)
      .send({ error: "Missing parameter for logging in" + missingparams });
  }

  const LoginEmail = req.body.LoginEmail;
  console.log(LoginEmail);
  const userToProvideSessionFor = await db.users.findOne({
    where: { EmailAddress: LoginEmail },
  });
  if (!userToProvideSessionFor) {
    return res.status(404).send({ error: "User not found" });
  }

  const isCorrect = await Utilities.letMeIn(
    req.body.LoginPassword,
    userToProvideSessionFor.PasswordHASH
  );
  if (!isCorrect) {
    return res.status(401).send({ error: "Password mismatch" });
  }
  req.session.UserID = userToProvideSessionFor.UserID;

  return res.status(200).send({
    UserID: userToProvideSessionFor.UserID,
    DisplayName: userToProvideSessionFor.DisplayName,
    EmailAddress: userToProvideSessionFor.EmailAddress,
    IsAdmin: userToProvideSessionFor.IsAdmin,
  });
};

// --------------------------- GET CURRENT SESSION ---------------------------
exports.getCurrentSession = async (req, res) => {
  try {
    // Check if session exists
    if (!req.session || !req.session.UserID) {
      return res.status(401).send({ error: "No active session" });
    }

    const user = await db.users.findByPk(req.session.UserID, {
      attributes: { exclude: ["PasswordHASH"] },
    });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    return res.status(200).send({
      UserID: user.UserID,
      DisplayName: user.DisplayName,
      EmailAddress: user.EmailAddress,
      IsAdmin: user.IsAdmin,
    });
  } catch (error) {
    console.error("Error in getCurrentSession:", error);
    return res.status(500).send({ error: "Server error fetching session." });
  }
};

// --------------------------- LOGOUT ---------------------------
exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send({ error: "Error logging out." });
    }
    return res.status(200).send({ message: "Logged out successfully." });
  });
};
