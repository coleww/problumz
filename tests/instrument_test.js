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
  t.plan(0)
  var inst = new Instrument()
})

tap.test('instrument imports/loads data', function(t){
  t.plan(0)
  var inst = new Instrument()
})