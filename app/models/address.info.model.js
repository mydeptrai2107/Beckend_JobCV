module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            account_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Account',
            },
            city_code: {
                type: String,
            },
            district_code: {
                type: String,
            },
            ward_code: {
                type: String,
            },
            street: {
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

    const AddressInfo = mongoose.model("address_info", schema);
    return AddressInfo;
};