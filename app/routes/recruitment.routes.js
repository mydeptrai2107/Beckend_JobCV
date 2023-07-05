module.exports = app => {
    const recruitment = require("../controllers/recruitment.controller.js");
  
    var router = require("express").Router();

    // create
    router.post("/", recruitment.createRecruitment);
  
    // get all recruitment
    router.get("/getAll", recruitment.getListRecruitment);

    // get list recruitment by company
    router.get("/comid/:companyId", recruitment.getListRecruitmentByCompanyId);

    // get recruitment
    router.get("/recrid/:recruitmentId", recruitment.getRecruitmentById);

    // get recruitment by name
    router.get("/search/:name", recruitment.getRecruitmentByName);

    // Update recruitment
    router.put("/:recruitmentId", recruitment.updateRecruitment);

    // Delete recruitment 
    router.delete("/:recruitmentId", recruitment.deleteRecruitment);

    // create recruitment attribute and value
    router.post("/:id/attribute", recruitment.addAttributeValue);

    // Update recruitment attribute and value
    router.put("/:id/attribute/:attributeId", recruitment.updateAttributeValue);

    // Delete recruitment attribute and value
    router.delete("/:id/attribute/:attributeId", recruitment.deleteAttributeValue);

    // Like
    router.post("/action" , recruitment.actionRecruitment);

    // List saved
    router.get("/saved/:uid" , recruitment.recruitmentByUserSaved);

    // List Id saved
    router.get("/IdSaved/:uid" , recruitment.IdrecruitmentByUserSaved);

    // List like
    router.get("/like" , recruitment.recruitmentByUserLike);

    app.use("/api/recruitment", router);
  };
  