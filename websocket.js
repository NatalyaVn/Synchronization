var WebSocketServer = require('ws').Server
var wss             = new WebSocketServer({port: 40510})
var db              = require('./data/crud')

wss.on('connection', function (ws) {//при подключеннии(при загрузке страницы)
  var data = db.read();//данные из бд
  if (data.length != 0) {
    ws.send(JSON.stringify(data));//отправка данных клиенту строкой
  }

  ws.on('message', function (message) {//при получении сообщения (изменение данных)
    var data = JSON.parse(message);
    if (data.id != null && data.tag != null && data.attribute != null && data.value != null)//проверка данных
      db.create(data);//запись в БД
    ws.send(JSON.stringify(db.read()));
  })
})