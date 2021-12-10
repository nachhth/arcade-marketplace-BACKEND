"use strict";

const getPool = require("../infrastructure/database-infrastructure");

async function findUserById(userId) {
  const pool = await getPool();
  const sql = "SELECT * FROM users WHERE idUser = ?";
  const [user] = await pool.query(sql, userId);
  return user[0];
}

async function createUser(user) {
  const pool = await getPool();
  const sql = `
    INSERT INTO users(
      nameUser, email, password, phone, 
      createdAt, verificationCode, role
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const { nameUser, email, passwordHash, phone, verificationCode } = user;
  const now = new Date();
  const [created] = await pool.query(sql, [
    nameUser,
    email,
    passwordHash,
    phone,
    now,
    verificationCode,
    "user",
  ]);

  return created.insertId;
}

async function findUserByEmail(email) {
  const pool = await getPool();
  const sql =
    "SELECT idUser, nameUser, email, role, password, verifiedAt FROM users WHERE email = ?";
  const [user] = await pool.query(sql, email);

  return user[0];
}

module.exports = {
  findUserById,
  createUser,
  findUserByEmail,
};