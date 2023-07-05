module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            email: {
                type: String,
                unique: true,
            },
            hash_password: {
                type: String,
            },
            account_type: {
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

    const Account = mongoose.model("account", schema);
    return Account;
};