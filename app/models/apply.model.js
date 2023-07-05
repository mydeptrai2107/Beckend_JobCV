module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            user_profile_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'UserProfile',
            },
            recruitment_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Recruitment',
            },
            company_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Company',
            },
            comment: {
                type: String,
            },
            status_apply: {
                type: Number,
            }
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Apply = mongoose.model("apply", schema);
    return Apply;
};