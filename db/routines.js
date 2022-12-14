const {client} = require('./index');

// FNs
async function createRoutine({ creatorId, isPublic, name, goal }) {
    try {
      const {
        rows: [routine]
      } = await client.query(
        `
        INSERT INTO routines("creatorId", "isPublic", "name", "goal") 
        VALUES($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
      `,
        [creatorId, isPublic, name, goal]
      );
  
      return routine;
    } catch (error) {
      throw error;
    }
  }

// FN
async function getRoutineById(id) {
    try {
      const {
        rows: [routine],
      } = await client.query(
        `
        SELECT *
        FROM routines
        WHERE id=$1
      `,
        [id]
      );
  
      return routine;
    } catch (error) {
      throw error;
    }
  }

// FN getRoutinesWithoutActivities
async function getRoutinesWithoutActivities() {
    try {
      const { rows } = await client.query(
        `
      SELECT *
      FROM routines;
    `
      );
      if (!rows) {
        return null;
      }
      return rows;
    } catch (error) {
      throw error;
    }
  }

// FN getAllRoutines
async function attachActivitiesToRoutines(routines) {
  // no side effects
  const routinesToReturn = [...routines];
  const binds = routines.map((_, index) => `$${index + 1}`).join(', ');
  const routineIds = routines.map(routine => routine.id);
  if (!routineIds?.length) return [];
  
  try {
    // get the activities, JOIN with routine_activities (so we can get a routineId), and only those that have those routine ids on the routine_activities join
    const { rows: activities } = await client.query(`
      SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
      FROM activities 
      JOIN routine_activities ON routine_activities."activityId" = activities.id
      WHERE routine_activities."routineId" IN (${ binds });
    `, routineIds);

    // loop over the routines
    for(const routine of routinesToReturn) {
      // filter the activities to only include those that have this routineId
      const activitiesToAdd = activities.filter(activity => activity.routineId === routine.id);
      // attach the activities to each single routine
      routine.activities = activitiesToAdd;
    }
    return routinesToReturn;
  } catch (error) {
    throw error;
  }
}
async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id 
    `);
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error
  }
}

// FN getALlPublicRoutines
async function getAllPublicRoutines() {
    try {
      const { rows } = await client.query(
        `
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId"=users.Id
        WHERE "isPublic"=true
      `
      );
  
      return rows;
    } catch (error) {
      throw error;
    }
  }

// FN getAllRoutinesByUser
async function getAllRoutinesByUser({ username }) {
    try {
      const { rows } = await client.query(
        `
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId"=users.Id
        WHERE username=$1;
      `,
        [username]
      );
  
      return (rows);
    } catch (error) {
      throw error;
    }
  }

// FN getPublicRoutinesByUser: almost same as above
async function getPublicRoutinesByUser({ username }) {
    try {
      const { rows } = await client.query(
        `
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId"=users.Id
        WHERE "isPublic"=true AND username=$1;
      `,
        [username]
      );
    return rows;
      // return attachActivitiesToRoutines(rows);
    } catch (error) {
      throw error;
    }
  }
// FN getPublicRoutinesByActivity: almost same as above
async function getPublicRoutinesByActivity({ id }) {
    try {
      const { rows } = await client.query(
        `
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId"=users.Id
        JOIN routine_activities ON routine_activities."routineId"=routines.id
        WHERE "isPublic"=true AND routine_activities."activityId"=$1;
      `,
        [id]
      );
  
      return (rows);
    } catch (error) {
      throw error;
    }
  }

// FN updateRoutine;  review
async function updateRoutine(id, fields = {}) {
    const setString = Object.keys(fields)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(", ");
  
    if (setString.length === 0) {
      return;
    }
  
    try {
      const {
        rows: [routine],
      } = await client.query(
        `
        UPDATE routines
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
        Object.values(fields)
      );
  
      return routine;
    } catch (error) {
      throw error;
    }
  }

// FN destroyRoutine
async function destroyRoutine(id) {
    await client.query(
      `
      DELETE FROM "routine_activities"
      WHERE "routineId"=$1
    `,
      [id]
    );
  
    await client.query(
      `
      DELETE FROM routines
      WHERE id=$1
    `,
      [id]
    );
  }

// Exports
  module.exports = {
    createRoutine,
    getRoutineById,
    getRoutinesWithoutActivities,
    getAllRoutines,
    getAllPublicRoutines,
    getAllRoutinesByUser,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    destroyRoutine,
    updateRoutine
  };

  // Requirements
