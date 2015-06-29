var tap = require('tape')
var Editor = require('../src/editor')
var triggerChange = require('trigger-change')

tap.test('editor constructs sequence editors', function(t){
  t.plan(1)
  var data = {sequences: [{melodic: true}, {melodic: false}]}
  var editor = new Editor(data)

  t.equal(editor.el.querySelectorAll('.sequence').length, 2)
})

tap.test('loads data', function(t){
  t.plan(4)
  var data = {
    bpm: 100,
    key: {
      tonic: 'G',
      scale: 'minor'
    },
    sequences: [
      {melodic: true}
    ]
  }
  var editor = new Editor(data)

  t.equal(editor.el.querySelector('.tonic').value, 'G', 'loads tonic')
  t.equal(editor.el.querySelector('.scale').value, 'minor', 'loads scale')
  t.equal(editor.el.querySelector('openmusic-transport openmusic-slider').value, 100, 'loads bpm')
  t.equal(editor.el.querySelectorAll('.sequence').length, 1, 'loads sequence')
})

tap.test('imports data', function(t){
  t.plan(4)
  var data = {
    bpm: 100,
    key: {
      tonic: 'G',
      scale: 'minor'
    },
    sequences: [
      {melodic: true}
    ]
  }
  var editor = new Editor(data)

  var updata = {
    bpm: 152,
    key: {
      tonic: 'A',
      scale: 'pentMaj'
    },
    sequences: [
      {melodic: false}, {melodic: false}
    ]
  }

  editor.import(updata)
  t.equal(editor.el.querySelector('.tonic').value, 'A', 'loads tonic')
  t.equal(editor.el.querySelector('.scale').value, 'pentMaj', 'loads scale')
  t.equal(editor.el.querySelector('openmusic-transport openmusic-slider').value, 152, 'loads bpm')
  t.equal(editor.el.querySelectorAll('.sequence').length, 2, 'loads sequences')

})

tap.test('exports data', function(t){
  t.plan(1)

  // load some datas
  // click some stuff too
  // export => ?

  t.ok(true)
})


