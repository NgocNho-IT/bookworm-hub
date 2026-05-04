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
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .strip()
    .messages({
      'any.only': 'Mật khẩu nhập lại không khớp',
      'string.empty': 'Confirm password không được để trống',
      'any.required': 'Confirm password là bắt buộc'
    })
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

// Schema validation cho việc đăng nhập
const loginSchema = Joi.object({
  name: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'Tên không được để trống',
      'any.required': 'Tên là bắt buộc',
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password không được để trống',
      'any.required': 'Password là bắt buộc',
    }),
});

module.exports = {
  createUserSchema,
  loginSchema
};