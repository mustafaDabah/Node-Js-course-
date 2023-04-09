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
    passwordResetExpires:Date,
    activityToken: {
        type:String,
        require:[true , 'there is something wrong in activity Token'],
        // select: false
    },
    active:{
        type: Boolean,
        default: false,
        select: false
    }
})

// ) Make crypto to password and remove passwordConfirm 
userScheme.pre('save' , async function(next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(12); // generate a salt

    this.password = await bcrypt.hash(this.password, salt);
    this.passwordConfirm = undefined;

    next();
});

// ) Check password is correct or not (Login)
userScheme.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

// ) Check password was changed before or not (protect)
userScheme.methods.changePasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000 , 10);
        // console.log(changedTimestamp, JWTTimestamp)
        return JWTTimestamp < changedTimestamp
    }
    return false;
}

// ) Make reset token password (forgetPassword)
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

// ) to set passwordChangedAt query
userScheme.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next()
});

// ) don't return active query false
// userScheme.pre(/^find/, function(next) {
//     this.find({active: {$ne: false}});
//     next();
// })

const User = mongoose.model('User' , userScheme);

module.exports = User