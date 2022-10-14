import joi from "joi";

export const addProduct = {
    body:joi.object().required().keys({
        title:joi.string().required().max(35),
        description:joi.string().required(),
        price:joi.number().required().positive()
    })
}
export const updateProduct = {
    params:joi.object().required().keys({
        id: joi.string().required().max(24).min(24)
    }),
    body:joi.object().required().keys({
        title:joi.string().max(35),
        description:joi.string(),
        price:joi.number().positive()
    })
}
export const productId = {
    params:joi.object().required().keys({
        id: joi.string().required().max(24).min(24)
    })
}
export const searchProduct = {
    query:joi.object().required().keys({
        title: joi.string().required().max(50)
    })
}