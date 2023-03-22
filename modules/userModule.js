const mongoose =  require('mongoose');
const validator =  require('validator');
const bcrypt =  require('bcrypt');
const crypto =  require('crypto');

const userScheme = new mongoose.Schema({
    name:{
        type:String,
        require:[true, 'please tell us your name!'],
    },
    email:{
        type: String,
        require:[true, 'please provide your email!'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail, 'please provide a valid email!']
    },
    password:{
        type: String,
        require:[true, 'please provide password'],
        minLength:8,
        select:false
    },
    passwordConfirm:{
        type: String,
        require:[true, 'please confirm your password'],
        validate: {
            // this is only works on create and save!!
            validator: function(el) {
                return el === this.password;
            },
            message: "passwords are not the same"
        }
    },
    photo:{
        type: String,
    },
    role: {
        type: String,
        enum:['user', 'guide', 'lead-guide', 'admin'],
        default:'user'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires:Date
})

userScheme.pre('save' , async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
});

userScheme.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userScheme.methods.changePasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000 , 10);
        console.log(changedTimestamp, JWTTimestamp)
        return JWTTimestamp < changedTimestamp
    }
    return false;
}

userScheme.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
     .createHash('sha256')
     .update(resetToken)
     .digest('hex');

     console.log({resetToken , passwordResetToken: this.passwordResetToken})

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    
    return resetToken;
}

const User = mongoose.model('User' , userScheme);

module.exports = User