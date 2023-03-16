const mongoose =  require('mongoose');
const validator =  require('validator');
const bcrypt =  require('bcrypt');

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
        minLength:0,
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
    passwordChangedAt: Date
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

const User = mongoose.model('User' , userScheme);

module.exports = User