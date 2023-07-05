const db = require("../models");
const Company = db.company;
const CompanyAccount = db.companyAccount;
const CompanyAttribute = db.companyAttribute;
const CompanyValue = db.companyValue;
const Recruitment = db.recruitment;
const RecruitmentAttribute = db.recruitmentAttribute;
const RecruitmentValue = db.recruitmentValue;
const LikeRecruitment = db.likeRecruitment;

exports.createRecruitment = async (req, res) => {
    try {
        const { company_id, title, salary, deadline, workingForm, numberOfRecruits, gender, experience, position, address, descriptionWorking,
            request,
            benefit,statusShow } = req.body;
    
        // Tạo một đối tượng recruitment mới
        const recruitment = new Recruitment({
          company_id,
          title,
          salary,
          deadline,
          workingForm,
          numberOfRecruits,
          gender,
          experience,
          position,
          address,
          descriptionWorking,
          request,
          benefit,
          statusShow
        });
    
        // Lưu đối tượng recruitment vào cơ sở dữ liệu
        const createdRecruitment = await recruitment.save();
    
        res.status(201).json(createdRecruitment);
      } catch (error) {
        res.status(500).json({ message: 'Failed to create recruitment.', error: error.message });
      }
};

exports.getListRecruitment = async (req, res) => {
    try {
        // Fetch the list of recruitments from the database
        const recruitments = await Recruitment.find();

        const recruitmentList = await Promise.all(
            recruitments.map(async (recruitment) => {
                const totalLike = await LikeRecruitment.countDocuments({ recruitment_id: recruitment.id, is_saved: true });
                const withItems = {
                    recruitment,
                    totalLike,
                };
                return withItems;
            })
        );

        res.status(200).json(recruitmentList);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get list of recruitments.', error: error.message });
    }
};

exports.getListRecruitmentByCompanyId = async (req, res) => {
    try {
        const { companyId } = req.params;

        // Fetch the list of recruitments for the specified company ID from the database
        const recruitments = await Recruitment.find({ company_id: companyId });

        const recruitmentList = await Promise.all(
            recruitments.map(async (recruitment) => {
                const totalLike = await LikeRecruitment.countDocuments({ recruitment_id: recruitment.id, is_like: true });
                const withItems = {
                    recruitment,
                    totalLike,
                };
                return withItems;
            })
        );

        res.status(200).json(recruitmentList);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get list of recruitments by company ID.', error: error.message });
    }
};

exports.getRecruitmentById = async (req, res) => {
    try {
        const { recruitmentId } = req.params;

        // Find the recruitment by the specified ID in the database
        const recruitment = await Recruitment.findById(recruitmentId);

        if (!recruitment) {
            return res.status(404).json({ message: 'Recruitment not found.' });
        }

        const totalLike = await LikeRecruitment.countDocuments({ recruitment_id: recruitment.id, is_like: true });

        res.status(200).json({
            recruitment: recruitment,
            totalLike: totalLike,
          });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get recruitment by ID.', error: error.message });
    }
};


exports.getRecruitmentByName = async (req, res) => {
  try {
    const recruitmentName = req.params.name;

    // Tạo biểu thức chính quy từ tên tuyển dụng nhập vào
    const regex = new RegExp(recruitmentName, "i");

    // Sử dụng biểu thức chính quy trong truy vấn tìm kiếm
    const recruitments = await Recruitment.find({ title: regex, statusShow : trueđi });

    if (recruitments.length === 0) {
      return res.status(404).send({ message: "Recruitment not found" });
    }

    const recruitmentList = await Promise.all(
        recruitments.map(async (recruitment) => {
            const totalLike = await LikeRecruitment.countDocuments({ recruitment_id: recruitment.id, is_like: true });
            const withItems = {
                recruitment,
                totalLike,
            };
            return withItems;
        })
    );

    res.status(200).send(recruitmentList);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search recruitments.', error: error.message });
  }
};


