var yarray = require('yarray')

var Instrument = function(data){
  this.data = data || {
    probs: [['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0']],
    notes: [['','','','','','','','','','','','','','','','']],
    nexts: [['']],
    current: 0,
    melodic: true
  }
  this.el = null
  this.createElement()
}

Instrument.prototype.update = function(){

}

Instrument.prototype.export = function(){

  return data
  // return this.data?
}

Instrument.prototype.createElement = function(){
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

  boundNexts.els[0].setAttribute('class', 'nexts')
  container.appendChild(boundNexts.els[0])
  container.appendChild(this.createCurrentSelect())
  container.appendChild(this.createAddButton())
  this.el = container;
}

function createContainer(className){
  var container = document.createElement('div')
  container.setAttribute('class', className)
  return container
}

Instrument.prototype.createCurrentSelect = function(){
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

Instrument.prototype.updateCurrent = function(current){
  this.data.current = current
  this.updateProbs(this.data.probs[this.data.current])
  if(this.data.melodic) this.updateNotes(this.data.notes[this.data.current])
  this.updateNexts(this.data.nexts[this.data.current])
}

Instrument.prototype.createAddButton = function(){
  var button = document.createElement('button')
  button.textContent = '+'
  var that = this
  button.addEventListener('click', function addPattern(){
    that.addPattern()
  });

  return button
}

Instrument.prototype.addPattern = function(){
  this.data.probs.push(['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'])
  if(this.data.melodic) this.data.notes.push(['','','','','','','','','','','','','','','',''])
  var newIdx = this.data.probs.length - 1 + ''
  this.data.nexts.push([newIdx])
  var opt = document.createElement('option')
  opt.value = opt.textContent = newIdx
  this.el.querySelector('select').appendChild(opt)
}

module.exports = Instrument