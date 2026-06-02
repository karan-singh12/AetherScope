import Joi from 'joi';
import { strongPassword } from '../common.validator';


const sharedEmail = Joi.string().email().lowercase();

// User Signup Schema
export const userSignupSchema = Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    email: sharedEmail.required(),
    password: strongPassword.required(),
}).messages({
    'object.missing': 'Name, email, and password are required.',
});

// User Login Schema
export const userLoginSchema = Joi.object({
    email: sharedEmail.required(),
    password: Joi.string().required(),
}).messages({
    'object.missing': 'Email and password are required.',
});

// User Edit Profile Schema
export const userEditProfileSchema = Joi.object({
    nickname: Joi.string().min(3).max(100).optional(),
    email_address: sharedEmail.optional(),
    language: Joi.string().max(10).optional(),
});

// User Forgot Password Schema
export const userForgotPasswordSchema = Joi.object({
    email_address: sharedEmail.optional(),
    email: sharedEmail.optional(),
})
    .or('email_address', 'email')
    .messages({
        'object.missing': 'Email address is required.',
    });

// User Reset Password Schema
export const userResetPasswordSchema = Joi.object({
    email_address: sharedEmail.optional(),
    email: sharedEmail.optional(),
    otp: Joi.string().required().messages({
        'any.required': 'OTP is required.',
    }),
    newPassword: strongPassword.required(),
})
    .or('email_address', 'email')
    .messages({
        'object.missing': 'Email address is required.',
    });

// User Change Password Schema
export const userChangePasswordSchema = Joi.object({
    oldPassword: Joi.string().required().messages({
        'any.required': 'Old password is required.',
    }),
    newPassword: strongPassword.required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'New password and confirm password must match.',
        'any.required': 'Confirm password is required.',
    }),
});

// User Verify Email Schema
export const userVerifyEmailSchema = Joi.object({
    email_address: sharedEmail.optional(),
    email: sharedEmail.optional(),
    otp: Joi.string().required().messages({
        'any.required': 'OTP is required.',
    }),
})
    .or('email_address', 'email')
    .messages({
        'object.missing': 'Email address is required.',
    });

// User Resend OTP Schema
export const userResendOtpSchema = Joi.object({
    email_address: sharedEmail.optional(),
    email: sharedEmail.optional(),
})
    .or('email_address', 'email')
    .messages({
        'object.missing': 'Email address is required.',
    });

// User Resend Verify Mail Schema
export const userResendVerifyMailSchema = Joi.object({
    email_address: sharedEmail.optional(),
    email: sharedEmail.optional(),
})
    .or('email_address', 'email')
    .messages({
        'object.missing': 'Email address is required.',
    });
