var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var objectID = mongodb.ObjectId;

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = 8080;
app.listen(port);

var db = mongodb.Db(
  'instagram',
  new mongodb.Server('localhost', 27017, {}),

);

console.log('Servidor HTTP escutando na porta ' + port);

app.get('/api', function(req, res){
  db.open(function(err, mongoclient){
    mongoclient.collection('postagens', function(err, collection){
      collection.find().toArray(function(err, results){
        if(err){
          res.statusCode(500).send(err);
        } else {
          res.status(200).json(results);
        }
        mongoclient.close();
      });
    });
  });
});
app.get('/api/:id', function(req, res){
  db.open(function(err, mongoclient){
    mongoclient.collection('postagens', function(err, collection){
      collection.find(objectID(req.params.id)).toArray(function(err, results){
        if(err){
          res.statusCode(500).send(err);
        } else {
          res.status(200).json(results);
        }
        mongoclient.close();
      });
    });
  });
});
app.post('/api', function(req, res){
  var dados = req.body;
  db.open(function(err, mongoclient){
    mongoclient.collection('postagens', function(err, collection){
      collection.insert(dados, function(err, records){
        if(err){
          res.statusCode(500).send(err);
        } else {
          res.status(201).send("");
        }
        mongoclient.close();
      });
    });
  });
});
app.put('/api/:id', function(req, res){
  var dados = req.body;
  db.open(function(err, mongoclient){
    mongoclient.collection('postagens', function(err, collection){
      collection.update(
        { _id : objectID(req.params.id) },
        { $set: dados },
        {},
        function(err, record){
          if(err){
            res.statusCode(500).send(err);
          } else {
            res.status(202).send("");
          }
          mongoclient.close();
        }
      );
    });
  });
});
app.delete('/api/:id', function(req, res){
  db.open(function(err, mongoclient){
    mongoclient.collection('postagens', function(err, collection){
      collection.remove(
        { _id : objectID(req.params.id) },
        function(err, record){
          if(err){
            res.statusCode(500).send(err);
          } else {
            res.status(202).send("");
          }
          mongoclient.close();
        }
      );
    });
  });
});
