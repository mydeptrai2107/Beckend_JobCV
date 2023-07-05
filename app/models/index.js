const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.account = require("./account.model.js")(mongoose);

db.company = require("./company.model.js")(mongoose);
db.companyAccount = require("./company.account.model.js")(mongoose);
db.companyAttribute = require("./company.attribute.model.js")(mongoose);
db.companyValue = require("./company.value.model.js")(mongoose);

db.user = require("./user.model.js")(mongoose);
db.userAccount = require("./user.account.model.js")(mongoose);
db.userProfile = require("./user.profile.model.js")(mongoose);

db.city = require("./city.model.js")(mongoose);
db.district = require("./district.model.js")(mongoose);
db.ward = require("./ward.model.js")(mongoose);
db.addressInfo = require("./address.info.model.js")(mongoose);

db.recruitment = require("./recruitment.model.js")(mongoose);
db.recruitmentAttribute = require("./recruitment.attribute.model.js")(mongoose);
db.recruitmentValue = require("./recruitment.value.model.js")(mongoose);
db.likeRecruitment = require("./like.recruitment.model.js")(mongoose);
db.likeCompany = require("./like.company.model.js")(mongoose);

db.apply = require("./apply.model.js")(mongoose);

db.commentRate = require("./comment.rate.model.js")(mongoose);

db.config = require("./config.model.js")(mongoose);

module.exports = db;