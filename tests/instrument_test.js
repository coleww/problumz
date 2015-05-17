var tap = require('tape')
var Instrument = require('../src/editor/instrument')
var triggerChange = require('trigger-change')

tap.test('instrument keeps data updated', function(t){
  t.plan(11)
  var inst = new Instrument()

  var firstProbInput = inst.el.querySelector('.probs input')
  triggerChange(firstProbInput, 'magician')
  t.equal(inst.data.probs[inst.data.current][0], 'magician', 'input updates prob data')

  var firstNoteInput = inst.el.querySelector('.notes input')
  triggerChange(firstNoteInput, 'wonderful')
  t.equal(inst.data.notes[inst.data.current][0], 'wonderful', 'input updates note data')

  var nextsInput = inst.el.querySelector('input.nexts')
  triggerChange(nextsInput, 'crikey')
  t.equal(inst.data.nexts[inst.data.current][0], 'crikey', 'input updates nexts data')

  var before = inst.el.querySelectorAll('option').length
  var add = inst.el.querySelector('button')
  add.click()
  var after = inst.el.querySelectorAll('option').length
  t.equal(after, before + 1, 'add button adds new pattern') // TODO: maybe it should switch to it too?

  var currentInput = inst.el.querySelector('select')
  triggerChange(currentInput, '1')
  t.equal(inst.data.current, '1', 'current pattern can be updated')

  // STUFF GETS UPDATED
  t.equal(firstProbInput.value, '0', 'prob stuff changes')
  t.equal(firstNoteInput.value, '', 'note stuff changes')
  t.equal(nextsInput.value, '1', 'nexts stuff changes')

  triggerChange(currentInput, '0')

  t.equal(firstProbInput.value, 'magician', 'prob stuff restores')
  t.equal(firstNoteInput.value, 'wonderful', 'note stuff restores')
  t.equal(nextsInput.value, 'crikey', 'nexts stuff restores')
})


tap.test('instrument exports data', function(t){
  t.plan(1)
  var inst = new Instrument()

  triggerChange(inst.el.querySelector('.probs input'), '0.5')
  triggerChange(inst.el.querySelector('.notes input'), '0,-1')
  triggerChange(inst.el.querySelector('input.nexts'), '0,1')
  inst.el.querySelector('button').click()
  triggerChange(inst.el.querySelector('select'), '1')

  triggerChange(inst.el.querySelectorAll('.probs input')[15], '1')
  triggerChange(inst.el.querySelectorAll('.notes input')[15], '0,1')

  var expected = {
    probs: [[0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]],
    notes: [[[0,-1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]], [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0,1]]],
    nexts: [[0,1], [1]],
    current: 1,
    melodic: true
  }

  t.deepEqual(inst.export(), expected)
})

tap.test('instrument imports data', function(t){
  t.plan(6)

  var inst = new Instrument()
  var data = {
    probs: [[0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]],
    notes: [[[0,-1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]], [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0,1]]],
    nexts: [[0,1], [1]],
    current: 1,
    melodic: true
  }
  inst.import(data)

  t.equal(inst.el.querySelectorAll('.probs input')[15].value, '1', 'probs loaded')
  t.equal(inst.el.querySelectorAll('.notes input')[15].value, '0,1', 'notes loaded')
  t.equal(inst.el.querySelector('input.nexts').value, '1', 'nexts loaded')

  triggerChange(inst.el.querySelector('select'), '0')

  t.equal(inst.el.querySelector('.probs input').value, '0.5', 'other probs loaded')
  t.equal(inst.el.querySelector('.notes input').value, '0,-1', 'other notes loaded')
  t.equal(inst.el.querySelector('input.nexts').value, '0,1', 'other nexts loaded')
})