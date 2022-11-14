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
    const { activity } = fields;
    delete fields.tags;
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');
    try {
        if(setString.length > 0) {
            await client.query(`
            UPDATE activities
            SET ${setString}
            WHERE name=${name}, description=${description}
            RETURNING *;
            `, Object.values(fields));
        }
        if (activity === undefined) {
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