module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            company_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Company',
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

    const CompanyAttribute = mongoose.model("company_attribute", schema);
    return CompanyAttribute;
};