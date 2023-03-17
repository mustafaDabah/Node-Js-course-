const jwt = require('jsonwebtoken');
const { promisify } =  require('util');
const User = require("../modules/userModule");
const catchAsync = require("../utils/catchAsync");
const AppError =  require('../utils/appError');

const signToken = (id) => jwt.sign({id}, process.env.JWT_SECRET , {
        expiresIn: `${process.env.JWT_EXPIRES_IN}`
    })

    // test

exports.signup = catchAsync(async (req , res, next) => {
    const newUser = await User.create({
        name: req.body.name ,
        email: req.body.email ,
        password: req.body.password ,
        passwordConfirm: req.body.passwordConfirm,  
        passwordChangedAt: req.body.passwordChangedAt,  
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