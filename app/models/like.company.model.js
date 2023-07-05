module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            company_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Company',
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

    const LikeCompany = mongoose.model("like_company", schema);
    return LikeCompany;
};