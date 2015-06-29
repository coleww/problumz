var data = {
  sequences: [
    {
      melodic: false
    },
    {
      melodic: false
    },
    {
      melodic: false
    },
    {
      melodic: true
    },
    {
      melodic: true
    }
  ],
  key: {
    tonic: 'C3',
    scale: 'major'
  },
  bpm: 120//,
  // steps: 16
};

var Editor = require('./src/editor')
var editor = new Editor(data)

document.body.appendChild(editor.el)

// var instruments = require('./src/instruments')














