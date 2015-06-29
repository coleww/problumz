var SequenceEditor = require('./sequence_editor')
var createContainer = require('./create_container')
require('openmusic-transport').register('openmusic-transport')

var Editor = function(data){
  this.data = null

  this.el = null
  this.import(data)//????
  this.createElement()
  this.updateControls()
}

Editor.prototype.import = function(_data){
  if(!!this.data) oldSeqCount = this.data.sequences.length

  this.data = {
    sequences: _data.sequences || [{melodic: true}],
    instruments: _data.instruments || [{foo: 'bar'}],
    bpm: _data.bpm || 120,
    key: _data.key || {tonic: 'C', scale: 'major'}
  }

  var diff = oldSeqCount - this.data.sequences.length

  this.data.sequences.forEach(function(sequence, i){
    sequence.import(data.sequences[i])
  })
  // destroy extra sequence editors?
  // make additional ones?!?!?!
  this.data = data
  this.updateControls()
}

Editor.prototype.export = function(){
  var data = {}
  data.bpm = this.data.bpm
  data.key = this.data.key
  data.sequences = []
  this.data.sequences.forEach(function(sequence){
    data.sequences.push(sequence.export())
  })
  return data
}

Editor.prototype.createElement = function(){
  var that = this
  var el = createContainer('editor')

  var seqContainer = createContainer('sequences')
  this.data.sequences = this.data.sequences.map(function(seq){
    var seqEditor = new SequenceEditor(seq)
    seqContainer.appendChild(seqEditor.el)
    return seqEditor
  })
  el.appendChild(seqContainer)

  var controls = createContainer('controls')
  controls.appendChild(this.createKeySelect())
  controls.appendChild(this.createTransport())
  el.appendChild(controls)

  this.el = el
}

Editor.prototype.createKeySelect = function(){
  var that = this
  var keySelect = createContainer('key-select')

  var tonic = document.createElement("select")
  tonic.setAttribute('class', 'tonic')
  var notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
  notes.forEach(function(note){
    var opt = document.createElement("option")
    opt.value = opt.textContent = note
    tonic.appendChild(opt)
  })

  tonic.addEventListener("change", function(e){
    that.data.key.tonic = e.target.value + "3"
  })

  keySelect.appendChild(tonic)

  var key = document.createElement("select")
  key.setAttribute('class', 'scale')
  var scales = ["major", "minor", "pentMaj", "pentMin"]
  scales.forEach(function(scale){
    var opt = document.createElement("option")
    opt.value = opt.textContent = scale
    key.appendChild(opt)
  })

  key.addEventListener("change", function(e){
    that.data.key.scale = e.target.value
  })

  keySelect.appendChild(key)
  return keySelect
}

Editor.prototype.createTransport = function(){
  var transport = document.createElement('openmusic-transport')
  var that = this
  transport.addEventListener('start', function(e){
    // export a bunch of data
    //
    // feed it to the player
    // editor tells parent thing to do the sauce?
    // that thing grabs the instruments and starts it?
  })
  transport.addEventListener('stop', function(e){
    // editor tells parent thing to stahp it!
  })
  transport.addEventListener('bpm', function(e){
    that.data.bpm = e.detail.value
  })
  return transport
}

Editor.prototype.updateControls = function(){
  this.el.querySelector('openmusic-transport openmusic-slider').value = this.data.bpm
  this.el.querySelector('.key-select .tonic').value = this.data.key.tonic
  this.el.querySelector('.key-select .scale').value = this.data.key.scale
}

module.exports = Editor











