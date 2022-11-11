const client = require("./client");
const bcrypt = require("bcrypt");

// database functions

// user functions
async function createUser({ id, username, password }) {
  try {
    const { rows: [ user ] } = await client.query(`
      INSERT INTO users(id, username, password) 
      VALUES($1, $2, $3) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [id, username, password]);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT id, username, name
      FROM users
      WHERE id=$1;
    `,
      [userID]
    );

    if (!user) {
      return null
    }

    user.posts = await getUserById(userId);

    return user;
  } catch (error) {
    throw error;
    
  }
}

async function getUserByUsername(username) {
  try {
    const {rows: [ user ]} = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1;
`, [username]);

  return user;
    } catch (error) {
      throw error;
    }
}

async function getUser({ username, password }) {
  try {
    const { rows } = await client.query(`
      SELECT username, password
      FROM users;
    `)
    
    return rows;
  } catch (error) {
    throw(error);
  }

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}