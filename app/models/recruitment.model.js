module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            company_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Company',
            },
            title: {
                type: String,
              },
            salary: {
                type: String,
              },
              deadline: {
                type: Date,
              },
              workingForm: {
                type: String,
              },
              numberOfRecruits: {
                type: String,
              },
              gender: {
                type: String,
              },
              experience: {
                type: String,
              },
              position: {
                type: String,
              },
              address: {
                type: String,
              },
              descriptionWorking: {
                type: String,
              },
              request: {
                type: String,
              },
              benefit: {
                type: String,
              },
              statusShow: {
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

    const Recruitment = mongoose.model("recruitment", schema);
    return Recruitment;
};