const {client} = require('./index')

async function createActivity({name,description}) {
    try {
        const newActivity = await client.query(`
        INSERT INTO activities(name, description)
        VALUES($1, $2)
        ON CONFLICT (name) DO NOTHING 
        RETURNING *;
        `, [name, description]);
        return newActivity;
    } catch (error) {
        console.log(error)
    }
    
};

async function updateActivity(activityToUpdate) {
    console.log("this is the activtiy update", activityToUpdate);

    const {id} = activityToUpdate;
    delete activityToUpdate.id;
    
    const setString = Object.keys(activityToUpdate).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');
        console.log("This is set string from updated activity:", setString);
    try {
        if(setString.length > 0) {
            const { rows } = await client.query(`
            UPDATE activities
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
            `, Object.values(activityToUpdate));
            return rows;
        } 
    
    } catch (error) {
        console.error(error.detail)
    }
};

async function getAllActivities() {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM activities;
        `);
        return rows;
    } catch (error) {
        console.log(error)
    }
};

async function getActivitiesById(activityId) {
    try {
        const { rows: [activity] } = await client.query(`
        SELECT * FROM activities
        WHERE id=${activityId};
        `);
        return activity ? activity : console.error("no activity found")
    
    } catch (error) {
        console.error(error.detail)
    }
};

async function getActivityByName(name) {
    try {
        const { rows: [activity] } = await client.query(`
        SELECT *
        FROM activities
        WHERE name=$1
        `, [name]);
        return activity;
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    createActivity,
    updateActivity,
    getAllActivities,
    getActivitiesById,
    getActivityByName
}