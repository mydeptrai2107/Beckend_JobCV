module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            attribute_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'RecruitmentAttribute',
            },
            value: {
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

    const RecruitmentValue = mongoose.model("recruitment_value", schema);
    return RecruitmentValue;
};