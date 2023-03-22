const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require("../modules/userModule");
const catchAsync = require("../utils/catchAsync"); 
const AppError =  require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => jwt.sign({id}, process.env.JWT_SECRET , { expiresIn: `${process.env.JWT_EXPIRES_IN}`})

exports.signup = catchAsync(async (req , res, next) => {
    const newUser = await User.create({
        name: req.body.name ,
        email: req.body.email ,
        password: req.body.password ,
        passwordConfirm: req.body.passwordConfirm,  
        passwordChangedAt: req.body.passwordChangedAt,  
        role:req.body.role,
        passwordResetToken: req.body.passwordResetToken,
        passwordResetExpires:req.body.passwordResetExpires
    });

    const token = signToken(newUser._id)

    res.status(201).json({
        status:'success',
        token,
        data: {
            user: newUser
        }
    })
})

exports.login = catchAsync(async (req , res, next) => {
    const {email , password} = req.body;

    // 1) check if email and password exist
    if(!email || !password) return next(new AppError('please provide email and password!' , 400));

    // 2) check if user & password is correct
    const user = await User.findOne({email}).select('+password');
    const correct = await user.correctPassword(password, user.password);

    if(!user || !correct) return next(new AppError('incorrect email or password', 401));

    // 3) if everything is okay, send token
    const token = signToken(user._id);
    res.status(201).json({
        status:'success',
        token
    })
}); 

exports.protect = catchAsync(async (req , res, next) => {
    // 1) getting token and check of it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) return next(new AppError('you are not logged in! please log in to get access', 401));

    // 2) verification token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('decoded' , decoded)

    // 3) check user if still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) return next(new AppError('the user be login to this token does no longer exist.', 401));

    // 4) check if user changed password after the token was issued
    if(currentUser.changePasswordAfter(decoded.iat)) return next(new AppError('user recently changed the password!. please log in again', 401));

    // GREAT ACCESS TO PROTECTED ROUTE
    req.user = currentUser
    next(); 
})

exports.restrictTo = (...roles) => (req , _, next) => {
    if(!roles.includes(req.user.role)) {
        return next(new AppError('you do not have permission to perform this action.', 403));
    }

    next();
}

exports.forgetPassword = catchAsync(async (req , res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({email: req.body.email});

    if(!user) return next(new AppError('There is no user with email address.', 404));

    // 2) Generate the random reset token 
    const resetToken = user.createPasswordResetToken();
    // va
    await user.save({validateBeforeSave: false});
    
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `forget your password? submit a patch request with your new password and passwordConfirm to : ${resetURL} \n if you didn't forget your password, please ignore this email`;

   try {
        await sendEmail({
            email:user.email,
            subject: 'your password reset token valid for 10 min',
            message
        });

        res.status(200).json({
            status:'success',
            message: 'token sent to email!'
        })

   } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    user.save({validateBeforeSave: true});
    return next(new AppError('there was an error sending the email. try again later!', 500))
   }
});
exports.resetPassword = catchAsync(async (req , res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
     .createHash('sha256')
     .update(req.params.token)
     .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });
    console.log(user);

    // 2) if token has not expired, and there is user, set the new password
    if (!user) return next(new AppError('Token is invalid or has expired', 400));

    // 3) update changedPasswordAt property for the user
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    // 4) log the user in, send JWT
    const token = signToken(user._id);
    res.status(201).json({
        status:'success',
        token
    })
});