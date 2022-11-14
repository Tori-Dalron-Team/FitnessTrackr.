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

async function updateActivity(id, fields = {}) {
    const { name, description } = fields;
    console.log("this is from the updated activity:", fields)
    delete fields.id;
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');
        console.log("This is set string from updated activity:", setString)
    try {
        if(setString.length > 0) {
            const { rows } = await client.query(`
            UPDATE activities
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
            `, Object.values(fields));
            return rows;
        } 
        if (fields === undefined) {
            return await getActivitiesById(activityId)
        }
    } catch (error) {
        console.log(error)
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
        const { rows: [name] } = await client.query(`
        SELECT * FROM activities
        WHERE id=${activityId};
        `);
        if (!name) {
            return null
        };
        return name;
    } catch (error) {
        console.log(error)
    }
};

async function getActivityByName(name) {
    try {
        const { rows: [name] } = await client.query(`
        SELECT *
        FROM activities
        WHERE name=$1
        `, [name]);
        return name;
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