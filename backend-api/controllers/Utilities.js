const { db } = require("../db");
const bcrypt = require("bcrypt");

exports.getBaseURL = (req) => {
  const protocol =
    req.connection && req.connection.encrypted ? "https" : "http";
  const host = req.headers.host || "localhost:8080";
  return `${protocol}://${host}`;
};

/**
 * Hash a password using bcrypt
 * @param {string} plainPassword - The plain text password to hash
 * @returns {Promise<string>} - The hashed password
 */
exports.hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
};

/**
 * Verify a password against a hash
 * @param {string} plainPassword - The plain text password to verify
 * @param {string} hash - The hashed password to compare against
 * @returns {Promise<boolean>} - True if password matches, false otherwise
 */
exports.letMeIn = async (plainPassword, hash) => {
  try {
    return await bcrypt.compare(plainPassword, hash);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};
