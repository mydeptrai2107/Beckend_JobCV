module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            first_name: {
                type: String,
            },
            last_name: {
                type: String,
            },
            phone: {
                type: String,
            },
            gender: {
                type: String,
            },
            avatar: {
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

    const User = mongoose.model("user", schema);
    return User;
};