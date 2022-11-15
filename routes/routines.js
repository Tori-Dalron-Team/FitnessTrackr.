const express =  require("express");
const routineRouter = express.Router();
const {
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
} = require('../db/routines');


// GET /api/routines
routineRouter.get('/', async (req, res, next) => {
    try {
        const response = await getAllRoutines();
        res.send(response);
    } catch (error) {
        console.log(error);
    }
});
// POST /api/routines
routineRouter.post('/', async (req,res,next) => {
    try {
        const routineBU = await getRoutineByUser(name);

        if (routineBU) {
        next({
            name: "PreExistingRoutineError",
            message: `Routine name ${routineBU.name} already exists!`,
            error: "Error! ",
        });
        }
        const routine = await createRoutine({
        name,
        goal,
        isPublic
        });
    res.send(routine);
    } catch ({ name, message }) {
    next({ name, message });
    }
});

// PATCH /api/routines/:routineId
routineRouter.patch("/:routineId", async (req, res, next) => {
    try {
        const { routineId } = req.params;
        const { name, goal } = req.body;

        const updateRole = {};

        updateRole.id = routineId;

        if (name) {
            updateRole.name = name;
        } if (goal) {
        updateRole.goal = goal;
    
        } if (!(await getRoutineById(routineId))) {
            next({
                name: "RoutineNotFoundError",
                message: `Routine named ${rouitneId} not found`,
                error: "Error! ",
            });
        } if (await getPublicRoutinesByUser(name)) {
            next({
                name: "RoutineAlreadyMade",
                message: `A Routine with the name ${name} already exists`,
                error: "Error! ",
            });
        } else {
            const response = await updateRoutine(updateRole);
            
            if (response) {
            res.send(response);
            } else {
            next({
                name: "NoFieldsToUpdate",
                message: `Enter a name or goal to update.`,
                error: "Error! ",
            });
        }
    }
    } catch (error) {
    next(error);
    }
});

// DELETE /api/routines/:routineId
routineRouter.delete('/:routineId',  async (req, res, next) => {

    try {
    const routine = await getRoutineById(req.params.routineId);
    if (routine && routine.creatorId.id === req.creatorId.id) {
        const updatedRoutine = await updateRoutine(routine.id, { isPublic: false });
        res.send({ routine: updatedRoutine });
    } else {
        next(routine ? {
        name: "UnauthorizedCreatorError",
        message: "You cannot delete a post which is not yours"
        } : {
        name: "RoutineNotFoundError",
        message: "That Routine does not exist"
        });
    }

    } catch ({ name, message }) {
    next({ name, message })
    }
});

// POST /api/routines/:routineId/activities

routineRouter.post('/:routineId/activities', async (req, res, next) => {
    const { activityId } = req.params
    try {
    const routine = await getPublicRoutinesByActivity(activityId);
    res.send({ routine })
    } catch ({ name, message }) {
        next({ name, message });
    }
});

module.exports = { routineRouter };