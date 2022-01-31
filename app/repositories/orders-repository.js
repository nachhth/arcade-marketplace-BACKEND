"use strict";

const getPool = require("../infrastructure/database-infrastructure");

async function findAllOrdersByProductId(idProduct) {
  const pool = await getPool();
  const sql = "SELECT * FROM orders WHERE idProduct = ?";
  const [orders] = await pool.query(sql, idProduct);

  return orders;
}

async function findAllOrdersByUserBuyerId(idUserBuyer) {
  const pool = await getPool();
  const sql = "SELECT * FROM orders WHERE idUserBuyer = ?";
  const [orders] = await pool.query(sql, idUserBuyer);

  return orders;
}

async function addOrder(purchaseOrder) {
  const pool = await getPool();
  const now = new Date();
  const {
    idUserBuyer,
    idProduct,
    orderSubject,
    orderMessage,
    orderTypeOfContact,
  } = purchaseOrder;
  const sql = `INSERT INTO orders(
      idUserBuyer,
      idProduct,
      orderDate,
      orderSubject,
      orderMessage,
      orderTypeOfContact
  ) VALUES(
    ?, ?, ?, ?, ?, ?
  )`;
  const [created] = await pool.query(sql, [
    idUserBuyer,
    idProduct,
    now,
    orderSubject,
    orderMessage,
    orderTypeOfContact,
  ]);

  return created.insertId;
}

async function acceptOrder(saleData, idProduct, idUserBuyer) {
  const pool = await getPool();
  const now = new Date();
  const { saleDate, saleLocation, saleMessage, saleTypeOfContact } = saleData;
  const sql = `
    UPDATE orders
      SET status = 'reservado',
        reservationDate = ?,
        saleDate = ?,
        saleLocation = ?,
        saleMessage = ?,
        saleTypeOfContact = ?
    WHERE idProduct = ? && idUserBuyer = ?
  `;
  const [updated] = await pool.query(sql, [
    now,
    saleDate,
    saleLocation,
    saleMessage,
    saleTypeOfContact,
    idProduct,
    idUserBuyer,
  ]);

  return updated.affectedRows === 1;
}

async function discardAllOtherOrders(idUserBuyer, idProduct) {
  const pool = await getPool();
  const sql = `
  UPDATE orders
    SET status = 'rechazado'
    WHERE NOT idUserBuyer = ? && idProduct = ?`;

  const [discarded] = await pool.query(sql, [idUserBuyer, idProduct]);

  return discarded.affectedRows === 1;
}

async function findOrderById(idOrder) {
  const pool = await getPool();
  const sql = `SELECT * FROM orders WHERE idOrder = ?`;
  const [order] = await pool.query(sql, idOrder);

  return order[0];
}

async function findOrderStatusByProductId(idProduct) {
  const pool = await getPool();
  const sql =
    "SELECT status FROM orders WHERE idProduct = ? AND status = 'reservado'";
  const [status] = await pool.query(sql, idProduct);

  return status[0];
}

module.exports = {
  findAllOrdersByProductId,
  findAllOrdersByUserBuyerId,
  addOrder,
  acceptOrder,
  discardAllOtherOrders,
  findOrderById,
  findOrderStatusByProductId,
};
