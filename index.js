const express = require('express');
const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config()

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));

const PASSWORD = process.env.PASSWORD;
const PORT = process.env.PORT;

const uri = `mongodb+srv://doubleyou77:${PASSWORD}@cluster0.jiq2a.mongodb.net/?retryWrites=true&w=majority`;

// DB connect
MongoClient.connect(uri, (err, database) => {
  if (err) {
    console.log(err);
    return;
  } else {
    // server start
    app.listen(PORT, () => {
      console.log('server start');
    });
    db = database.db('ToDoList');
    data = db.collection('List');
  }
});

app.get('/', (req, res) => {
  data.find()
      .toArray()
      .then((data) => {
        res.render('index', { data });
      })
      .catch((err) => {
        console.log(err);
        res.render('index', { data: [] });
      })
});

app.post('/upload', (req, res) => {
    const content = req.body.content;
    let date = new Date();
    date = date.toLocaleString();

    data.insertOne({ content, date })
        .then(() => {
          res.redirect('/');
        })
        .catch(() => {
          console.log(err);
          res.render('index', { data: [] });
        });
});

app.get('/edit/:id', (req, res) => {
  let id = req.params.id;

  data.findOne({ _id: ObjectId(id) })
      .then((data) => {
        res.render('edit', { data });
      });
});

app.post('/edit', (req, res) => {
  const { id, content } = req.body;
  let date = new Date();
  date = date.toLocaleString();

  data.updateOne(
        { _id: ObjectId(id) },
        { $set: {
            content,
            date
          }
        }
      )
      .then(() => {
        res.redirect('/');
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/');
      })
});

app.get('/delete/:id', (req, res) => {
  let id = req.params.id;
  
  data.deleteOne( { "_id" : ObjectId(id) } )
      .then(() => {
        res.redirect('/');
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/');
      })
});

app.all('*', (req, res) => {
  res.status(404).send('찾을 수 없는 페이지입니다.');
});
