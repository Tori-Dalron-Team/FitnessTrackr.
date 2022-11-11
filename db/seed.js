// Step 1: Import Client & Exports
// const client = require('./client');
const { create } = require('domain');
const { client } = require('./index');
const {
    createUser,
    getUser,
    getUserById,
    getUserByUsername
} = require ('./users');

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
      CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL
      );
    `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

    // Method: createInitialUsers
async function createInitialUsers() {
    console.log("Starting to create users")
    try {
        
        await createUser({
            username: 'Tori',
            password: 'ToriPassword'
        });

        await createUser({
            username: 'Dalron',
            password: 'DalronPassword'
        });

        console.log("Finished creating users");
    } catch (error) {
        console.error("Error when creating users");
        throw error;
        
    }
}

// Method: testDB
async function testDB() {
    try {
        console.log("Calling getUsers");
        const user = await getUser();
        console.log("Result:", user);

        // // create initial users test
        // console.log("Calling Create Initial Users")
        // const John
    } catch (error) {
        console.log("Error during testDB");
        throw error;
    }
}


// Method: rebuildDB
async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error;
    }
  }


rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
