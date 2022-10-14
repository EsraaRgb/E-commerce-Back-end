import { application, Router } from "express";
import {auth} from '../../middlewares/auth.js'
import {validate} from '../../middlewares/validation.js'
import {tokenAuth} from '../auth/auth.validation.js'
import * as controller from './controller/comment.js'
import * as schemas from './comment.validation.js'

const router = Router();
router.use(auth())
router.use(validate(tokenAuth))

router.post("/:id",validate(schemas.comment),controller.addComment);

router.put("/:id",validate(schemas.comment),controller.updateComment);

router.patch("/:id",validate(schemas.softDeleteComment),controller.softDeleteComment);

export default router;
