var express = require('express')
var bodyParser = require('body-parser')
var app = express()

var requestJson = require('request-json')

app.use(bodyParser.json())



var urlMlabRaiz = "https://api.mlab.com/api/1/databases/bdbancoar/collections"
var apiKey = "apiKey=50c5ea68e4b0a97d668bc84a"
var clienteMlab


app.get('/apitechu/v5/usuarios', function(req, res) {
    clienteMlab = requestJson.createClient(urlMlabRaiz + "/usuarios?" + apiKey)
    clienteMlab.get('', function(err, resM, body) {
      if (!err) {
        res.send(body)
      }
    })
})

app.get('/apitechu/v5/usuarios/:id', function(req, res) {
    var id = req.params.id
    var query = 'q={"id":' + id + '}&f={"nombre":1, "apellidos":1, "_id":0}'
    clienteMlab = requestJson.createClient(urlMlabRaiz + "/usuarios?" + query + "&l=1&" + apiKey)
    clienteMlab.get('', function(err, resM, body) {
      if (!err) {
        if (body.length > 0)
          res.send(body[0])
          //res.send({"nombre":body[0].nombre, "apellidos":body[0].apellidos})
        else {
          res.status(404).send('Usuario no encontrado')
        }
      }
    })
})

app.post('/apitechu/v5/login', function(req, res) {
    var email = req.headers.email
    var password = req.headers.password
    var query = 'q={"email":"' + email + '","password":"' + password + '"}'
    clienteMlab = requestJson.createClient(urlMlabRaiz + "/usuarios?" + query + "&l=1&" + apiKey)
    clienteMlab.get('', function(err, resM, body) {
      if (!err) {
        if (body.length == 1) // Login ok
        {
          clienteMlab = requestJson.createClient(urlMlabRaiz + "/usuarios")
          var cambio = '{"$set":{"logged":true}}'
          clienteMlab.put('?q={"id": ' + body[0].id + '}&' + apiKey, JSON.parse(cambio), function(errP, resP, bodyP) {
              res.send({"login":"ok", "id":body[0].id, "nombre":body[0].nombre, "apellidos":body[0].apellidos})
          })

        }
        else {
          res.status(404).send('Usuario no encontrado')
        }
      }
    })
})




var port = process.env.PORT || 3000
var fs = require('fs')

app.listen(port)

console.log("API escuchando en el puerto" + port)


var usuarios = require('./usuarios.json')

//console.log("Hola mundo")



app.get('/apitechu/v1', function(req, res)
{
  //console.log(req)
  res.send({"mensaje":"Bienvenido a mi API"})
})

app.get('/apitechu/v1/usuarios', function(req, res) {
  res.send(usuarios)
})

app.post('/apitechu/v1/usuarios', function(req, res) {
  var nuevo = {"first_name":req.headers.first_name,
              "country":req.headers.country}
  usuarios.push(nuevo)
  console.log(req.headers)
  const datos = JSON.stringify(usuarios)

  fs.writeFile("./usuarios.json", datos, "utf8", function(err) {
    if (err) {
      console.log(err)
    }
    else {
    console.log("Fichero guardado")
  }
  })

  res.send("Alta OK")
})

app.post('/apitechu/v2/usuarios', function(req, res) {
  //var nuevo = {"first_name":req.headers.first_name,
  //            "country":req.headers.country}
  var nuevo = req.body
  usuarios.push(nuevo)
  //console.log(req.headers)
  const datos = JSON.stringify(usuarios)

  fs.writeFile("./usuarios.json", datos, "utf8", function(err) {
    if (err) {
      console.log(err)
    }
    else {
    console.log("Fichero guardado")
  }
  })

  res.send("Alta OK")
})

app.delete('/apitechu/v1/usuarios/:elegido', function(req, res) {
  usuarios.splice(req.params.elegido-1, 1)
  res.send("Usuario borrado")
})

app.post('/apitechu/v1/monstruo/:p1/:p2', function(req, res) {
  console.log("Parámetros")
  console.log(req.params)
  console.log("Query Strings")
  console.log(req.query)
  console.log("Headers")
  console.log(req.headers)
  console.log("Body")
  console.log(req.body)

})

app.post('/apitechu/v3/usuarios/login', function(req, res) {
  var email = req.headers.email
  var password = req.headers.password
  var idusuario = 0

  for (var i = 0; i < usuarios.length; i++) {
    if(usuarios[i].email == email && usuarios[i].password == password)
    {
      idusuario = usuarios[i].id
      usuarios[i].logged = true
      break;
    }
  }
  if (idusuario != 0) // encontrado
    res.send({"encontrado":"sí","id":idusuario})
  else {
    res.send({"encontrado":"no"})
  }

})

app.post('/apitechu/v3/usuarios/logout', function(req, res) {
  var idusuario = req.headers.id
  var usuario_logado = false

  for (var i = 0; i < usuarios.length; i++) {
    if(usuarios[i].id == idusuario && usuarios[i].logged == true)
    {
      usuario_logado=true
      usuarios[i].logged = false
      break;
    }

  }
if (usuario_logado==true)
    res.send({"logout":"sí","id":idusuario})
else {
    res.send({"logout":"no","msj":"el usuario no había iniciado sesión"})
}
})
