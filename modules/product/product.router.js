import { Router } from "express";
import {auth} from '../../middlewares/auth.js'
import {validate} from '../../middlewares/validation.js'
import {tokenAuth} from '../auth/auth.validation.js'
import ckeckProfile from '../../services/checkProfile.js'
import * as schemas from './product.valdation.js' 
import * as controller from './controller/product.js'

const router = Router();
router.use(auth())
router.use(validate(tokenAuth))

router.post('/',validate(schemas.addProduct),ckeckProfile(),controller.addProduct)

router.get('/',controller.getAllProducts)

router.get('/search',validate(schemas.searchProduct),controller.searchProductByTitle)

router.get('/:id',validate(schemas.productId),controller.getProductById)

router.put("/:id",validate(schemas.updateProduct),controller.updateProduct)

router.delete("/:id",validate(schemas.productId),controller.deleteProduct)

router.patch("/softdelete/:id",validate(schemas.productId),controller.softDeleteProduct)

router.patch("/like/:id",validate(schemas.productId),controller.likeProduct)

router.patch("/unlike/:id",validate(schemas.productId),controller.unLikeProduct)

export default router;
