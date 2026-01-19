// Middleware to check if user is authenticated
exports.requireAuth = async (req, res, next) => {
  if (!req.session || !req.session.UserID) {
    return res
      .status(401)
      .send({ error: "Authentication required. Please log in." });
  }

  // Optionally verify user still exists
  try {
    const { db } = require("../db");
    const user = await db.users.findByPk(req.session.UserID);
    if (!user) {
      req.session.destroy();
      return res
        .status(401)
        .send({ error: "User not found. Please log in again." });
    }
    req.user = user; // Attach user to request for use in routes
    next();
  } catch (error) {
    console.error("Error in requireAuth:", error);
    return res
      .status(500)
      .send({ error: "Server error checking authentication." });
  }
};

// Middleware to check if user is admin
exports.requireAdmin = async (req, res, next) => {
  // First check if authenticated
  if (!req.session || !req.session.UserID) {
    return res
      .status(401)
      .send({ error: "Authentication required. Please log in." });
  }

  try {
    const { db } = require("../db");
    const user = await db.users.findByPk(req.session.UserID);

    if (!user) {
      req.session.destroy();
      return res
        .status(401)
        .send({ error: "User not found. Please log in again." });
    }

    if (!user.IsAdmin) {
      return res.status(403).send({
        error:
          "Admin access required. You don't have permission to perform this action.",
      });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    console.error("Error in requireAdmin:", error);
    return res
      .status(500)
      .send({ error: "Server error checking admin status." });
  }
};
