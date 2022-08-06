const express = require("express");
const router = express.Router();
const vacationsLogic = require("../logic/vacations-logic");

router.get("/", async (request, response, next) => {
    try {
        let vacations = await vacationsLogic.getAllVacations();
        response.json(vacations);
    }
    catch (e) {
        return next(e)
    }
});
router.get("/enrich", async (request, response, next) => {
    // updating vacation data accourding to token given from the client
    let token = request.headers.authorization;
    try {
        let vacationsIdArray = await vacationsLogic.enrichVacationsByUserId(token);
        response.json(vacationsIdArray);
    } catch (e) {
        return next(e)
    }

})
router.get("/:id", async (request, response, next) => {
    try {
        let id = request.body;
        let vacation = await vacationsLogic.getVacationById(id);
        response.json(vacation);
    }
    catch (e) {
        return next(e)
    }
});

router.delete("/:id", async (request, response, next) => {
    let id = request.params.id.substring(1);
    try {

        await vacationsLogic.deleteVacation(id)
        response.json("deleted")
    }
    catch (e) {
        return next(e)
    }
});

router.post("/", async (request, response, next) => {
    let vacationData = request.body;

    try {
        await vacationsLogic.addVacation(vacationData)
        response.json("vacation added");
    }
    catch (e) {
        return next(e)
    }
});
router.put("/:id", async (request, response, next) => {
    let vacationUpdateData = request.body;
    let vacationId = request.params.id.substring(1);
    try {
        await vacationsLogic.updateVacation(vacationUpdateData, vacationId)
        response.json('updated vacation')

    } catch (e) {
        return next(e)
    }

})


module.exports = router;