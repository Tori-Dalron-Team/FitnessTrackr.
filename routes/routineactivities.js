const express = require("express");
const { getRoutineById } = require("../db/routines");
const routineActivitiesRouter = express.Router();

const {
    addActivitiyToRoutine,
    canEditRoutineActivity,
    destroyRoutineActivity,
    getRoutineActivityById,
    updateRoutineActivity,
    

} = require("../db/routine_activities");
    // double check this when Tori is finished

// PATCH /routine_activities/:routineActivityId (**)
routineActivitiesRouter.patch("/:routineActivityId",  async (req, res, next) => {
    const { count, duration } = req.body;
    const id = req.params.routineActivityId;
    console.log("this is id", id)
    console.log("this is req.user", req.user)
    try {
        // const routineActivity = await getRoutineActivityById(id);
        // const routine = await getRoutineById(routineActivity.routineId);
        const canEdit = await canEditRoutineActivity(id, req.user.id)
        console.log("cant we edit?", canEdit)
        if (!canEdit) {
            console.log("we can not updated")
            next({ name: "Not allowed to Update! " });

        } else {
            console.log("we can update")
            const updatedRoutineActivity = await updateRoutineActivity(id, {count, duration});
            
        if (updatedRoutineActivity) {
            res.send(updatedRoutineActivity);
        } else {
            next({ name: "Routine not available! " });
        }
    }
    } catch (error) {
    console.error(error);
    }
}
);

// DELETE /routine_activities/:routineActivityId (**)
routineActivitiesRouter.delete('/:routineActivityId', async (req, res, next) => {
    const { routineActivityId } = req.params;

    try {
        const routineActivity = await getRoutineActivityById(routineActivityId);
        const routine = await getRoutineById(routineActivity.routineId);

        if (req.user.id === routine.creatorId) {
            const destroyActivity = await destroyRoutineActivity(routineActivityId);
            res.send(destroyActivity);
        } else {
            next({ message: "Error: Only the creator can delete a routine"});
        }
    } catch ({ message }) {
        next({ message });
    }}
);

// Export
module.exports = {routineActivitiesRouter};