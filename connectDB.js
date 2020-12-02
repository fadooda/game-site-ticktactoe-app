require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://stmina:Kyrillos@elijah.j1xwi.mongodb.net/?retryWrites=true&w=majority';

/*async function getUser(req) { 
    return new Promise(function(resolve, reject) {
        MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            var dbo = db.db("games_db");
            dbo.collection("users").findOne(req.body, function(err, res) {
              if (err) throw err;
              console.log(res.userName);
              console.log(res.password);
            //code to check authentication
              //dbres=res.userName;
              //console.log(dbuser)
              //dbuser=res
              //console.log(dbuser.userName)
              //console.log(dbuser.password);
              db.close();
              resolve(res)
            });

          })
    }

}*/


module.exports =
{
    addUser: function (req) {
        MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("games_db");
        dbo.collection("users").insertOne(req.body, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      })
    },
    getUser: function (req,callback) { 
        MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("games_db");
        dbo.collection("users").findOne(req, function(err, res) {
          if (err) throw err;
          //console.log(res.userName);
         // console.log(res.password);
        //code to check authentication
          ////dbres=res.userName;
          //console.log(dbuser)
          //dbuser=res
          //onsole.log(dbuser.userName)
          //console.log(dbuser.password);
          db.close();
          callback(res)
        });
      })
      
    }
}
