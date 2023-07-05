const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const db = require("../models");
const User = db.user;
const UserAccount = db.userAccount;
const UserProfile = db.userProfile;
const CommentRate = db.commentRate;

const DIR = 'static/cv/';
const DIR_IMAGE = 'static/image/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = uuidv4() + '-' + file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter : (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            return cb(new Error('Only .pdf format allowed!'), false);
        }
        cb(null, true);
    }
});

const uploadPDF = multer({
    storage: storage,
    fileFilter : (req, file, cb) => {
        // if (file.mimetype === 'application/pdf') {
        //     return cb(new Error('Only .pdf format allowed!'), false);
        // }
        cb(null, true);
    }
});

const storageImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR_IMAGE);
    },
    filename: (req, file, cb) => {
        const fileName = uuidv4() + '-' + file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName);
    }
});

const uploadImage = multer({
    storage: storageImage,
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

exports.createProfile = async (req, res) => {
    try {
        // Check id and name in body
        if (req.body.name === null) {
            return res.status(400).send({ message: "User name is required." });
        }

        uploadPDF.single('pdf')(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(400).send({ message: err.message });
            }

            // Create a new profile
            const profile = new UserProfile({
                user_id: req.params.user_id,
                name: req.body.name,
                path_cv: req.file ? req.file.filename : null
            });

            const savedProfile = await profile.save();
            res.status(201).send(savedProfile);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.getUserProfilesByUserId = async (req, res) => {
    try {
        const profiles = await UserProfile.find({ user_id: req.params.user_id });
        res.status(200).send(profiles);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.getUserProfileById = async (req, res) => {
    try {
        const profile = await UserProfile.findById(req.params.id);
        if (!profile) {
            return res.status(404).send({ message: "Profile not found." });
        }
        res.status(200).send(profile);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        var updatedProfile;
        uploadPDF.single('pdf')(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(400).send({ message: err.message });
            }

            // Update the user profile document with the new path_cv field value
            req.body.path_cv = req.file ? req.file.filename : null;

            // updatedProfile = await UserProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
            updatedProfile = await UserProfile.findById(req.params.id);

            if (!updatedProfile) {
                return res.status(404).send({ message: "Profile not found." });
            }

            updatedProfile.path_cv = req.body.path_cv ? req.body.path_cv : updatedProfile.path_cv;
            updatedProfile.name = req.body.name ? req.body.name : updatedProfile.name;
            await updatedProfile.save();

            res.status(200).send(updatedProfile);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.deleteUserProfile = async (req, res) => {
    try {
        const deletedProfile = await UserProfile.findByIdAndDelete(req.params.id);

        if (!deletedProfile) {
            return res.status(404).send({ message: "Profile not found." });
        }

        res.status(200).send({ message: "Profile deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        if (!users) {
            return res.status(404).send({ message: "No users found" });
        }

        res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.updateUser = async (req, res) => {
    try {
        upload.single('avatar')(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(400).send({ message: err.message });
            }

            // Update the user document with the new avatar field value
            req.body.avatar = req.file ? req.file.filename : null;
            var user = await User.findById(req.params.id);
            if (!user) {
                return { error: `User with id ${req.params.id} not found` };
            }

            // Update fields
            user.first_name = req.body.first_name || user.first_name;
            user.last_name = req.body.last_name || user.last_name;
            user.phone = req.body.phone || user.phone;
            user.gender = req.body.gender || user.gender;
            user.avatar = req.body.avatar || user.avatar;

            await user.save();
            res.status(200).send(user);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};


exports.deleteUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.commentRate = async (req, res) => {
    try {
        const uid = req.params.uid;
        
        const newCommentRate = new CommentRate({
            company_id: req.body.cid,
            user_id: uid,
            comment: req.body.comment,
            rate: req.body.rate
        });

        const saveNewCommentRate = await newCommentRate.save();
        res.status(200).send(saveNewCommentRate);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};