import db from "../config/database.js";

const insertUserStmt = db.prepare(
  `INSERT INTO users (fullName, email, password) VALUES (@fullName, @email, @password)`
);

const findByEmailStmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
const findByIdStmt = db.prepare(
  `SELECT id, fullName, email, createdAt FROM users WHERE id = ?`
);

export const User = {
  /**
   * Creates a new user. `password` must already be hashed.
   * Returns the public (password-less) representation of the user.
   */
  create({ fullName, email, password }) {
    const result = insertUserStmt.run({ fullName, email, password });
    return findByIdStmt.get(result.lastInsertRowid);
  },

  /**
   * Returns the full row (including the hashed password) so callers
   * can compare it during login. Email lookup is case-insensitive.
   */
  findByEmail(email) {
    return findByEmailStmt.get(email.toLowerCase());
  },

  /**
   * Returns the public (password-less) representation of a user.
   */
  findById(id) {
    return findByIdStmt.get(id);
  },
};
