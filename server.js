const express = require('express');
const routes = require('./controllers');
const path = require('path')

const app = express();
const PORT = process.env.PORT || 3001;

// add express handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({})
app.engine('hbs', exphbs.engine( {extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.listen(PORT, () => console.log(`now listening go to http://localhost:${PORT}`));



