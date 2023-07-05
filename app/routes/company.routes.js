module.exports = app => {
    const company = require("../controllers/company.controller.js");
  
    var router = require("express").Router();
  
    // get all companies
    router.get("/", company.getAllCompanies);

    // get company
    router.get("/:id", company.getCompanyById);

    // get company
    router.get("/search/:name", company.getCompanyByName);

    // Update company
    router.put("/:id", company.updateCompany);

    // Delete company 
    router.delete("/:id", company.deleteCompanyById);

    // create company attribute and value
    router.post("/:id/attribute", company.addAttributeValue);

    // Update company attribute and value
    router.put("/:id/attribute/:attributeId", company.updateAttributeValue);

    // Delete company attribute and value
    router.delete("/:id/attribute/:attributeId", company.deleteAttributeValue);

    // Like
    router.post("/action" , company.actionCompany);

    // List saved
    router.get("/saved/:uid" ,company.comanyByUserSaved);

    // List Id saved
    router.get("/IdSaved/:uid" , company.IdcomanyByUserSaved);
    
    // get comment
    router.get("/:cid/comment", company.getCommentRate);

    app.use("/api/company", router);
  };
  