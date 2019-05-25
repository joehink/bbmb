// Dependencies
const cors = require('cors');
require('dotenv').config()
const express = require('express');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');

require('./models/users');
require('./models/posts');
require('./models/comments');

require('./services/passport');
require('./services/cache');

// Config
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const app = express();

// Setup
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
    const gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('photos');
    
    const upload = require('./services/gridfs')(MONGODB_URI);

    // Routes
    require('./routes/api/photos')(app, gfs);
    require('./routes/api/users')(app, upload, gfs);
    require('./routes/api/sessions')(app);
    require('./routes/api/posts')(app);
    
})

// Middleware
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
