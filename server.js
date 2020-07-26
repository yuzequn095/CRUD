// connection
// mongodb+srv://zey031:Yuzq0905@cluster0.qlh3b.mongodb.net/zey031?retryWrites=true&w=majority

// use express
const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient

/*
MongoClient.connect('mongodb+srv://zey031:Yuzq0905@cluster0.qlh3b.mongodb.net/zey031?retryWrites=true&w=majority' , {useUnifiedTopology: true},(err, client) => {
  if (err) return console.error(err)
  console.log('Connected to Database')
})
*/

MongoClient.connect('mongodb+srv://zey031:Yuzq0905@cluster0.qlh3b.mongodb.net/zey031?retryWrites=true&w=majority', { useUnifiedTopology: true })
  .then(client => {

    console.log('Connected to Quote Database')
    const db = client.db('my-quotes')
    const quotesCollection = db.collection('quotes')


    app.set('view engine', 'ejs')
    app.use(express.static('public'))
    app.use(bodyParser.json())
    // Make sure you place body-parser before your CRUD handlers!
    app.use(bodyParser.urlencoded({ extended: true }))
    // handlers
    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
        .then(results => {
          //console.log(results)
          res.render('index.ejs', { quotes: results })
        })
        .catch(error => console.error(error))
        //res.render('index.ejs', {})
      // ...
    })
    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })
    // listen server
    app.listen(3000, function(){
      console.log('listening on 3000')
    })
    app.put('/quotes', (req, res) => {
      //console.log(req.body)
      quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json(`Deleted Darth Vadar's quote`)
        })
        .catch(error => console.error(error))
    })

  })

// in express to handle GET
/*
app.get('/', function(req, res) {
  res.send('Hello World')
})
*/

