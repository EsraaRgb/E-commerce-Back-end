import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validation.js";
import * as schemas from "./user.validation.js";
import {tokenAuth} from '../auth/auth.validation.js'
import * as controller from "./controller/user.js";

const router = Router();

router.use(auth())
router.use(validate(tokenAuth))

router.get("/",controller.getAllUsers);

router.get("/:id", validate(schemas.getUserById), controller.getUserById);

router.put("/profile",validate(schemas.updateProfile),controller.updateProfile);

router.patch("/password",validate(schemas.updatePassword),controller.updatePassword);

router.patch("/",controller.softDeleteProfile);

router.put("/block/:id",validate(schemas.blockUser),controller.blockUser);

export default router;