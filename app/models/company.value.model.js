module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            attribute_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CompanyAttribute',
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

    const CompanyValue = mongoose.model("company_value", schema);
    return CompanyValue;
};