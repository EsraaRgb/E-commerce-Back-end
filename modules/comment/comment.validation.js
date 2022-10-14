import joi from 'joi'
export const comment = {
  params: joi
    .object()
    .required()
    .keys({
      id: joi.string().required().max(24).min(24),
    }),
    body:joi.object().required().keys({
        comment:joi.string().required()
    })
};
export const softDeleteComment = {
    params: joi
    .object()
    .required()
    .keys({
      id: joi.string().required().max(24).min(24),
    })
}
