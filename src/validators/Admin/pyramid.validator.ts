import Joi from "joi";

export const updatePyramidRoomSchema = Joi.object({
    roomId: Joi.number().integer().positive().required(),

    billingRatePerMinute: Joi.number()
        .min(0.1)
        .max(10.0)
        .custom((value, helpers) => {
            if (!/^\d+(\.\d{1})?$/.test(value.toString())) {
                return helpers.error("number.decimal");
            }
            return value;
        })
        .optional()
        .messages({
            "number.min": "Billing rate per minute must be at least 0.1",
            "number.max": "Billing rate per minute must not exceed 10.0",
            "number.decimal": "Billing rate per minute must have only one digit after the decimal (e.g., 0.1, 1.5, 10.0)",
            "number.base": "Billing rate per minute must be a valid number"
        }),

    isPinned: Joi.boolean().optional(),
});