exports.updateRecruitment = async (req, res) => {
    try {
        const { recruitmentId } = req.params;
        const { title, salary, deadline, workingForm, numberOfRecruits, gender, experience, position, address, descriptionWorking,
            request,
            benefit, statusShow } = req.body;

        // Find the recruitment by the specified ID in the database
        const recruitment = await Recruitment.findByIdAndUpdate(
            recruitmentId,
            { title, salary, deadline, workingForm, numberOfRecruits, gender, experience, position, address, descriptionWorking,
                request,
                benefit, statusShow },
            { new: true }
        );

        if (!recruitment) {
            return res.status(404).json({ message: 'Recruitment not found.' });
        }

        res.status(200).json(recruitment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update recruitment.', error: error.message });
    }
};

exports.deleteRecruitment = async (req, res) => {
    try {
        const { recruitmentId } = req.params;

        // Find the recruitment by the specified ID in the database and remove it
        const deletedRecruitment = await Recruitment.findByIdAndRemove(recruitmentId);

        if (!deletedRecruitment) {
            return res.status(404).json({ message: 'Recruitment not found.' });
        }

        res.status(200).json({ message: 'Recruitment deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete recruitment.', error: error.message });
    }
};

exports.addAttributeValue = async (req, res) => {
    try {
        if (!req.body.name || !req.body.value) {
            return res.status(400).send({ message: "Attribute name and value is required." });
        }
        const attribute = req.body.name.toLocaleLowerCase().replace(" ", "_");
        const recruitmentId = req.params.id;

        const newRecruitmentAttribute = new RecruitmentAttribute({
            recruitment_id: recruitmentId,
            attribute: attribute,
            name: req.body.name,
        });
        const savedRecruitmentAttribute = await newRecruitmentAttribute.save();

        const newRecruitmentValue = new RecruitmentValue({
            attribute_id: savedRecruitmentAttribute.id,
            value: req.body.value,
        });
        const savedRecruitmentValue = await newRecruitmentValue.save();

        return res.json({ savedRecruitmentAttribute, savedRecruitmentValue });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.updateAttributeValue = async (req, res) => {
    try {
        const recruitmentId = req.params.id;
        const attributeId = req.params.attributeid;
        var recruitmentAttribute;
        var recruitmentValue;
        if (req.body.name) {
            recruitmentAttribute = await RecruitmentAttribute.findById(attributeId);
            if (!recruitmentAttribute) {
                return { error: `Recruitment attribute with id ${attributeId} not found` };
            }
            const attribute = req.body.name.toLocaleLowerCase().replace(" ", "_");
            recruitmentAttribute.attribute = attribute;
            recruitmentAttribute.name = req.body.name;
            await recruitmentAttribute.save();
        }
        if (req.body.value) {
            recruitmentValue = await RecruitmentValue.findOne({ attribute_id: attributeId });
            if (!recruitmentValue) {
                return { error: `Recruitment value with attribute id ${attributeId} not found` };
            }
            recruitmentValue.value = req.body.value;
            await recruitmentValue.save();
        }

        return res.json({ recruitmentAttribute, recruitmentValue });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.deleteAttributeValue = async (req, res) => {
    try {
        const recruitmentId = req.params.id;
        const attributeId = req.params.attributeid;

        const deletedRecruitmentValue = await RecruitmentValue.findOneAndDelete({ attribute_id: attributeId });
        const deletedRecruitmentAttribute = await RecruitmentAttribute.findByIdAndDelete(attributeId);

        if (!deletedRecruitmentValue || !deletedRecruitmentAttribute) {
            return res.status(404).send({ message: "Recruitment Attribute and Value not found" });
        }

        res.status(200).send({ message: "Recruitment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.actionRecruitment = async (req, res) => {
    try {
        if (!req.body.userId || !req.body.rid){
            return res.status(400).send({ message: "User Id or Recruitment Id can not be empty!" });
        }
        const recruitmentId = req.body.rid;
        const userId = req.body.userId;
        const like = req.body.like;
        const is_saved = req.body.is_saved;

        const actionRecruitment = await LikeRecruitment.findOne({recruitment_id: recruitmentId, user_id: userId});

        if (actionRecruitment) {
            if (like && actionRecruitment.is_like) {
                actionRecruitment.is_like = false;
            } else if (like && !actionRecruitment.is_like) {
                actionRecruitment.is_like = true;
            }
            if (is_saved && actionRecruitment.is_saved) {
                actionRecruitment.is_saved = false;
            } else if (is_saved && !actionRecruitment.is_saved) {
                actionRecruitment.is_saved = true;
            }
            await actionRecruitment.save();
            res.status(200).send(actionRecruitment);
        } else {
            const newLikeRecruitment = new LikeRecruitment({
                recruitment_id: recruitmentId,
                user_id: userId,
                is_like: like,
                is_saved: is_saved
            });
    
            const saveAction = await newLikeRecruitment.save();
            res.status(200).send(saveAction);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.recruitmentByUserSaved = async (req, res) => {
    try {
        const userId = req.params.uid;
        const listRecruitmentId = await LikeRecruitment.find({user_id: userId, is_saved: true}).distinct('recruitment_id');
        const listRecruitment = await Recruitment.find({_id: { $in: listRecruitmentId }, statusShow : true});
        res.status(200).send(listRecruitment);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.IdrecruitmentByUserSaved = async (req, res) => {
    try {
        const userId = req.params.uid;
        const listRecruitmentId = await LikeRecruitment.find({user_id: userId, is_saved: true}).distinct('recruitment_id');
        res.status(200).send(listRecruitmentId);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};

exports.recruitmentByUserLike = async (req, res) => {
    try {
        const userId = req.params.uid;
        const listRecruitmentId = await LikeRecruitment.find({user_id: userId, is_like: true, }).distinct('recruitment_id');
        const listRecruitment = await Recruitment.find({_id: { $in: listRecruitmentId }});
        res.status(200).send(listRecruitment);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing your request." });
    }
};