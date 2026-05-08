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


const currentYear = new Date().getFullYear();

const bookSchema = Joi.object({
    subject: Joi.string().trim().required().messages({
        'string.base': 'Tiêu đề sách phải là chuỗi ký tự',
        'string.empty': 'Tiêu đề sách không được để trống',
        'any.required': 'Vui lòng nhập tiêu đề sách'
    }),
    
    author: Joi.string().trim().required().messages({
        'string.base': 'Tên tác giả phải là chuỗi ký tự',
        'string.empty': 'Tên tác giả không được để trống',
        'any.required': 'Vui lòng nhập tên tác giả'
    }),
    
    publication_year: Joi.number().integer().min(1000).max(currentYear).optional().messages({
        'number.base': 'Năm xuất bản phải là một số',
        'number.min': 'Năm xuất bản không hợp lệ (nhỏ nhất là năm 1000)',
        'number.max': `Năm xuất bản không được lớn hơn năm hiện tại (${currentYear})`
    }),
    
    // Validate ObjectId của MongoDB (chuỗi Hex dài 24 ký tự)
    idCategory: Joi.string().hex().length(24).required().messages({
        'string.hex': 'ID Danh mục không đúng định dạng',
        'string.length': 'ID Danh mục phải có đúng 24 ký tự',
        'any.required': 'Vui lòng chọn danh mục cho sách'
    }),
    
    idStatus: Joi.string().hex().length(24).required().messages({
        'string.hex': 'ID Trạng thái không đúng định dạng',
        'string.length': 'ID Trạng thái phải có đúng 24 ký tự',
        'any.required': 'Vui lòng chọn trạng thái cho sách'
    }),
    image: Joi.string().allow('', null).optional(),
    
    description: Joi.string().allow('', null).optional()
    

});
module.exports = {
  createUserSchema,
  loginSchema,
  bookSchema
};