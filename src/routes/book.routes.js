import express from 'express'
import Book from '../models/book.model.js'

const router = express.Router()

const getBook = async (req, res, next) => {
    let book
    const { id } = req.params

    if (!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json({
            message: 'The ID is not valid'
        })
    }

    try {
        book = await Book.findById(id)

        if (!book){
            return res.status(404).json({
                message: 'Book does not exists'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

    res.book = book
    next()
}

router.get('/', async (req, res) => {
    try {
        const books = await Book.find()

        if (books.length === 0){
            return res.status(204).json([])
        }

        res.json(books)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

router.post('/', async (req, res) => {
    const { title, author, genre, publication_date } = req?.body

    if (!title || !author || !genre || !publication_date){
        return res.status(400).json({
            message: "Fields mandatory"
        })
    }

    const book = new Book({ 
        title,
        author,
        genre, 
        publication_date 
    })

    try {
        const newBook = await book.save()
        res.status(201).json(newBook)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

router.get('/:id', getBook, async (req, res) => {
    res.json(res.book)
})

router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.genre = req.body.genre || book.genre
        book.publication_date = req.body.publication_date || book.publication_date

        const updateBook = await book.save()

        res.json(updateBook)   
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }    
})

router.patch('/:id', getBook, async (req, res) => {
    if (!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date){
        return res.status(400).json({
            message: 'One of the field must be send'
        })
    }
    try {
        const book = res.book
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.genre = req.body.genre || book.genre
        book.publication_date = req.body.publication_date || book.publication_date

        const updateBook = await book.save()

        res.json(updateBook)   
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }    
})

router.delete('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        await book.deleteOne({
            _id: book._id
        })
        res.json({
            message: 'Book deleted'
        })   
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }    
})

export default router

//module.exports = router