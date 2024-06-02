const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .max(20)
    .pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$%^&*])(?!.*\\s).*$"))
    .required()
    .messages({
      "string.base": "password harus berupa teks",
      "string.empty": "password tidak boleh kosong",
      "string.min": "password harus memiliki setidaknya {#limit} karakter",
      "string.max": "password maksimal {#limit} karakter",
      "string.pattern.base":
        "password harus mengandung setidaknya 1 huruf besar dan 1 simbol (!@#$%^&*) dan tidak boleh ada spasi",
    }),
  confirmPassword: Joi.ref("password"),
}).with("password", "confirmPassword");

const userDetailSchema = Joi.object({
  firstName: Joi.string().min(5).max(20).required().messages({
    "string.base": "firstName harus berupa teks",
    "string.empty": "firstName tidak boleh kosong",
    "string.min": "firstName wajib minimal {#limit} huruf",
    "string.max": "firstName wajib maksimal {#limit} huruf",
    "any.required": "firstName wajib diisi",
  }),
  lastName: Joi.string().min(5).max(20).required().messages({
    "string.base": "lastName harus berupa teks",
    "string.empty": "lastName tidak boleh kosong",
    "string.min": "lastName wajib minimal {#limit} huruf",
    "string.max": "lastName wajib maksimal {#limit} huruf",
    "any.required": "lastName wajib diisi",
  }),
  address: Joi.string().min(5).max(255).required().messages({
    "string.base": "address harus berupa teks",
    "string.empty": "address tidak boleh kosong",
    "string.min": "address wajib minimal {#limit} huruf",
    "string.max": "address wajib maksimal {#limit} huruf",
    "any.required": "address wajib diisi",
  }),
  phone: Joi.string().min(5).max(15).required().messages({
    "string.empty": "phone tidak boleh kosong",
    "string.min": "phone wajib minimal {#limit} huruf",
    "string.max": "phone wajib maksimal {#limit} huruf",
    "any.required": "phone wajib diisi",
  }),
});

module.exports = { userDetailSchema, registerSchema };
