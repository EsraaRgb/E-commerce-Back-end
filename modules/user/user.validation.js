import joi from "joi";


export const getUserById = {
    params: joi
      .object()
      .required()
      .keys({
        id: joi.string().required().max(24).min(24)
      }),
  };
  
  export const updateProfile = {
    body: joi
      .object()
      .required()
      .keys({
        email: joi
          .string()
          .email({ tlds: { allow: ["com", "edu", "net", "org"] } }),
        firstName: joi.string().min(3).max(25),
        lastName: joi.string().min(3).max(25),
        age: joi.number().min(16).max(100),
        address: joi.string(),
        phone: joi.string().min(11).max(11),
        gender: joi.string().valid("male", "female"),
      }),
  };
  
  export const updatePassword = {
    body: joi.object().required().keys({
      email: joi
      .string()
      .email({ tlds: { allow: ["com", "edu", "net", "org"] } }),
      oldPassword:joi
      .string()
      .required()
      .pattern(new RegExp(/^(?=.*\d)(?=.*[A-Z])(.{6,50})$/)),
      newPassword:joi
      .string()
      .required()
      .pattern(new RegExp(/^(?=.*\d)(?=.*[A-Z])(.{6,50})$/)),
      cpassword:joi.string().required().valid(joi.ref('newPassword')),
    }),
  };
  
export const blockUser = {
  params:joi.object().required().keys({
      id: joi.string().required().max(24).min(24)
  })
}