const express =  require("express");
const router = express.Router();

// Imports
const {
	createActivity,
    getAllActivities,
    getActivitiesById,
    getActivityByName,
	updateActivity,
} = require('../db/activities');

// API
    // getAllActivities-Correct
router.get("/", async (req, res, next) => {
    try {
      const response = await getAllActivities();
  
      res.send(response);
    } catch (error) {
      next(error);
    }
  });

    // POST/createActivity-Correct
router.post("/", async (req, res, next) => {
    try {
        const activityBN = await getActivityByName(name);
  
        if (activityBN) {
          next({
            name: "PreExistingActivityError",
            message: `Activity named ${activityBN.name} already exists!`,
            error: "Error! ",
          });
        }
        const activity = await createActivity({
          name,
          description,
        });
      res.send(activity);
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

  // Patch: Updating Activities-Correct
router.patch("/:activityId", async (req, res, next) => {
    try {
        const { activityId } = req.params;
        const { name, description } = req.body;

        const updateRole = {};

        updateRole.id = activityId;

        if (name) {
            updateRole.name = name;
        } if (description) {
        updateRole.description = description;
    
        } if (!(await getActivityById(activityId))) {
            next({
                name: "ActivityNotFoundError",
                message: `Activity named ${activityId} not found`,
                error: "Error! ",
            });
        } if (await getActivityByName(name)) {
            next({
                name: "ActivityAlreadyMade",
                message: `An activity with the name ${name} already exists`,
                error: "Error! ",
            });
        } else {
            const response = await updateActivity(updateRole);
            
            if (response) {
            res.send(response);
            } else {
            next({
                name: "NoFieldsToUpdate",
                message: `Enter a name or description to update.`,
                error: "Error! ",
            });
        }
    }
    } catch (error) {
      next(error);
    }
  });

// Export
module.exports = {router};