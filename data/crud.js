const lowdb = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')
var file    = require('../server').file
var adapter = new FileSync(file)
var db = lowdb(adapter)

db.defaults({
  webElements: []
}).write();

function select(idToSearch){//выбор эл-та по id
  return db.get('webElements').find({id: idToSearch});
}

function update(idToSearch, valueAssign){//обновить значение эл-та
  select(idToSearch).assign({value: valueAssign}).write();
}

function selectTag(tagToSearch){//выбор эл-та по тегу
  return db.get('webElements').filter({tag: tagToSearch});
}

function create(data){//создание записи в БД
  var rows = selectTag(data.tag);
  var copiesCount = rows.size().value();
  var elements = rows.value();

  if (select(data.id).size().value() == 0)
    db.get('webElements').push(data).write();

  if (data.tag === 'radio'){
    if (copiesCount != 0) {
      for(i = 0; i < copiesCount; i++){
        var assignValue = false;
        var idToUpdate = elements[i].id;
        if (idToUpdate == data.id) assignValue = data.value;
        update(idToUpdate, assignValue);
      }
    }
  }
  else {
    update(data.id, data.value);
  }
}

function read(){//чтение БД
  return db.get('webElements').value();
}

module.exports.db     = db;//экспорт функций
module.exports.read   = read;
module.exports.create = create;