var ws = new WebSocket('ws://localhost:40510');
var frm = document.getElementById("forma");
var i = 0;
var elem;
var id;
var newform = document.createElement('form');
document.body.appendChild(newform);

ws.onopen = function () {
    console.log('websocket is connected ...')
}

ws.onmessage = function (ev) {
  var data = JSON.parse(ev.data);//данные с сервера
  console.log(data);
  for (i = 0; i < data.length; i++){
    var origin = document.getElementById(data[i].id);
    if (origin == null)
      continue;
    var copy = document.getElementById(data[i].id + "_2");
    var tag = data[i].tag;
    if (tag === "radio" || tag === "checkbox") {
        origin.checked = data[i].value;
        copy.checked = data[i].value;
    }
    else if (tag === "text"  || tag === "button"){
      origin.setAttribute(data[i].attribute, data[i].value);
      copy.setAttribute(data[i].attribute, data[i].value);
    }
    else if (tag === "textarea" || tag === "select"){
      origin.value = data[i].value;
      copy.value = data[i].value;
    }
  }
}

while (frm.children[i] != null)//добавление id правой части и навешивание событий на левую
  {
    elem = frm.children[i].cloneNode(true);
    if(frm.children[i].getAttribute('class') != 'p')
      if(frm.children[i].getAttribute('class') == 'lbl')
      {
        id = frm.children[i].children[0].getAttribute('id');
        elem.children[0].setAttribute('id', id+'_2');
        frm.children[i].children[0].addEventListener('click', change);
      }
      else
      {
        id = frm.children[i].getAttribute('id');
        elem.setAttribute('id', id+'_2');
      }
    if(frm.children[i].getAttribute('type') == 'button'){
      frm.children[i].addEventListener('click', changeColor);
      frm.children[i].addEventListener('click', change);
    }
    if(frm.children[i].getAttribute('type') == 'text' || frm.children[i].tagName == 'TEXTAREA')
      frm.children[i].addEventListener('focusout', change);
    if(frm.children[i].tagName == 'SELECT')
      frm.children[i].addEventListener('change', change);
    
    elem.setAttribute('disabled', 'true');
    newform.appendChild(elem);
    i++;
  }

function changeColor(){
  var newStyle = 'background-color:yellow';
  if (this.getAttribute('style') === newStyle)
    newStyle = '';
  this.setAttribute('style', newStyle);
}

function change(){
  var attrib, val,
  ident = this.getAttribute('id');
  tagName = this.tagName === 'INPUT' ? this.getAttribute('type') : this.tagName.toLowerCase();

  if(tagName === 'radio' || tagName === 'checkbox'){
    attrib = 'checked';
    val = this.checked;
  }
  else if (tagName == 'button') {
    attrib = 'style';
    val = this.getAttribute(attrib);
  }
  else{
    attrib = 'value';
    val = this.value;
  }
  
  var data = {
    tag: tagName,
    attribute: attrib,
    value: val,
    id: ident
  }
  console.log(data);
  ws.send(JSON.stringify(data));
}