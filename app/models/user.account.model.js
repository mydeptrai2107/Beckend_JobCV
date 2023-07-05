module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            account_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Account',
            },
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const UserAccount = mongoose.model("user_account", schema);
    return UserAccount;
};