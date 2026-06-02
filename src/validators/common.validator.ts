import Joi from 'joi';

/**
 * Final Password Rules:
 * Minimum length: 6 characters
 * Maximum length: 15 characters
 * Special characters: Allowed
 * Must contain at least 1 letter (a–z or A–Z)
 * Must contain at least 1 number (0–9)
 * Passwords that are all numeric are not allowed
 */
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}|\\:;"'<>,.?/]{6,15}$/;

export const strongPassword = Joi.string()
    .pattern(PASSWORD_REGEX)
    .messages({
        'string.pattern.base':
            'Password must be 6–15 characters long, include at least one letter and one number. Special characters are allowed.',
    });
