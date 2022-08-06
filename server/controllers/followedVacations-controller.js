const express = require("express");
const router = express.Router();
const followedVacationsLogic = require("../logic/followedVacations-logic");

router.post("/", async (request, response, next) => {
    // Extracting the JSON from the packet's BODY

    let followedVacationData = request.body;
    try {
        await followedVacationsLogic.addVacationIdToFollowedVacations(followedVacationData);
        response.json('followed');
    } catch (e) {
        return next(e);
    }
})
router.delete("/:id", async (request, response, next) => {
    // extracting the data from the url
    let paramsData = request.params.id.substring(1);
    let paramsArray = paramsData.split(',');
    let token = paramsArray[0];
    let vacationId = paramsArray[1];

    try {
        await followedVacationsLogic.deleteVacationIdFromFollowedVacations(vacationId, token)
        response.json("unFollowed");
    }
    catch (e) {
        return next(e);
    }
})
module.exports = router;