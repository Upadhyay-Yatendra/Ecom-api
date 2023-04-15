// THIS IS THE VALIDATION FILE 
//  this file contains all validations for different collctions

const Joi = require('@hapi/joi');
//  creating validation for user when he/she registers
const registerValidation = (data) => {

    const schema = Joi.object({
        name: Joi.string()
            .min(5)
            .required(),
        email: Joi.string()
            .min(11)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required(),
        admin: Joi.boolean()
            .optional(),
        suspended: Joi.boolean()
            .optional(),
        reason: Joi.string()
            .min(3)
            .optional()
    });
    return schema.validate(data);
}

//  creating validation for user when he/she logs in
const loginValidation = (data) => {
    const schema = Joi.object({

        email: Joi.string()
            .min(11)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    });
    return schema.validate(data);
}

//  creating validation for products when admin adds a new product
const productValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(5)
            .required()
            .max(20),
        description: Joi.string()
            .min(20)
            .max(100)
            .required(),
        image: Joi.string()
            .required(),
        price: Joi.number()
            .required()
            .min(100)
            .max(1000000)

    });
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.productValidation = productValidation;