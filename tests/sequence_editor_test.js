var tap = require('tape')
var SequenceEditor = require('../src/editor/sequence_editor')
var triggerChange = require('trigger-change')

tap.test('editor keeps data updated', function(t){
  t.plan(11)
  var editor = new SequenceEditor()

  var firstProbInput = editor.el.querySelector('.probs input')
  triggerChange(firstProbInput, 'magician')
  t.equal(editor.data.probs[editor.data.current][0], 'magician', 'input updates prob data')

  var firstNoteInput = editor.el.querySelector('.notes input')
  triggerChange(firstNoteInput, 'wonderful')
  t.equal(editor.data.notes[editor.data.current][0], 'wonderful', 'input updates note data')

  var nextsInput = editor.el.querySelector('input.nexts')
  triggerChange(nextsInput, 'crikey')
  t.equal(editor.data.nexts[editor.data.current][0], 'crikey', 'input updates nexts data')

  var before = editor.el.querySelectorAll('option').length
  var add = editor.el.querySelector('button')
  add.click()
  var after = editor.el.querySelectorAll('option').length
  t.equal(after, before + 1, 'add button adds new pattern') // TODO: maybe it should switch to it too?

  var currentInput = editor.el.querySelector('select')
  triggerChange(currentInput, '1')
  t.equal(editor.data.current, '1', 'current pattern can be updated')

  // STUFF GETS UPDATED
  t.equal(firstProbInput.value, '0', 'prob stuff changes')
  t.equal(firstNoteInput.value, '', 'note stuff changes')
  t.equal(nextsInput.value, '1', 'nexts stuff changes')

  triggerChange(currentInput, '0')

  t.equal(firstProbInput.value, 'magician', 'prob stuff restores')
  t.equal(firstNoteInput.value, 'wonderful', 'note stuff restores')
  t.equal(nextsInput.value, 'crikey', 'nexts stuff restores')
})


tap.test('editor exports data', function(t){
  t.plan(1)
  var editor = new SequenceEditor()

  triggerChange(editor.el.querySelector('.probs input'), '0.5')
  triggerChange(editor.el.querySelector('.notes input'), '0,-1')
  triggerChange(editor.el.querySelector('input.nexts'), '0,1')
  editor.el.querySelector('button').click()
  triggerChange(editor.el.querySelector('select'), '1')

  triggerChange(editor.el.querySelectorAll('.probs input')[15], '1')
  triggerChange(editor.el.querySelectorAll('.notes input')[15], '0,1')

  var expected = {
    probs: [[0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]],
    notes: [[[0,-1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]], [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0,1]]],
    nexts: [[0,1], [1]],
    current: 1,
    melodic: true
  }

  t.deepEqual(editor.export(), expected)
})

tap.test('editor imports data', function(t){
  t.plan(6)

  var editor = new SequenceEditor()
  var data = {
    probs: [[0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]],
    notes: [[[0,-1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]], [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0,1]]],
    nexts: [[0,1], [1]],
    current: 1,
    melodic: true
  }
  editor.import(data)

  t.equal(editor.el.querySelectorAll('.probs input')[15].value, '1', 'probs loaded')
  t.equal(editor.el.querySelectorAll('.notes input')[15].value, '0,1', 'notes loaded')
  t.equal(editor.el.querySelector('input.nexts').value, '1', 'nexts loaded')

  triggerChange(editor.el.querySelector('select'), '0')

  t.equal(editor.el.querySelector('.probs input').value, '0.5', 'other probs loaded')
  t.equal(editor.el.querySelector('.notes input').value, '0,-1', 'other notes loaded')
  t.equal(editor.el.querySelector('input.nexts').value, '0,1', 'other nexts loaded')
})