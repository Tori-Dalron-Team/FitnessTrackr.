const {client} = require("./index");
const bcrypt = require("bcrypt");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const result = await client.query(`
      INSERT INTO users( username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, password]
    );

    return result
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

async function getUser() {
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


// Initial Data
// INSERT INTO users( username, password) 
// VALUES($1, $2,) 
// ON CONFLICT (username) DO NOTHING 
// RETURNING *;