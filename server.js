const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')
const https = require('https');
const cookieParser = require('cookie-parser')
const app = express();
const withAuth = require('./middleware/auth')

// Connect Database
connectDB();

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
//     res.setHeader('Access-Control-Allow-Credentials', true)
  
//     next()
//   })

// Initailize Middleware
app.use(express.json({
    extended: false
}));

console.log(process.env.CLIENT)

const corsOptions = {
    origin: process.env.CLIENT,
    credentials: true
}

app.use(function(req, res, next) {
    req.headers['if-none-match'] = 'no-match-for-this';
    next();    
  });

app.use(cors(corsOptions))

app.use(cookieParser())

app.get('/', (req, res) => res.send('API Running'));

app.get('/checkToken', withAuth, function(req, res) {
res.sendStatus(200);
});

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/blogs', require('./routes/api/blogs'));
app.use('/api/comments', require('./routes/api/comments'));

const PORT = process.env.PORT || 5000;

app.set('etag', false);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));