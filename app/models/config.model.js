module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            name: {
                type: String,
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

    const Config = mongoose.model("config", schema);
    return Config;
};