import { Router } from "express";
import * as fxn from "../../controllers/user/auth-api/auth.prisma.controller";
import { validate } from "../../middleware/joiValidation.middleware";
import * as userValidator from "../../validators/User/auth.validator";

const router = Router();

router.post("/signup", validate(userValidator.userSignupSchema), fxn.signUp);
router.post("/login", validate(userValidator.userLoginSchema), fxn.loginUser);

export default router;
