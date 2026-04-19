const Joi = require('joi');

// Schema validation cho việc tạo user
const createUserSchema = Joi.object({
  name: Joi.string()
    .required()
    .trim()
    .min(2)
    .max(100)
    .messages({
      'string.empty': 'Tên không được để trống',
      'string.min': 'Tên phải có ít nhất {#limit} ký tự',
      'string.max': 'Tên không được vượt quá {#limit} ký tự',
      'any.required': 'Tên là bắt buộc',
    }),
  email: Joi.string()
    .required()
    .email()
    .trim()
    .messages({
      'string.empty': 'Email không được để trống',
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc',
    }),
  password: Joi.string()
    .required()
    .min(6)
    .max(50)
    .messages({
      'string.empty': 'Password không được để trống',
      'string.min': 'Password phải có ít nhất {#limit} ký tự',
      'string.max': 'Password không được vượt quá {#limit} ký tự',
      'any.required': 'Password là bắt buộc',
    }),
  // address: Joi.object({
  //   street: Joi.string().trim().allow(''),
  //   city: Joi.string().trim().allow(''),
  //   country: Joi.string().trim().allow(''),
  // }).optional(),
  // languages: Joi.array()
  //   .items(Joi.string())
  //   .optional(),
  // bio: Joi.string()
  //   .optional()
  //   .allow(''),
});

module.exports = {
  createUserSchema
};