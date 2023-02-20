const express = require('express');
const path = require('path');


const app = express();

const PORT = process.env.PORT || 4001;

//Setting the default engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//Telling the express module that public dir has all of our site assets
app.use(express.static(path.join(__dirname, '/public')));

// Add middware for parsing request bodies here:
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



const citasRouter = require('./routes/citas')

app.use('/citas',citasRouter)



//app.use('/citas',citasRouter);

app.listen(PORT);

