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
} = require('./activities');
const {
  createRoutine,
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  updateRoutine,
  destroyRoutine

} = require('./routines');

// Step 2: User Methods
    // Method: dropTables
    async function dropTables() {
        try {
          console.log("Starting to drop tables...");
      
          await client.query(`
            DROP TABLE IF EXISTS routines;
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
      CREATE TABLE routines (
        id SERIAL PRIMARY KEY,
        "creatorId" INTEGER REFERENCES users(Id),
        "isPublic" BOOLEAN DEFAULT false,
        name VARCHAR(255) UNIQUE NOT NULL,
        goal TEXT NOT NULL
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

async function createInitialRoutines() {
  console.log("starting to create routines...");

  const routinesToCreate = [
    {
      creatorId: 1,
      isPublic: false,
      name: "Cardio Day",
      goal: "Get that heart pumping by any means necessary.",
    },
    {
      creatorId: 1,
      isPublic: true,
      name: "Arm Day",
      goal: "Your arms will feel like noodles; Bench presses, pushups, and lifts.",
    },
    {
      creatorId: 2,
      isPublic: false,
      name: "Leg Day",
      goal: "Come here chicken leg, lets get buff; Squats, leg presses, & more",
    },
    {
      creatorId: 2,
      isPublic: true,
      name: "Ab Day",
      goal: "Let's get that six pack; Planks, pull ups, & more ",
    },
  ];

  const routines = await Promise.all(
    routinesToCreate.map((routine) => createRoutine(routine))
  );
  console.log("Routines Created: ", routines);
  console.log("Finished creating Routines.");
}


// Method: testDB
async function testDB() {
    try {
        console.log("Calling getUsers");
        const user = await getUser();
        console.log("Result:", user);

        console.log("Calling getAllActivities");
        const activity = await getAllActivities();
        console.log("Result:", activity)

        console.log("Calling updateActivities", activity[0]);
        const updateActivityResult = await updateActivity(activity[0].id, {
          name: 'Joggin',
          description: 'Lightly run for a mile'
        });
        console.log("Result:", updateActivityResult);


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
      await createInitialRoutines();
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error;
    }
  }


rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
