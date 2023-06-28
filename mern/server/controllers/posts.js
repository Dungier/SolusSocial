import Post from '../models/Post.js';
import User from '../models/User.js';
import Comment from '../models/Comments.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import comment from "../routes/comment.js";

// Создание нового поста
export const createPost = async (req, res) => {
    try {
        const { title, text } = req.body
        const user = await User.findById(req.userId)

        if (req.files) {
            let fileName = Date.now().toString() + req.files.image.name
            const __dirname = dirname(fileURLToPath(import.meta.url))
            req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))

            const newPostWithImage = new Post({
                username: user.username,
                title,
                text,
                imgUrl: fileName,
                author: req.userId,
            })

            await newPostWithImage.save()
            await User.findByIdAndUpdate(req.userId, {
                $push: { posts: newPostWithImage },
            })

            return res.json(newPostWithImage)
        }

        const newPostWithoutImage = new Post({
            username: user.username,
            title,
            text,
            imgUrl: '',
            author: req.userId,
        })
        await newPostWithoutImage.save()
        await User.findByIdAndUpdate(req.userId, {
            $push: { posts: newPostWithoutImage },
        })
        res.json(newPostWithoutImage)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

// Получение списка всех постов
export const getAll = async (req, res) => {
    try {
        // Получаем список всех постов, отсортированных по дате создания (от новых к старым)
        const posts = await Post.find().sort('-createdAt');

        // Получаем список популярных постов (5 самых просматриваемых)
        const popularPosts = await Post.find()
            .sort('-views')
            .limit(5);

        // Отправляем список постов и список популярных постов клиенту
        res.json({ posts, popularPosts });
    } catch (error) {
        // Если при получении списка постов возникла ошибка, отправляем ошибку клиенту
        res.status(500).json({ message: 'Что-то пошло не так.', error });
    }
};
//get  posts
export const getById = async (req, res) => {
    try {
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id },
            { $inc: { views: 1 } },
            { new: true }
        );
        res.json(post)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.', error });
    }
};

export const getMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        const list = await Promise.all(
            user.posts.map((post) => {
                return Post.findById(post._id)
            }),
        )
        res.json(list)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.', error });
    }
};
/*
import Post from '../models/Post.js';
import User from '../models/User.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
// Кажется, строка ниже не нужна, так как модель Post уже импортирована в начале файла// import post from "../models/Post.js";
export const createPost = async (req, res) => {
    try {
    const { title, text } = req.body;
    const user = await User.findById(req.userId);
    if (req.files) {
       let fileName = Date.now().toString() + req.files.image.name;
       const __dirname = dirname(fileURLToPath(import.meta.url));            req.files.image.mv(
       path.join(__dirname, '..', 'uploads', fileName)            );
       const newPostWithImage = new Post({
                username: user.username,                title,
                text,                imgUrl: fileName,
                author: req.userId,
            });
            await newPostWithImage.save();
            await User.findByIdAndUpdate(req.userId, {                $push: { posts: newPostWithImage },
            });
            // добавляем статус ответа            return res.status(201).json(newPostWithImage);
        }
        const newPostWithoutImage = new Post({            username: user.username,
            title,            text,
            imgUrl: '',            author: req.userId,
        });
        await newPostWithoutImage.save();
        await User.findByIdAndUpdate(req.userId, {            $push: { posts: newPostWithoutImage },
        });
        // добавляем статус ответа        return res.status(201).json(newPostWithoutImage);
    } catch (error) {        // добавляем статус ответа и описание ошибки в payload
        res.status(500).json({ message: "Упс... Что-то пошло не так.", error: error });    }
};
export const getAll = async () => {    try{
        const posts = await Post.find().sort('-createdAt')        const popularPosts = await Post.find().limit(5).sort('-views')
        if(!posts){            res.json({message: 'Никто еще не успел сделать публикацию.'})
        }        res.json({posts, popularPosts})
    }catch (error){        res.json({message: 'Что-то пошло не так.'})
    }}
 */

export const removePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id)
        if(!post) return res.json({message: 'Такой публикации не существует.'})
        await User.findByIdAndUpdate(req.userId, {
            $pull: {posts: req.params.id},
        })

        res.json({message: 'Вы удалили публикацию.'})
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.', error });
    }
};

export const updatePost = async (req, res) => {
    try{
        const {title, text, id} = req.body
        const post = await Post.findById(id)

        if (req.files) {
            let fileName = Date.now().toString() + req.files.image.name
            const __dirname = dirname(fileURLToPath(import.meta.url))
            req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))
            post.imgUrl = fileName || ''
        }
        post.title = title
        post.text = text
        await post.save()


        res.json(post)
    }catch (error){
        res.json({message: 'Что-то пошло не так.'})
    }
}
export const getPostComments = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        const list = await Promise.all(
            post.comments.map((comment) => {
                return Comment.findById(comment)
            }),
        )
        res.json(list)
    }catch (error){
        res.json({message: 'Что-то пошло не так.'})
    }
}