const db = require("../models");
const Apply = db.apply;
const UserProfile = db.userProfile;
const Recruitment = db.recruitment;
const Company = db.company;

exports.createApply = async (req, res) => {
    try {
        const {user_id, user_profile_id, recruitment_id, company_id, comment } = req.body;
        status_apply = 1;

        // Create a new Apply document using the Apply model
        const newApply = new Apply({
            user_id,
            user_profile_id,
            recruitment_id,
            company_id,
            comment,
            status_apply
        });

        // Save the new document to the database
        const savedApply = await newApply.save();

        res.status(200).json(savedApply);
    } catch (error) {
        console.error('Error creating apply:', error);
        res.status(500).json({ error: 'Failed to create apply' });
    }
};

exports.updateStatusApply = async (req, res) => {
    try {
      const { applyId, newStatus } = req.body;
  
      // Tìm đối tượng Apply dựa trên applyId
      const apply = await Apply.findById(applyId);
  
      if (!apply) {
        return res.status(404).json({ error: 'Không tìm thấy đối tượng Apply' });
      }
  
      apply.status_apply = newStatus; // Cập nhật trường status_apply với giá trị mới
  
      const updatedApply = await apply.save(); // Lưu các thay đổi vào cơ sở dữ liệu
  
      res.status(200).json(updatedApply);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái Apply:', error);
      res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái Apply' });
    }
}; 

exports.getApplyByStatus = async (req, res) => {
    try {
      const { status } = req.params;
  
      // Tìm các đối tượng Apply dựa trên trường status_apply
      const applies = await Apply.find({ status_apply: status });
  
      res.status(200).json(applies);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách Apply:', error);
      res.status(500).json({ error: 'Lỗi khi lấy danh sách Apply' });
    }
  };

exports.getListApplyByUserId = async (req, res) => {
    try {
        const user_id = req.params.uid;

        const profiles = await UserProfile.find({ user_id: user_id });

        const profileIds = profiles.map(profile => profile.id);

        // Find all apply documents that match the user_profile_id
        const applies = await Apply.find({ user_profile_id: { $in: profileIds } });

        res.status(200).json(applies);
    } catch (error) {
        console.error('Error getting applies:', error);
        res.status(500).json({ error: 'Failed to get applies' });
    }
};

exports.getListApplyByRecruitmentId = async (req, res) => {
    try {
        const recruitment_id = req.params.rid;

        // Find all apply documents that match the recruitment_id
        const applies = await Apply.find({ recruitment_id });

        res.status(200).json(applies);
    } catch (error) {
        console.error('Error getting applies:', error);
        res.status(500).json({ error: 'Failed to get applies' });
    }
};

exports.getListApplyByCompanyId = async (req, res) => {
    try {
        const company_id = req.params.cid;

        // Find all apply documents that match the recruitment_id
        const applies = await Apply.find({ company_id: company_id });

        res.status(200).json(applies);
    } catch (error) {
        console.error('Error getting applies:', error);
        res.status(500).json({ error: 'Failed to get applies' });
    }
};


exports.getApplyById = async (req, res) => {
    try {
        const applyId = req.params.id;

        // Find the apply document that matches the provided ID
        const apply = await Apply.findById(applyId);

        if (!apply) {
            return res.status(404).json({ error: 'Apply not found' });
        }

        const userProfile = await UserProfile.findById(apply.user_profile_id);
        if (!userProfile) {
            return res.status(404).json({ error: 'userProfile not found' });
        }

        const recruitment = await Recruitment.findById(apply.recruitment_id);
        if (!recruitment) {
            return res.status(404).json({ error: 'recruitment not found' });
        }

        const applyData = {
            apply: apply,
            userProfile: userProfile,
            recruitment: recruitment
        }

        res.status(200).json(applyData);
    } catch (error) {
        console.error('Error getting apply:', error);
        res.status(500).json({ error: 'Failed to get apply' });
    }
};