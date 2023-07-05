module.exports = app => {
    const apply = require("../controllers/apply.controller.js");
  
    var router = require("express").Router();

    // create apply
    router.post("/", apply.createApply);

    // get apply by user id
    router.get("/uid/:uid", apply.getListApplyByUserId);

    // get apply by recruiment id
    router.get("/rid/:rid", apply.getListApplyByRecruitmentId);

     // get apply by company id
     router.get("/cid/:cid", apply.getListApplyByCompanyId);

    // get apply by id
    router.get("/:id", apply.getApplyById);

    router.put("/update", apply.updateStatusApply);

    router.get('/status/:status', apply.getApplyByStatus);

    app.use("/api/apply", router);
  };
  