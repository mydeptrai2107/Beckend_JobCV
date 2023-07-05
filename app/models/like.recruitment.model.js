module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            recruitment_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Recruitment',
            },
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            is_like: {
                type: Boolean,
            },
            is_saved: {
                type: Boolean,
            },
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const LikeRecruitment = mongoose.model("like_recruitment", schema);
    return LikeRecruitment;
};