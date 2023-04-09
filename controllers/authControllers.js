const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require("../modules/userModule");
const catchAsync = require("../utils/catchAsync"); 
const AppError =  require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => jwt.sign({id}, process.env.JWT_SECRET , { expiresIn: `${process.env.JWT_EXPIRES_IN}`});

const createAndSendToken = (user, status, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        secure: true,
        httpOnly: true,
        sameSite:'lax',
    }

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    // REMOVE USER FROM DATA 
    user.password = undefined;

    res.status(status).json({
        status:'success',
        token,
        data: {
            user
        }
    })
}

exports.signup = catchAsync(async (req , res, next) => {
    // Generate the random activity token 
    const activityToken = crypto.randomBytes(32).toString('hex');

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/activityAccount/${activityToken}`;
    const message = `please activity your account from this link : \n ${resetURL} `;

    try {
        await sendEmail({
            email:req.body.email,
            subject: 'activity your account',
            message
        });

    } catch(err) {
        return next(new AppError('there was an error sending the activity email. try again later!', 500))
    }

    const newUser = await User.create({
        name: req.body.name ,
        email: req.body.email ,
        password: req.body.password ,
        passwordConfirm: req.body.passwordConfirm,  
        passwordChangedAt: req.body.passwordChangedAt,  
        role:req.body.role, // any user can add role so take look again at this point
        passwordResetToken: req.body.passwordResetToken,
        passwordResetExpires:req.body.passwordResetExpires,
        activityToken:activityToken
    });

    createAndSendToken(newUser, 200, res);
});

exports.activityUser = catchAsync(async (req , res, next) => {
    const user = await User.findOne({ activityToken: req.params.token , active: false }).select('+active');

    if (!user) {
        return next(new AppError('Invalid or expired activation token', 400));
    }

    user.active = true;
    user.activityToken = undefined;

    await user.save();
    res.status(200).json({
        message:'your account activity successful.'
    })
})

exports.login = catchAsync(async (req , res, next) => {
    const {email , password} = req.body;

    // 1) check if email and password exist
    if(!email || !password) return next(new AppError('please provide email and password!' , 400));

    // 2) check if user & password is correct
    const user = await User.findOne({email}).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) if everything is okay, send token
    createAndSendToken(user, 200, res);
}); 

exports.protect = catchAsync(async (req , _, next) => {
    // 1) getting token and check of it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) return next(new AppError('you are not logged in! please log in to get access', 401));

    // 2) verification token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded' , decoded)

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
    user.passwordConfirm = req.body.passwordConfirm;

    // 4) Validate that password and passwordConfirm match
    if (user.password !== user.passwordConfirm) {
        return next(new AppError("Passwords do not match", 400));
    }

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    // 5) log the user in, send JWT
    createAndSendToken(user, 200, res)
});
// {token: req.body.token}
exports.updatePassword = catchAsync(async(req , res, next) => {
    console.log(req.user)
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    console.log(user)
    // 2) Check if POSTed current password is correct
    const correctPassword = await user.correctPassword(req.body.passwordCurrent, user.password);
    if(!correctPassword) return next(new AppError('your current password is wrong.', 401));

    // 3) if so, update password
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save()

    // 4) log user in, send JWT
    createAndSendToken(user, 200, res)
});

