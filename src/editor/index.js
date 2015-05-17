var SequenceEditor = require('./sequence_editor')
var createContainer = require('./create_container')
require('openmusic-transport').register('openmusic-transport')

var Editor = function(data){
  this.sequences = []
  var container = createContainer('editor')
  var that = this
  data.sequences.forEach(function(seq){
    var seqEditor = new SequenceEditor(seq)
    container.appendChild(seqEditor.el)
    that.sequences.push(seqEditor)
  })
  this.el = container
  x = document.createElement('openmusic-transport')
}

Editor.prototype.import = function(data){

}

Editor.prototype.export = function(){

}

Editor.prototype.createElement = function(){

}

module.exports = Editor
