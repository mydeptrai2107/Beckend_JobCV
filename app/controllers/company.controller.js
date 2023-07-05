const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const db = require("../models");

const Company = db.company;
const CompanyAccount = db.companyAccount;
const CompanyAttribute = db.companyAttribute;
const CompanyValue = db.companyValue;
const LikeCompany = db.likeCompany;
const CommentRate = db.commentRate;

const DIR_IMAGE = 'static/image/';

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

exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();

        if (!companies) {
            return res.status(404).send({ message: "No companies found" });
        }

        const CompanyList = await Promise.all(
            companies.map(async (company) => {
                const totalSaved = await LikeCompany.countDocuments({ company_id: company.id, is_saved: true});
                const withItems = {
                    company,
                    totalSaved,
                };
                return withItems;
            })
        ); 
    
        res.status(200).json(CompanyList);
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;

        const company = await Company.findById(companyId);
        const attributes = await CompanyAttribute.find({ company_id: companyId });
        const attributeIds = attributes.map(attribute => attribute.id);
        const values = await CompanyValue.find({ company_attribute_id: { $in: attributeIds } });

        if (!company) {
            return res.status(404).send({ message: "Company not found" });
        }

        const companyData = {
            company: company,
            attributes: attributes,
            values: values
        };

        res.status(200).send(companyData);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};



exports.getCompanyByName = async (req, res) => {
    try {
        const companyName = req.params.name;

    // Tạo biểu thức chính quy từ tên công ty nhập vào
    const regex = new RegExp(companyName, "i");

    // Sử dụng biểu thức chính quy trong truy vấn tìm kiếm
    const companies = await Company.find({ name: regex });

    if (companies.length === 0) {
      return res.status(404).send({ message: "Company not found" });
    }

    res.status(200).send(companies);
      } catch (error) {
        res.status(500).json({ message: 'Failed to search companies.', error: error.message });
      }
};

exports.updateCompany = async (req, res) => {
    try {
      uploadImage.single('avatar')(req, res, async (err) => {
        if (err) {
          console.error(err);
          return res.status(400).send({ message: err.message });
        }
  
        // Check if the company exists
        const company = await Company.findById(req.params.id);
        if (!company) {
          return res.status(404).send({ error: `Company with id ${req.params.id} not found` });
        }
  
        // Update fields
        company.name = req.body.name || company.name;
        company.contact = req.body.contact || company.contact;
        company.info = req.body.info || company.info;
        company.intro = req.body.intro || company.intro;
  
        // Update the avatar field if a new file was uploaded
        if (req.file) {
          company.avatar = req.file.filename;
        }
  
        company.address = req.body.address || company.address;
        
        await company.save();
        res.status(200).send(company);
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "An error occurred while processing your request." });
    }
  };
  
exports.deleteCompanyById = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedCompany = await Company.findByIdAndDelete(id);

        if (!deletedCompany) {
            return res.status(404).send({ message: "Company not found" });
        }

        res.status(200).send({ message: "Company deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.addAttributeValue = async (req, res) => {
    try {
        if (!req.body.name || !req.body.value) {
            return res.status(400).send({ message: "Attribute name and value is required." });
        }
        const attribute = req.body.name.toLocaleLowerCase().replace(" ", "_");
        const companyId = req.params.id;

        const newCompanyAttribute = new CompanyAttribute({
            company_id: companyId,
            attribute: attribute,
            name: req.body.name,
        });
        const savedCompanyAttribute = await newCompanyAttribute.save();

        const newCompanyValue = new CompanyValue({
            attribute_id: savedCompanyAttribute.id,
            value: req.body.value,
        });
        const savedCompanyValue = await newCompanyValue.save();

        return res.json({ savedCompanyAttribute, savedCompanyValue });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.updateAttributeValue = async (req, res) => {
    try {
        const companyId = req.params.id;
        const attributeId = req.params.attributeid;
        var companyAttribute;
        var companyValue;
        if (req.body.name) {
            companyAttribute = await CompanyAttribute.findById(attributeId);
            if (!companyAttribute) {
                return { error: `Company attribute with id ${attributeId} not found` };
            }
            const attribute = req.body.name.toLocaleLowerCase().replace(" ", "_");
            companyAttribute.attribute = attribute;
            companyAttribute.name = req.body.name;
            await companyAttribute.save();
        }
        if (req.body.value) {
            companyValue = await CompanyValue.findOne({ attribute_id: attributeId });
            if (!companyValue) {
                return { error: `Company value with attribute id ${attributeId} not found` };
            }
            companyValue.value = req.body.value;
            await companyValue.save();
        }

        return res.json({ companyAttribute, companyValue });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.deleteAttributeValue = async (req, res) => {
    try {
        const companyId = req.params.id;
        const attributeId = req.params.attributeid;

        const deletedCompanyValue = await CompanyValue.findOneAndDelete({ attribute_id: attributeId });
        const deletedCompanyAttribute = await CompanyAttribute.findByIdAndDelete(attributeId);

        if (!deletedCompanyValue || !deletedCompanyAttribute) {
            return res.status(404).send({ message: "Company Attribute and Value not found" });
        }

        res.status(200).send({ message: "Company deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.actionCompany = async (req, res) => {
    try {
        if (!req.body.userId || !req.body.comid){
            return res.status(400).send({ message: "User Id or Company Id can not be empty!" });
        }
        const companyId = req.body.comid;
        const userId = req.body.userId;
        const like = req.body.like;
        const is_saved = req.body.is_saved;

        const actionCompany = await LikeCompany.findOne({company_id: companyId, user_id: userId});

        if (actionCompany) {
            if (like && actionCompany.is_like) {
                actionCompany.is_like = false;
            } else if (like && !actionCompany.is_like) {
                actionCompany.is_like = true;
            }
            if (is_saved && actionCompany.is_saved) {
                actionCompany.is_saved = false;
            } else if (is_saved && !actionCompany.is_saved) {
                actionCompany.is_saved = true;
            }
            await actionCompany.save();
            res.status(200).send(actionCompany);
        } else {
            const newLikeCompany = new LikeCompany({
                company_id: companyId,
                user_id: userId,
                is_like: like,
                is_saved: is_saved
            });
    
            const saveAction = await newLikeCompany.save();
            res.status(200).send(saveAction);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.comanyByUserSaved = async (req, res) => {
    try {
        const userId = req.params.uid;
        const listCompanyId = await LikeCompany.find({user_id: userId, is_saved: true}).distinct('company_id');
        const listCompany = await Company.find({_id: { $in: listCompanyId }});
        res.status(200).send(listCompany);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.IdcomanyByUserSaved = async (req, res) => {
    try {
        const userId = req.params.uid;
        const listCompanyId = await LikeCompany.find({user_id: userId, is_saved: true}).distinct('company_id');
        res.status(200).send(listCompanyId);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.getCommentRate = async (req, res) => {
    try {
        const cid = req.params.cid;

        const listCommentRate = await CommentRate.find({company_id: cid});
        
        res.status(200).send(listCommentRate);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};