
const { client }= require('./index');
const { getRoutineById } = require('./routines')
const { getActivitiesById } = require('./activities');
const { getUserById } = require('./users');


async function getRoutineActivityById(id) {
    try {
            const { rows: [ id ] } = await client.query(`
                SELECT id
                FROM "routine_activities"
                WHERE id=$1;
                `, [id]
            );
            
                if (!id) {
                return null
                }
            
                id.routineId.activityId = await getRoutineActivityById(id);
            
                return id;
            } catch (error) {
                throw error;
            }
    };
async function createRoutineActivity(  
    routineId,
    activityId,
    count,
    duration
    ) {
        try {
        const { rows: [routineActivity] } = await client.query(`
        INSERT INTO "routine_activities"("routineId", "activityId", count, duration)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT ("routineId", "activityId") DO NOTHING
        RETURNING *;
        `, [routineId, activityId, count, duration]);
        console.log(routineActivity)
        return routineActivity;
    } catch (error) {
        console.log(error)
    }
    }

async function addActivityToRoutine({
    routineId,
    activityId,
    count,
    duration
}) {
    try {
        const routine =  await getRoutineById(routineId);
        const activity = await getActivitiesById(activityId)
        console.log("this is the activity", activity)
        console.log("this is the routine", routine)
        } catch (error) {
            console.error(error.detail);
        }
    }



async function getRoutineActivitiesByRoutine({id}) {
    try {
        const { rows: [routine] } = await client.query(`
        SELECT * 
        FROM "routine_activities"
        WHERE id=$1;
        `[id]);
        return routine;
    } catch (error) {
        console.log(error)
    }
};

async function updateRoutineActivity (id, fields = {}) {
    const { activityId, routineId, duration, count } = fields;
    delete fields.id;
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');
    
    
        try {
        if(setString.length > 0) {
            const { rows } = await client.query(`
            UPDATE "routine_activities"
            SET ${ setString }
            WHERE id=${ id }
            RETURNING *;
        `, Object.values(fields));
        return rows;
        }
        if (fields === undefined) {
            return await getRoutineActivityById(id);
        }
    } catch(error){
        console.log(error)
    }
}

async function destroyRoutineActivity(id) {
    try {
        await client.query(`
        DELETE FROM "routine_activities"
        WHERE "routineId"=$1;
        `, [id])
    } catch (error) {
        console.log(error)
    }
}

async function canEditRoutineActivity(routineActivityId, userId) {
    try {
        const confirmUser = await getUserById(id);
        if (confirmUser == routineActivityId) {
            return true;
        } else { 
            return false;
        }
    } catch (error) {
        console.error(error.details)
    }
};

module.exports = {
    getRoutineActivityById,
    addActivityToRoutine,
    getRoutineActivitiesByRoutine,
    updateRoutineActivity,
    destroyRoutineActivity,
    canEditRoutineActivity,
    createRoutineActivity
};