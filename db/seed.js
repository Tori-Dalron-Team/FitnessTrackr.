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
const {
  createActivity,
  updateActivity,
  getAllActivities, 
  getActivitiesById,
  getActivityByName
} = require('./activities')

// Step 2: User Methods
    // Method: dropTables
    async function dropTables() {
        try {
          console.log("Starting to drop tables...");
      
          await client.query(`
            DROP TABLE IF EXISTS activities;
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
      CREATE TABLE activities(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL
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
};

async function createInitialActivities() {
  console.log("Starting to create activities")
  try {

    await createActivity({
      name: 'Running',
      description: 'Run for 1 mile'
    });

    await createActivity({
      name: 'Push Ups',
      description: '3 sets of 10 push ups'
    });

    console.log("Finished creating activities");
  } catch (error) {
    console.log(error)
  }
};

// Method: testDB
async function testDB() {
    try {
        console.log("Calling getUsers");
        const user = await getUser();
        console.log("Result:", user);

        console.log("Calling getAllActivities");
        const activity = await getAllActivities();
        console.log("Result:", activity)

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
      await createInitialActivities();
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error;
    }
  }


rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
