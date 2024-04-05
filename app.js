require('dotenv').config()
const express = require("express")
const morgan = require('morgan')
const cors = require('cors')
const { connectDB } = require('./config/db')
const authRoute = require('./routes/authRoute')
const categoryRoute = require('./routes/categoryRoutes')
const productRoute = require('./routes/productRoute')

//port
const port = process.env.PORT

//database connection
connectDB()

//rest object
const app = express()

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/category', categoryRoute)
app.use('/api/v1/product', productRoute)

//rest api
app.get('/', (req, res) => {
    return res.send('<h1>WELCOME TO BACKEND</h1>');
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})