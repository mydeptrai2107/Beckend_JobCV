module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            recruitment_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Recruitment',
            },
            attribute: {
                type: String,
            },
            name: {
                type: String,
            },
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const RecruitmentAttribute = mongoose.model("recruitment_attribute", schema);
    return RecruitmentAttribute;
};