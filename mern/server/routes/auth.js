import { Router} from "express";
import {register, login, getMe} from "../controllers/auth.js";
import {checkAuth} from "../utils/checkAuth.js";

const router = new Router()

// reg
router.post('/register', register)
// log
router.post('/login', login)
// get prof
router.get('/me', checkAuth, getMe)
export default router