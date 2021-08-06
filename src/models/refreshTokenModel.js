import mongoose from 'mongoose'

const refreshTokenSchema = mongoose.Schema({
    user    : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    token   : { type: String, required: true },
    expires : { type: Date, required: true },
    created : { type: Date, default: Date.now }
})

refreshTokenSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret._v;
    }
});

refreshTokenSchema.statics.verifyExpiration = (token) => {
    return token.expires.getTime() < new Date().getTime();
  }


const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)

export default RefreshToken