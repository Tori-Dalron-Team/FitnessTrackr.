
const { client }= require('./index');
const { getRoutineById } = require('./routines')
const { getActivitiesById } = require('./activities');
const { getUserById } = require('./users');


async function getRoutineActivityById(id) {
    try {
            const { rows: [ routineActivity ] } = await client.query(`
                SELECT *
                FROM "routine_activities"
                WHERE id=$1;
                `, [id]
            );
            
                if (!routineActivity) {
                return null
                }
            
                
            
                return routineActivity;
            } catch (error) {
                console.error(error);
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
    // const { activityId, routineId, duration, count } = fields;
    if (fields.id) delete fields.id;
    const keys = Object.keys(fields)
    const setString = keys.map(
        (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');
    
    
        try {
        if(!!keys.length) {
            const { rows } = await client.query(`
            UPDATE "routine_activities"
            SET ${ setString }
            WHERE id=${ id }
            RETURNING *;
        `, Object.values(fields));
        return rows;
        }
        if (!keys.length) {
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
        const confirmUser = await getUserById(userId);
        const routineActivityConfirm = await getRoutineActivityById(routineActivityId)
        const routineConfirm = await getRoutineById(routineActivityConfirm.routineId)
        console.log("this is confirm user and routine", confirmUser, routineConfirm)
        if (confirmUser.id == routineConfirm.creatorId) {
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