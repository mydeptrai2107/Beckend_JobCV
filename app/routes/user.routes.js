module.exports = app => {
    const user = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // create user profile
    router.post("/:user_id/profile", user.createProfile);

    // Get list user profile
    router.get("/:user_id/profiles", user.getUserProfilesByUserId);

    // Get user profile
    router.get("/profile/:id", user.getUserProfileById);

    // Update user profile
    router.put("/profile/:id", user.updateUserProfile);

    // Delete user profile
    router.delete("/profile/:id", user.deleteUserProfile);

    // Update user
    router.put("/:id", user.updateUser);

    // Get user
    router.get("/:id", user.getUserById);

    // Get all users
    router.get("/", user.getAllUsers);

    // Delete user 
    router.delete("/:id", user.deleteUserById);

    // cmt 
    router.post("/:uid/comment", user.commentRate);

    app.use("/api/user", router);
  };
  