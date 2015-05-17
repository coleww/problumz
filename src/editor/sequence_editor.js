var yarray = require('yarray')

var SequenceEditor = function(data){
  if(!data) data = {}
  this.data = {
    probs: data.probs || [['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0']],
    notes: data.notes || [['','','','','','','','','','','','','','','','']],
    nexts: data.nexts || [['0']],
    current: data.current === undefined ? 0 : data.current,
    melodic: data.melodic === undefined ? true : data.melodic
  }
  this.el = null
  this.createElement()
}

SequenceEditor.prototype.import = function(data){
  var newData = {}
  newData.probs = data.probs.map(function(p){
    return p.map(function(e){
      return e+''
    })
  })
  newData.notes = data.notes.map(function(p){
    return p.map(function(s){
      return s.join(",")
    })
  })
  newData.nexts = data.nexts.map(function(p){
    return [p.join(",")]
  })
  newData.current = data.current+''
  newData.melodic = data.melodic
  this.data = newData

  this.updateCurrent(this.data.current)
}

SequenceEditor.prototype.export = function(){
  var data = {}
  data.probs = this.data.probs.map(function(p){
    return p.map(function(e){
      return +e
    })
  })
  data.notes = this.data.notes.map(function(p){
    return p.map(function(s){
      return s.replace(' ', '').split(",").map(function(e){
        return +e
      })
    })
  })
  data.nexts = this.data.nexts.map(function(p){
    return p[0].replace(' ', '').split(",").map(function(e){
      return +e
    })
  })
  data.current = +this.data.current
  data.melodic = this.data.melodic
  return data
}

SequenceEditor.prototype.createElement = function(){
  var boundProbs = yarray(this.data.probs[this.data.current])
  if(this.data.melodic) var boundNotes = yarray(this.data.notes[this.data.current])
  var boundNexts = yarray(this.data.nexts[this.data.current])

  this.updateProbs = boundProbs.update
  if(this.data.melodic) this.updateNotes = boundNotes.update
  this.updateNexts = boundNexts.update

  var container = createContainer('instrument')

  var probs = createContainer('probs')
  for(var p=0;p<boundProbs.els.length;p++){
    probs.appendChild(boundProbs.els[p])
  }
  container.appendChild(probs)

  if(this.data.melodic) {
    var notes = createContainer('notes')
    for(var n=0;n<boundNotes.els.length;n++){
      notes.appendChild(boundNotes.els[n])
    }
    container.appendChild(notes)
  }

  var controls = createContainer('controls')
  boundNexts.els[0].setAttribute('class', 'nexts')
  controls.appendChild(boundNexts.els[0])
  controls.appendChild(this.createCurrentSelect())
  controls.appendChild(this.createAddButton())
  container.appendChild(controls)

  this.el = container;
}

function createContainer(className){
  var container = document.createElement('div')
  container.setAttribute('class', className)
  return container
}

SequenceEditor.prototype.createCurrentSelect = function(){
  var select = document.createElement('select')
  var that = this
  select.addEventListener('change', function updateSelect(e){
    that.updateCurrent(e.target.value)
  });
  var opt = document.createElement('option')
  opt.value = opt.textContent = '0'
  select.appendChild(opt)
  return select
}

SequenceEditor.prototype.updateCurrent = function(current){
  this.data.current = current
  this.updateProbs(this.data.probs[this.data.current])
  if(this.data.melodic) this.updateNotes(this.data.notes[this.data.current])
  this.updateNexts(this.data.nexts[this.data.current])
}

SequenceEditor.prototype.createAddButton = function(){
  var button = document.createElement('button')
  button.textContent = '+'
  var that = this
  button.addEventListener('click', function addPattern(){
    that.addPattern()
  });

  return button
}

SequenceEditor.prototype.addPattern = function(){
  this.data.probs.push(['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'])
  if(this.data.melodic) this.data.notes.push(['','','','','','','','','','','','','','','',''])
  var newIdx = this.data.probs.length - 1 + ''
  this.data.nexts.push([newIdx])
  var opt = document.createElement('option')
  opt.value = opt.textContent = newIdx
  this.el.querySelector('select').appendChild(opt)
}

module.exports = SequenceEditor