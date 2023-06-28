
import { Router } from "express";
import { checkAuth } from "../utils/checkAuth.js";
import { createPost, getAll, getById, getMyPosts, removePost, updatePost, getPostComments} from "../controllers/posts.js";

const router = Router();
// добавляем маршрут для создания поста
router.post("/", checkAuth, createPost);

router.get('/', getAll)

// get post by id

router.get('/:id', getById)
// get my posts
router.get('/user/me', checkAuth, getMyPosts)

// delete post route
router.delete('/:id', checkAuth, removePost)

// update post
router.put('/:id', checkAuth, updatePost)

// get comments
router.get('/comments/:id', getPostComments)
export default router;