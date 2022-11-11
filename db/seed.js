// Step 1: Import Client & Exports
const client = require('./client');
const { rebuildDB } = require('./seedData');

// Step 2: User Methods
    // Method: dropTables
    async function dropTables() {
        try {
          console.log("Starting to drop tables...");
      
          await client.query(`
            DROP TABLE IF EXISTS users;
          `);
      
          console.log("Finished dropping tables!");
        } catch (error) {
          console.error("Error dropping tables!");
          throw error;
        }
      }

    // Method: createTables
async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
      );
    `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

// Method: rebuildDB
async function rebuildDB() {
    try {
      client.connect();
  
      await createTables();
      await dropTables();
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error;
    }
  }