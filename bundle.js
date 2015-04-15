(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var drums = [
  {
    name: 'clap'
  },
  {
    name: 'cym'
  },
  {
    name: 'hat'
  },
  {
    name: 'snare'
  },
  {
    name: 'kick'
  }
];
var synths = [
  {
    name: 'tri',
    type: 'triangle'
  },
  {
    name: 'sin',
    type: 'sine'
  }
];

var key = {
  tonic: 'C3',
  scale: 'major'
};

var STEPS = 16;
var BPM = 120;

var ac = new AudioContext();
var createInstruments = require('./src/instruments');
var instruments = createInstruments(ac, drums, synths);

var updateMarkers = require('./src/UI').updateMarkers;
var Sequencer = require('./src/sequencer');
var seq = new Sequencer(instruments, ac, BPM, STEPS, key, updateMarkers)
var createSeqUI = require('./src/UI').createSeqUI;
createSeqUI(seq);

},{"./src/UI":6,"./src/instruments":8,"./src/sequencer":10}],2:[function(require,module,exports){
module.exports = int2freq

var scales = {
  major: [2, 2, 1, 2, 2, 2, 1],
  minor: [2, 1, 2, 2, 1, 2, 2],
  pentMaj: [2, 2, 3, 2, 3],
  pentMin: [3, 2, 2, 3, 2]
}

var notes = [
  'A0', 'A#0', 'B0', 'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1',
  'A1', 'A#1', 'B1', 'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2',
  'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3',
  'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4',
  'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5',
  'A5', 'A#5', 'B5', 'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6',
  'A6', 'A#6', 'B6', 'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7',
  'A7', 'A#7', 'B7', 'C8'
]

var str2freq = {
  'A0': 27.5000, 'A#0': 29.1352, 'B0': 30.8677, 'C1': 32.7032, 'C#1': 34.6478, 'D1': 36.7081, 'D#1': 38.8909, 'E1': 41.2034, 'F1': 43.6535, 'F#1': 46.2493, 'G1': 48.9994, 'G#1': 51.9131,
  'A1': 55.0000, 'A#1': 58.2705, 'B1': 61.7354, 'C2': 65.4064, 'C#2': 69.2957, 'D2': 73.4162, 'D#2': 77.7817, 'E2': 82.4069, 'F2': 87.3071, 'F#2': 92.4986, 'G2': 97.9989, 'G#2': 103.826,
  'A2': 110.000, 'A#2': 116.541, 'B2': 123.471, 'C3': 130.813, 'C#3': 138.591, 'D3': 146.832, 'D#3': 155.563, 'E3': 164.814, 'F3': 174.614, 'F#3': 184.997, 'G3': 195.998, 'G#3': 207.652,
  'A3': 220.000, 'A#3': 233.082, 'B3': 246.942, 'C4': 261.626, 'C#4': 277.183, 'D4': 293.665, 'D#4': 311.127, 'E4': 329.628, 'F4': 349.228, 'F#4': 369.994, 'G4': 391.995, 'G#4': 415.305,
  'A4': 440.000, 'A#4': 466.164, 'B4': 493.883, 'C5': 523.251, 'C#5': 554.365, 'D5': 587.330, 'D#5': 622.254, 'E5': 659.255, 'F5': 698.456, 'F#5': 739.989, 'G5': 783.991, 'G#5': 830.609,
  'A5': 880.000, 'A#5': 932.328, 'B5': 987.767, 'C6': 1046.50, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22,
  'A6': 1760.00, 'A#6': 1864.66, 'B6': 1975.53, 'C7': 2093.00, 'C#7': 2217.46, 'D7': 2349.32, 'D#7': 2489.02, 'E7': 2637.02, 'F7': 2793.83, 'F#7': 2959.96, 'G7': 3135.96, 'G#7': 3322.44,
  'A7': 3520.00, 'A#7': 3729.31, 'B7': 3951.07, 'C8': 4186.01
}


function int2freq(intNote, options){
  var index, scale;
  if((index = notes.indexOf(options.tonic)) === -1) throw 'what is up with that tonic?'
  if(!(scale = scales[options.scale])) throw 'what is up with that scale?'
  while (Math.abs(intNote) > scale.length) scale = scale.concat(scale)
  if(intNote >= 0) for (var i = 0; i < intNote; index += scale[i], i+= 1 ){}
  else for (var j = -1; j >= intNote; index -= scale[scale.length + j], j-= 1){}
  return str2freq[notes[index]]
}
},{}],3:[function(require,module,exports){
(function() {

  var DCBias = require('openmusic-dcbias');

  function Oscillator(context) {

    var node = context.createGain();
    var oscillator;
    var frequencySignal;
    var properties = {};

    frequencySignal = DCBias(context);
    node.frequency = frequencySignal.gain;
    node.frequency.setValueAtTime(440, context.currentTime);

    ['type'].forEach(function(name) {
      Object.defineProperty(node, name, makePropertyGetterSetter(name));
    });

    node.start = function(when) {

      deinitialiseOscillator();

      initialiseOscillator();

      when = when !== undefined ? when : context.currentTime;

      oscillator.start(when);
    };

    node.stop = function(when) {
      oscillator.stop(when);
    };

    node.cancelScheduledEvents = function(when) {
      // automated params:
      node.frequency.cancelScheduledEvents(when);
    };

    return node;

    // ~~~

    function initialiseOscillator() {
      oscillator = context.createOscillator();
      oscillator.addEventListener('ended', onEnded);
      oscillator.connect(node);

      Object.keys(properties).forEach(function(name) {
        oscillator[name] = properties[name];
      });

      oscillator.frequency.setValueAtTime(0, context.currentTime);
      frequencySignal.connect(oscillator.frequency);
    }

    function deinitialiseOscillator() {
      if(oscillator) {
        oscillator.removeEventListener('ended', onEnded);
        oscillator.disconnect(node);
        frequencySignal.disconnect(oscillator.frequency);
        oscillator = null;
      }
    }

    function onEnded(e) {
      deinitialiseOscillator();
    }

    function makePropertyGetterSetter(property) {
      return {
        get: function() {
          return getProperty(property);
        },
        set: function(v) {
          setProperty(property, v);
        },
        enumerable: true
      };
    }

    function getProperty(name) {
      return properties[name];
    }

    function setProperty(name, value) {
      properties[name] = value;
      if(oscillator) {
        oscillator[name] = value;
      }
    }

  }

  //

  if(typeof module !== 'undefined' && module.exports) {
    module.exports = Oscillator;
  } else {
    this.Oscillator = Oscillator;
  }

}).call(this);


},{"openmusic-dcbias":4}],4:[function(require,module,exports){
(function() {

  function DCBias(context) {

    var output = context.createGain();
    var bufferSource = context.createBufferSource();
    var buffer = context.createBuffer(1, 1, context.sampleRate);

    buffer.getChannelData(0)[0] = 1.0;
    bufferSource.buffer = buffer;
    bufferSource.loop = true;

    bufferSource.connect(output);
    bufferSource.start(0);

    return output;

  }

  //

  if(typeof module !== 'undefined' && module.exports) {
    module.exports = DCBias;
  } else {
    this.DCBias = DCBias;
  }

}).call(this);

},{}],5:[function(require,module,exports){
function SamplePlayer(context) {
  var node = context.createGain();
  var bufferSource;
  var bufferSourceProperties = {};

  ['buffer', 'loop', 'loopStart', 'loopEnd'].forEach(function(name) {
    Object.defineProperty(node, name, makeBufferSourceGetterSetter(name));
  });

  // TODO: playbackRate which needs to be an AudioParam

  node.start = function(when, offset, duration) {
    // console.log('start', 'when', when, 'offset', offset, 'duration', duration);

    var buffer = bufferSourceProperties['buffer'];
    if(!buffer) {
      console.info('no buffer to play so byeee');
      return;
    }

    when = when !== undefined ? when : 0;
    offset = offset !== undefined ? offset : 0;

    // TODO This is mega ugly but urgh what is going on urgh
    // if I just pass 'undefined' as duration Chrome doesn't play anything
    if(window.webkitAudioContext) {
      console.log('correcting for chrome aghh');
      var sampleLength = buffer.length;
      duration = duration !== undefined ? duration : sampleLength - offset;
    }

    // Disconnect if existing, remove events listeners
    if(bufferSource) {
      bufferSource.removeEventListener('ended', onEnded);
      bufferSource.disconnect(node);
      bufferSource = null;
    }

    initialiseBufferSource();

    bufferSource.start(when, offset, duration);

  };

  node.stop = function(when) {
    bufferSource.stop(when);
  };

  node.cancelScheduledEvents = function(when) {
    // TODO: when there is automation
  };

  function initialiseBufferSource() {

    bufferSource = context.createBufferSource();
    bufferSource.addEventListener('ended', onEnded);
    bufferSource.connect(node);

    Object.keys(bufferSourceProperties).forEach(function(name) {
      bufferSource[name] = bufferSourceProperties[name];
    });

  }

  function onEnded(e) {
    var t = e.target;
    t.disconnect(node);
    initialiseBufferSource();
  }

  function makeBufferSourceGetterSetter(property) {
    return {
      get: function() {
        return getBufferSourceProperty(property);
      },
      set: function(v) {
        setBufferSourceProperty(property, v);
      },
      enumerable: true
    };
  }

  function getBufferSourceProperty(name) {
    return bufferSourceProperties[name];
  }

  function setBufferSourceProperty(name, value) {

    bufferSourceProperties[name] = value;

    if(bufferSource) {
      bufferSource[name] = value;
    }

  }

  return node;
}

module.exports = SamplePlayer;

},{}],6:[function(require,module,exports){
function createSaveLoadButtons(that){
  var saveBtn = document.createElement("button");
  saveBtn.textContent = "save all";
  saveBtn.addEventListener("click", function(){
    that.instruments.forEach(function(instrument){
      instrument.saveRows();
    })
  })
  document.body.appendChild(saveBtn);

  var loadBtn = document.createElement("button");
  loadBtn.textContent = "load all";
  loadBtn.addEventListener("click", function(){
    loadBtn.setAttribute("disabled", true);
    that.instruments.forEach(function(instrument){
      instrument.loadRows();
    })
  })
  document.body.appendChild(loadBtn);

  var exportBtn = document.createElement("button");
  exportBtn.textContent = "export junk";
  exportBtn.addEventListener("click", function(){
    var instruments = [];
    that.instruments.forEach(function(instrument){
      instruments.push(instrument.exportRows());
    })

    var state = {
      instruments: instruments,
      bpm: that.bpm,
      key: that.key
    }

    var download = document.createElement('a');
    download.textContent = "X";
    var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    download.setAttribute('href', data)
    document.body.appendChild(download)
  })
  document.body.appendChild(exportBtn);
}

function createMarkers(that){
  var markerRow = document.createElement("div")
  markerRow.setAttribute("class", "beat-markers");

  for(var i = 0; i < that.steps; i++){
    var marker = document.createElement("div");
    marker.setAttribute("class", "marker");
    if(i % 4 === 0) marker.setAttribute("class", "marker one-beat");
    marker.setAttribute("data-index", i);
    markerRow.appendChild(marker);
  }

  document.body.appendChild(markerRow);
  var clearFix = document.createElement("div");
  clearFix.setAttribute("class", "cf");
  document.body.appendChild(clearFix);
};

function createSlider(that){
  var slider = document.createElement("div");
  slider.setAttribute("class", "bpm-slider");
  var bpmInfo = document.createElement("span");
  bpmInfo.setAttribute("class", "bpm-info");
  bpmInfo.textContent = that.bpm+'bpm';
  var bpmSlider = document.createElement("input");
  bpmSlider.setAttribute("type", "range");
  bpmSlider.setAttribute("min", 5);
  bpmSlider.setAttribute("value", that.bpm);
  bpmSlider.setAttribute("max", 150);
  bpmSlider.oninput = function updateBPM(e){
    that.bpm = e.target.valueAsNumber;
    bpmInfo.textContent = that.bpm + 'bpm';

    var wasPlaying = !!that.interval;
    if(wasPlaying) {
      window.clearInterval(that.interval);
      that.run();
    }
  };
  slider.appendChild(bpmSlider);
  slider.appendChild(bpmInfo);
  document.body.appendChild(slider);
}

function createKeySelect(that){
  var keySelect = document.createElement("div");
  keySelect.setAttribute("class", "key-select")
  var tonic = document.createElement("select");
  ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].forEach(function(note){
    var opt = document.createElement("option");
    opt.value = opt.textContent = note;
    tonic.appendChild(opt);
  });

  tonic.addEventListener("change", function(e){
    that.key.tonic = e.target.value + "3";
  })

  keySelect.appendChild(tonic);


  var key = document.createElement("select");
  ["major", "minor", "pentMaj", "pentMin"].forEach(function(scale){
    var opt = document.createElement("option");
    opt.value = opt.textContent = scale;
    key.appendChild(opt);
  });

  key.addEventListener("change", function(e){
    that.key.scale = e.target.value;
  })

  keySelect.appendChild(key);

  document.body.appendChild(keySelect);
}

function createPowerButton(that){
  var powerBtn = document.createElement("button");
  powerBtn.textContent = "|>";
  powerBtn.addEventListener("click", function(){
    if(that.interval){
      window.clearInterval(that.interval);
      that.interval = undefined;
      powerBtn.textContent = "|>";
    } else {
      that.run();
      powerBtn.textContent = "| |";
    }
  })
  document.body.appendChild(powerBtn);
}

function updateMarkers(position, steps){
  lastPosition = position - 1;
  if(lastPosition < 0){
    lastPosition = steps - 1;
  }
  document.querySelector('.marker[data-index="'+lastPosition+'"]').classList.remove('active');

  document.querySelector('.marker[data-index="'+position+'"]').classList.add('active');
}

function createSeqUI(that){
  createMarkers(that);
  createSlider(that);
  createKeySelect(that);
  createPowerButton(that);
  createSaveLoadButtons(that);
}

function createDefaultInstrumentUI(that, container){
  var label = document.createElement("span");
  label.setAttribute("class", "label")
  label.textContent = that.name;
  container.appendChild(label);

  var currentSelect = document.createElement("select");
  currentSelect.addEventListener("change", function updateProbz(e){
    that.current = ~~e.target.value;
    that.loadRow();
  });
  for(var i = 0; i < 6; i++){
    var opt = document.createElement("option");
    opt.value = opt.textContent = i;
    currentSelect.appendChild(opt);
  }
  container.appendChild(currentSelect);

  var nextInput = document.createElement("input");
  nextInput.setAttribute("type", "text");
  nextInput.setAttribute("class", "nexts");
  nextInput.value = 0;
  nextInput.addEventListener("keyup", function updateProbz(e){
    that.nexts[that.current] = e.target.value.split(",");
  });
  container.appendChild(nextInput);

  var volSlider = document.createElement("input");
  volSlider.setAttribute("type", "range");
  volSlider.setAttribute("min", 0);
  volSlider.setAttribute("value", that.gain.gain.value);
  volSlider.setAttribute("step", 0.05);
  volSlider.setAttribute("max", 1);
  volSlider.oninput = function updateBPM(e){
    that.updateVolume(e.target.valueAsNumber);
  };
  container.appendChild(volSlider);

  var filterSlider = document.createElement("input");
  filterSlider.setAttribute("type", "range");
  filterSlider.setAttribute("min", 0);
  filterSlider.setAttribute("value", 350);
  filterSlider.setAttribute("max", 10000);
  filterSlider.oninput = function updateBPM(e){
    that.updateFilter(e.target.valueAsNumber);
  };
  container.appendChild(filterSlider);
}

function createSynthUI(that){
  var synth = document.createElement("div");
  synth.setAttribute("class", that.name);

  var synthProbs = document.createElement("div");
  synthProbs.setAttribute("class", "synth-probs");
  for(var i = 0; i < that.probs[that.current].length; i++){
    var cell = document.createElement("input");
    cell.setAttribute("type", "text")
    cell.setAttribute("class", "prob")
    if(i%4==0) cell.setAttribute("class", "prob one-beat");
    cell.setAttribute("data-index", i);
    cell.addEventListener("keyup", function updateProbz(e){
      that.probs[that.current][~~e.target.dataset.index] = parseFloat(e.target.value);
    });
    synthProbs.appendChild(cell);
  }

  var clearFix = document.createElement("div");
  clearFix.setAttribute("class", "cf");
  synthProbs.appendChild(clearFix);

  for(var i = 0; i < that.notes[that.current].length; i++){
    var cell = document.createElement("input");
    cell.setAttribute("type", "text")
    cell.setAttribute("class", "notes")
    if(i%4==0) cell.setAttribute("class", "notes one-beat");
    cell.setAttribute("data-index", i);
    cell.addEventListener("keyup", function updateProbz(e){
      that.notes[that.current][~~e.target.dataset.index] = e.target.value.split(",");
    });
    synthProbs.appendChild(cell);
  }

  synth.appendChild(synthProbs)
  createDefaultInstrumentUI(that, synth);
  return synth;
}

function createDrumUI(that){
  var drum = document.createElement("div");
  drum.setAttribute("class", that.name);

  for(var i = 0; i < that.probs[that.current].length; i++){
    var cell = document.createElement("input");
    cell.setAttribute("type", "text")
    cell.setAttribute("class", "prob")
    if(i%4==0) cell.setAttribute("class", "prob one-beat")
    cell.setAttribute("data-index", i);
    cell.addEventListener("keyup", function updateProbz(e){
      that.probs[that.current][~~e.target.dataset.index] = parseFloat(e.target.value);
    });
    drum.appendChild(cell);
  }

  createDefaultInstrumentUI(that, drum);
  return drum;
}

module.exports = {
  updateMarkers: updateMarkers,
  createSeqUI: createSeqUI,
  createDefaultInstrumentUI: createDefaultInstrumentUI,
  createSynthUI: createSynthUI,
  createDrumUI: createDrumUI
}
},{}],7:[function(require,module,exports){
var createDrumUI = require('./UI').createDrumUI;

var Drum = function(sampler, opts, gain, filter){
  this.gain = gain;
  this.filter = filter;
  this.sampler = sampler;
  this.name = opts.name;
  this.probs = []
  this.nexts = [];
  for(var i = 0; i < 6; i++) {
    this.probs.push(Array(16));
    this.nexts.push([0]);
  }
  this.current = 0;
  this.installRow();
}

Drum.prototype.play = function(pos){
  if(Math.random() < this.probs[this.current][pos]){
    this.sampler.start();
  }
}

Drum.prototype.installRow = function(){
  var drum = createDrumUI(this);

  document.body.appendChild(drum);
}

Drum.prototype.loadRows = function(){
  var that = this;
  var noteString = localStorage.getItem(this.name);
  if(!noteString) return;
  this.probs = noteString.split("$").map(function(row){
    return row.split(",");
  });

  var nextString = localStorage.getItem(this.name+"-nexts");
  if(!nextString) return;
  this.nexts = nextString.split("$").map(function(row){
    return row.split(",");
  });

  this.loadRow();
}

Drum.prototype.loadRow = function(){
  var that = this;
  this.probs[this.current].forEach(function(val, i){
    if(!isNaN(val)){
      document.querySelector('.'+that.name+' input[data-index="'+i+'"]').value = val;
    }
  });

  document.querySelector('.'+this.name+' .nexts').value = this.nexts[this.current].join(",");
  document.querySelector('.'+this.name+' select').value = this.current;
}

Drum.prototype.saveRows = function(){
  var rows = this.probs.map(function(row){
    return row.join(",");
  });
  localStorage.setItem(this.name, rows.join("$"));


  var nexts = this.nexts.map(function(next){
    return next.join(",");
  });
  localStorage.setItem(this.name+"-nexts", nexts.join("$"));
}

Drum.prototype.exportRows = function(){
  return {
    name: this.name,
    probs: this.probs,
    nexts: this.nexts
  }
}

Drum.prototype.updateVolume = function(val){
  this.gain.gain.value = val;
}

Drum.prototype.updateFilter = function(val){
  this.filter.frequency.value = val;
}

Drum.prototype.next = function(){
  var nexts = this.nexts[this.current];
  this.current = nexts[~~(Math.random() * nexts.length)];
  this.loadRow();
};

module.exports = Drum;
},{"./UI":6}],8:[function(require,module,exports){
var Sampler = require('./sampler');
var Drum = require('./drum');

var Oscillator = require('openmusic-oscillator');
var Synth = require('./synth');

module.exports = function createInstruments(ac, drums, synths){
  var instruments = [];

  drums.forEach(function(drum){
    var sampler = new Sampler(ac, 'samples/'+drum.name+'.wav');
    var gainNode = ac.createGain();
    sampler.connect(gainNode);
    var filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    gainNode.connect(filter);
    filter.connect(ac.destination);
    var drum = new Drum(sampler, drum, gainNode, filter);
    instruments.push(drum)
  });

  synths.forEach(function(synth){
    var oscillator = new Oscillator(ac);
    oscillator.type = synth.type;
    var gainNode = ac.createGain();
    oscillator.connect(gainNode);
    var filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    gainNode.connect(filter);
    filter.connect(ac.destination);
    var synthesizer = new Synth(oscillator, synth, gainNode, filter);
    instruments.push(synthesizer);
  });

  return instruments;
}
},{"./drum":7,"./sampler":9,"./synth":11,"openmusic-oscillator":3}],9:[function(require,module,exports){
var SamplePlayer = require('openmusic-sample-player');

module.exports = function(ac, path){
  var player = SamplePlayer(ac);

  var request = new XMLHttpRequest();
  request.open('GET', path, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    ac.decodeAudioData(request.response, onBufferLoaded, onBufferLoadError);
  };

  request.send();

  function onBufferLoaded(buffer) {
    player.buffer = buffer;
  }

  function onBufferLoadError(err) {
    console.error('oh no', err);
  }

  return player;
}
},{"openmusic-sample-player":5}],10:[function(require,module,exports){
function getTick(bpm){
  return ((60 * 1000) / bpm) / 4;
}

var Sequencer = function(instruments, ac, bpm, steps, key, updateUI){
  this.ac = ac;
  this.bpm = bpm;
  this.instruments = instruments;
  this.interval = null;
  this.key = key;
  this.position = 0;
  this.updateUI = updateUI;
  this.steps = steps;
};

Sequencer.prototype.run = function(){
  var that = this;
  var tick = getTick(that.bpm);
  this.interval = window.setInterval(function(){
    that.updateUI(that.position, that.steps);
    that.instruments.forEach(function(instrument){
      instrument.play(that.position, that.ac, that.key);
    })
    that.position++;
    if(that.position >= that.steps){
      that.instruments.forEach(function(instrument){
        instrument.next();
      });
      that.position = 0;
    }
  }, tick);
};

module.exports = Sequencer;
},{}],11:[function(require,module,exports){
var createSynthUI = require('./UI').createSynthUI;
var int2freq = require("int2freq");

var Synth = function(oscillator, opts, gain, filter){
  this.oscillator = oscillator;
  this.gain = gain;
  this.filter = filter;
  this.name = opts.name;
  this.type = opts.type;
  this.probs = [];
  this.notes = [];
  this.nexts = [];
  for(var i = 0; i < 6; i++) {
    this.probs.push(Array(16));
    this.notes.push(Array(16));
    this.nexts.push([0]);
  }
  this.current = 0;
  this.playing = false;
  this.installRow();
}

Synth.prototype.play = function(pos, ac, key){
  if(Math.random() < this.probs[this.current][pos]){
    var noteInt = this.notes[this.current][pos][~~(Math.random() * this.notes[this.current][pos].length)]
    if(!noteInt) noteInt = 0;
    var freq = int2freq(~~noteInt, key);
    this.oscillator.frequency.setValueAtTime(freq, ac.currentTime);
    this.oscillator.start();
    this.playing = true;
  } else {
    if(this.playing) this.oscillator.stop(ac.currentTime);
    this.playing = false
  }
}

Synth.prototype.installRow = function(){
  synth = createSynthUI(this);

  document.body.appendChild(synth);
}

Synth.prototype.saveRows = function(){
  var probs = this.probs.map(function(prob){
    return prob.join(",");
  });
  var notes = this.notes.map(function(note){
    return note.join("|");
  });
  var nexts = this.nexts.map(function(next){
    return next.join(",");
  });
  localStorage.setItem(this.name+"-probs", probs.join("$"));
  localStorage.setItem(this.name+"-notes", notes.join("$"));
  localStorage.setItem(this.name+"-nexts", nexts.join("$"));
}

Synth.prototype.loadRows = function(){
  var that = this;
  var probString = localStorage.getItem(this.name+"-probs");
  if(!probString) return;
  this.probs = probString.split("$").map(function(row){
    return row.split(",");
  });

  var notesString = localStorage.getItem(this.name+"-notes");
  if(!notesString) return;
  this.notes = notesString.split("$").map(function(row){
    return row.split("|").map(function(cell){
      return cell.split(",");
    });
  });

  var nextString = localStorage.getItem(this.name+"-nexts");
  if(!nextString) return;
  this.nexts = nextString.split("$").map(function(row){
    return row.split(",");
  });

  this.loadRow();
};

Synth.prototype.loadRow = function(){
  var that = this;
  this.probs[this.current].forEach(function(val, i){
    document.querySelector('.'+that.name+' input[data-index="'+i+'"].prob').value = val;
  });

  this.notes[this.current].forEach(function(val, i){
    document.querySelector('.'+that.name+' input[data-index="'+i+'"].notes').value = val.join(",");
  });

  document.querySelector('.'+this.name+' .nexts').value = this.nexts[this.current].join(",");
  document.querySelector('.'+this.name+' select').value = this.current;
};

Synth.prototype.exportRows = function(){
  return {
    name: this.name,
    type: this.type,
    probs: this.probs,
    notes: this.notes,
    nexts: this.nexts
  }
}


Synth.prototype.updateVolume = function(val){
  this.gain.gain.value = val;
}

Synth.prototype.updateFilter = function(val){
  this.filter.frequency.value = val;
}

Synth.prototype.next = function(){
  var nexts = this.nexts[this.current];
  this.current = nexts[~~(Math.random() * nexts.length)];
  this.loadRow();
};

module.exports = Synth;
},{"./UI":6,"int2freq":2}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbnQyZnJlcS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vcGVubXVzaWMtb3NjaWxsYXRvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vcGVubXVzaWMtb3NjaWxsYXRvci9ub2RlX21vZHVsZXMvb3Blbm11c2ljLWRjYmlhcy9EQ0JpYXMuanMiLCJub2RlX21vZHVsZXMvb3Blbm11c2ljLXNhbXBsZS1wbGF5ZXIvaW5kZXguanMiLCJzcmMvVUkuanMiLCJzcmMvZHJ1bS5qcyIsInNyYy9pbnN0cnVtZW50cy5qcyIsInNyYy9zYW1wbGVyLmpzIiwic3JjL3NlcXVlbmNlci5qcyIsInNyYy9zeW50aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZHJ1bXMgPSBbXG4gIHtcbiAgICBuYW1lOiAnY2xhcCdcbiAgfSxcbiAge1xuICAgIG5hbWU6ICdjeW0nXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAnaGF0J1xuICB9LFxuICB7XG4gICAgbmFtZTogJ3NuYXJlJ1xuICB9LFxuICB7XG4gICAgbmFtZTogJ2tpY2snXG4gIH1cbl07XG52YXIgc3ludGhzID0gW1xuICB7XG4gICAgbmFtZTogJ3RyaScsXG4gICAgdHlwZTogJ3RyaWFuZ2xlJ1xuICB9LFxuICB7XG4gICAgbmFtZTogJ3NpbicsXG4gICAgdHlwZTogJ3NpbmUnXG4gIH1cbl07XG5cbnZhciBrZXkgPSB7XG4gIHRvbmljOiAnQzMnLFxuICBzY2FsZTogJ21ham9yJ1xufTtcblxudmFyIFNURVBTID0gMTY7XG52YXIgQlBNID0gMTIwO1xuXG52YXIgYWMgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG52YXIgY3JlYXRlSW5zdHJ1bWVudHMgPSByZXF1aXJlKCcuL3NyYy9pbnN0cnVtZW50cycpO1xudmFyIGluc3RydW1lbnRzID0gY3JlYXRlSW5zdHJ1bWVudHMoYWMsIGRydW1zLCBzeW50aHMpO1xuXG52YXIgdXBkYXRlTWFya2VycyA9IHJlcXVpcmUoJy4vc3JjL1VJJykudXBkYXRlTWFya2VycztcbnZhciBTZXF1ZW5jZXIgPSByZXF1aXJlKCcuL3NyYy9zZXF1ZW5jZXInKTtcbnZhciBzZXEgPSBuZXcgU2VxdWVuY2VyKGluc3RydW1lbnRzLCBhYywgQlBNLCBTVEVQUywga2V5LCB1cGRhdGVNYXJrZXJzKVxudmFyIGNyZWF0ZVNlcVVJID0gcmVxdWlyZSgnLi9zcmMvVUknKS5jcmVhdGVTZXFVSTtcbmNyZWF0ZVNlcVVJKHNlcSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGludDJmcmVxXG5cbnZhciBzY2FsZXMgPSB7XG4gIG1ham9yOiBbMiwgMiwgMSwgMiwgMiwgMiwgMV0sXG4gIG1pbm9yOiBbMiwgMSwgMiwgMiwgMSwgMiwgMl0sXG4gIHBlbnRNYWo6IFsyLCAyLCAzLCAyLCAzXSxcbiAgcGVudE1pbjogWzMsIDIsIDIsIDMsIDJdXG59XG5cbnZhciBub3RlcyA9IFtcbiAgJ0EwJywgJ0EjMCcsICdCMCcsICdDMScsICdDIzEnLCAnRDEnLCAnRCMxJywgJ0UxJywgJ0YxJywgJ0YjMScsICdHMScsICdHIzEnLFxuICAnQTEnLCAnQSMxJywgJ0IxJywgJ0MyJywgJ0MjMicsICdEMicsICdEIzInLCAnRTInLCAnRjInLCAnRiMyJywgJ0cyJywgJ0cjMicsXG4gICdBMicsICdBIzInLCAnQjInLCAnQzMnLCAnQyMzJywgJ0QzJywgJ0QjMycsICdFMycsICdGMycsICdGIzMnLCAnRzMnLCAnRyMzJyxcbiAgJ0EzJywgJ0EjMycsICdCMycsICdDNCcsICdDIzQnLCAnRDQnLCAnRCM0JywgJ0U0JywgJ0Y0JywgJ0YjNCcsICdHNCcsICdHIzQnLFxuICAnQTQnLCAnQSM0JywgJ0I0JywgJ0M1JywgJ0MjNScsICdENScsICdEIzUnLCAnRTUnLCAnRjUnLCAnRiM1JywgJ0c1JywgJ0cjNScsXG4gICdBNScsICdBIzUnLCAnQjUnLCAnQzYnLCAnQyM2JywgJ0Q2JywgJ0QjNicsICdFNicsICdGNicsICdGIzYnLCAnRzYnLCAnRyM2JyxcbiAgJ0E2JywgJ0EjNicsICdCNicsICdDNycsICdDIzcnLCAnRDcnLCAnRCM3JywgJ0U3JywgJ0Y3JywgJ0YjNycsICdHNycsICdHIzcnLFxuICAnQTcnLCAnQSM3JywgJ0I3JywgJ0M4J1xuXVxuXG52YXIgc3RyMmZyZXEgPSB7XG4gICdBMCc6IDI3LjUwMDAsICdBIzAnOiAyOS4xMzUyLCAnQjAnOiAzMC44Njc3LCAnQzEnOiAzMi43MDMyLCAnQyMxJzogMzQuNjQ3OCwgJ0QxJzogMzYuNzA4MSwgJ0QjMSc6IDM4Ljg5MDksICdFMSc6IDQxLjIwMzQsICdGMSc6IDQzLjY1MzUsICdGIzEnOiA0Ni4yNDkzLCAnRzEnOiA0OC45OTk0LCAnRyMxJzogNTEuOTEzMSxcbiAgJ0ExJzogNTUuMDAwMCwgJ0EjMSc6IDU4LjI3MDUsICdCMSc6IDYxLjczNTQsICdDMic6IDY1LjQwNjQsICdDIzInOiA2OS4yOTU3LCAnRDInOiA3My40MTYyLCAnRCMyJzogNzcuNzgxNywgJ0UyJzogODIuNDA2OSwgJ0YyJzogODcuMzA3MSwgJ0YjMic6IDkyLjQ5ODYsICdHMic6IDk3Ljk5ODksICdHIzInOiAxMDMuODI2LFxuICAnQTInOiAxMTAuMDAwLCAnQSMyJzogMTE2LjU0MSwgJ0IyJzogMTIzLjQ3MSwgJ0MzJzogMTMwLjgxMywgJ0MjMyc6IDEzOC41OTEsICdEMyc6IDE0Ni44MzIsICdEIzMnOiAxNTUuNTYzLCAnRTMnOiAxNjQuODE0LCAnRjMnOiAxNzQuNjE0LCAnRiMzJzogMTg0Ljk5NywgJ0czJzogMTk1Ljk5OCwgJ0cjMyc6IDIwNy42NTIsXG4gICdBMyc6IDIyMC4wMDAsICdBIzMnOiAyMzMuMDgyLCAnQjMnOiAyNDYuOTQyLCAnQzQnOiAyNjEuNjI2LCAnQyM0JzogMjc3LjE4MywgJ0Q0JzogMjkzLjY2NSwgJ0QjNCc6IDMxMS4xMjcsICdFNCc6IDMyOS42MjgsICdGNCc6IDM0OS4yMjgsICdGIzQnOiAzNjkuOTk0LCAnRzQnOiAzOTEuOTk1LCAnRyM0JzogNDE1LjMwNSxcbiAgJ0E0JzogNDQwLjAwMCwgJ0EjNCc6IDQ2Ni4xNjQsICdCNCc6IDQ5My44ODMsICdDNSc6IDUyMy4yNTEsICdDIzUnOiA1NTQuMzY1LCAnRDUnOiA1ODcuMzMwLCAnRCM1JzogNjIyLjI1NCwgJ0U1JzogNjU5LjI1NSwgJ0Y1JzogNjk4LjQ1NiwgJ0YjNSc6IDczOS45ODksICdHNSc6IDc4My45OTEsICdHIzUnOiA4MzAuNjA5LFxuICAnQTUnOiA4ODAuMDAwLCAnQSM1JzogOTMyLjMyOCwgJ0I1JzogOTg3Ljc2NywgJ0M2JzogMTA0Ni41MCwgJ0MjNic6IDExMDguNzMsICdENic6IDExNzQuNjYsICdEIzYnOiAxMjQ0LjUxLCAnRTYnOiAxMzE4LjUxLCAnRjYnOiAxMzk2LjkxLCAnRiM2JzogMTQ3OS45OCwgJ0c2JzogMTU2Ny45OCwgJ0cjNic6IDE2NjEuMjIsXG4gICdBNic6IDE3NjAuMDAsICdBIzYnOiAxODY0LjY2LCAnQjYnOiAxOTc1LjUzLCAnQzcnOiAyMDkzLjAwLCAnQyM3JzogMjIxNy40NiwgJ0Q3JzogMjM0OS4zMiwgJ0QjNyc6IDI0ODkuMDIsICdFNyc6IDI2MzcuMDIsICdGNyc6IDI3OTMuODMsICdGIzcnOiAyOTU5Ljk2LCAnRzcnOiAzMTM1Ljk2LCAnRyM3JzogMzMyMi40NCxcbiAgJ0E3JzogMzUyMC4wMCwgJ0EjNyc6IDM3MjkuMzEsICdCNyc6IDM5NTEuMDcsICdDOCc6IDQxODYuMDFcbn1cblxuXG5mdW5jdGlvbiBpbnQyZnJlcShpbnROb3RlLCBvcHRpb25zKXtcbiAgdmFyIGluZGV4LCBzY2FsZTtcbiAgaWYoKGluZGV4ID0gbm90ZXMuaW5kZXhPZihvcHRpb25zLnRvbmljKSkgPT09IC0xKSB0aHJvdyAnd2hhdCBpcyB1cCB3aXRoIHRoYXQgdG9uaWM/J1xuICBpZighKHNjYWxlID0gc2NhbGVzW29wdGlvbnMuc2NhbGVdKSkgdGhyb3cgJ3doYXQgaXMgdXAgd2l0aCB0aGF0IHNjYWxlPydcbiAgd2hpbGUgKE1hdGguYWJzKGludE5vdGUpID4gc2NhbGUubGVuZ3RoKSBzY2FsZSA9IHNjYWxlLmNvbmNhdChzY2FsZSlcbiAgaWYoaW50Tm90ZSA+PSAwKSBmb3IgKHZhciBpID0gMDsgaSA8IGludE5vdGU7IGluZGV4ICs9IHNjYWxlW2ldLCBpKz0gMSApe31cbiAgZWxzZSBmb3IgKHZhciBqID0gLTE7IGogPj0gaW50Tm90ZTsgaW5kZXggLT0gc2NhbGVbc2NhbGUubGVuZ3RoICsgal0sIGotPSAxKXt9XG4gIHJldHVybiBzdHIyZnJlcVtub3Rlc1tpbmRleF1dXG59IiwiKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBEQ0JpYXMgPSByZXF1aXJlKCdvcGVubXVzaWMtZGNiaWFzJyk7XG5cblx0ZnVuY3Rpb24gT3NjaWxsYXRvcihjb250ZXh0KSB7XG5cdFx0XG5cdFx0dmFyIG5vZGUgPSBjb250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0XHR2YXIgb3NjaWxsYXRvcjtcblx0XHR2YXIgZnJlcXVlbmN5U2lnbmFsO1xuXHRcdHZhciBwcm9wZXJ0aWVzID0ge307XG5cblx0XHRmcmVxdWVuY3lTaWduYWwgPSBEQ0JpYXMoY29udGV4dCk7XG5cdFx0bm9kZS5mcmVxdWVuY3kgPSBmcmVxdWVuY3lTaWduYWwuZ2Fpbjtcblx0XHRub2RlLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZSg0NDAsIGNvbnRleHQuY3VycmVudFRpbWUpO1xuXG5cdFx0Wyd0eXBlJ10uZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgbmFtZSwgbWFrZVByb3BlcnR5R2V0dGVyU2V0dGVyKG5hbWUpKTtcblx0XHR9KTtcblxuXHRcdG5vZGUuc3RhcnQgPSBmdW5jdGlvbih3aGVuKSB7XG5cblx0XHRcdGRlaW5pdGlhbGlzZU9zY2lsbGF0b3IoKTtcblxuXHRcdFx0aW5pdGlhbGlzZU9zY2lsbGF0b3IoKTtcblxuXHRcdFx0d2hlbiA9IHdoZW4gIT09IHVuZGVmaW5lZCA/IHdoZW4gOiBjb250ZXh0LmN1cnJlbnRUaW1lO1xuXG5cdFx0XHRvc2NpbGxhdG9yLnN0YXJ0KHdoZW4pO1xuXHRcdH07XG5cblx0XHRub2RlLnN0b3AgPSBmdW5jdGlvbih3aGVuKSB7XG5cdFx0XHRvc2NpbGxhdG9yLnN0b3Aod2hlbik7XG5cdFx0fTtcblxuXHRcdG5vZGUuY2FuY2VsU2NoZWR1bGVkRXZlbnRzID0gZnVuY3Rpb24od2hlbikge1xuXHRcdFx0Ly8gYXV0b21hdGVkIHBhcmFtczpcblx0XHRcdG5vZGUuZnJlcXVlbmN5LmNhbmNlbFNjaGVkdWxlZEV2ZW50cyh3aGVuKTtcblx0XHR9O1xuXG5cdFx0cmV0dXJuIG5vZGU7XG5cblx0XHQvLyB+fn5cblxuXHRcdGZ1bmN0aW9uIGluaXRpYWxpc2VPc2NpbGxhdG9yKCkge1xuXHRcdFx0b3NjaWxsYXRvciA9IGNvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuXHRcdFx0b3NjaWxsYXRvci5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsIG9uRW5kZWQpO1xuXHRcdFx0b3NjaWxsYXRvci5jb25uZWN0KG5vZGUpO1xuXG5cdFx0XHRPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRcdFx0b3NjaWxsYXRvcltuYW1lXSA9IHByb3BlcnRpZXNbbmFtZV07XG5cdFx0XHR9KTtcblxuXHRcdFx0b3NjaWxsYXRvci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoMCwgY29udGV4dC5jdXJyZW50VGltZSk7XG5cdFx0XHRmcmVxdWVuY3lTaWduYWwuY29ubmVjdChvc2NpbGxhdG9yLmZyZXF1ZW5jeSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZGVpbml0aWFsaXNlT3NjaWxsYXRvcigpIHtcblx0XHRcdGlmKG9zY2lsbGF0b3IpIHtcblx0XHRcdFx0b3NjaWxsYXRvci5yZW1vdmVFdmVudExpc3RlbmVyKCdlbmRlZCcsIG9uRW5kZWQpO1xuXHRcdFx0XHRvc2NpbGxhdG9yLmRpc2Nvbm5lY3Qobm9kZSk7XG5cdFx0XHRcdGZyZXF1ZW5jeVNpZ25hbC5kaXNjb25uZWN0KG9zY2lsbGF0b3IuZnJlcXVlbmN5KTtcblx0XHRcdFx0b3NjaWxsYXRvciA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gb25FbmRlZChlKSB7XG5cdFx0XHRkZWluaXRpYWxpc2VPc2NpbGxhdG9yKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbWFrZVByb3BlcnR5R2V0dGVyU2V0dGVyKHByb3BlcnR5KSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiBnZXRQcm9wZXJ0eShwcm9wZXJ0eSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdHNldFByb3BlcnR5KHByb3BlcnR5LCB2KTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRQcm9wZXJ0eShuYW1lKSB7XG5cdFx0XHRyZXR1cm4gcHJvcGVydGllc1tuYW1lXTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRQcm9wZXJ0eShuYW1lLCB2YWx1ZSkge1xuXHRcdFx0cHJvcGVydGllc1tuYW1lXSA9IHZhbHVlO1xuXHRcdFx0aWYob3NjaWxsYXRvcikge1xuXHRcdFx0XHRvc2NpbGxhdG9yW25hbWVdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHQvL1xuXHRcblx0aWYodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IE9zY2lsbGF0b3I7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy5Pc2NpbGxhdG9yID0gT3NjaWxsYXRvcjtcblx0fVxuXG59KS5jYWxsKHRoaXMpO1xuXG4iLCIoZnVuY3Rpb24oKSB7XG5cdFxuXHRmdW5jdGlvbiBEQ0JpYXMoY29udGV4dCkge1xuXHRcdFxuXHRcdHZhciBvdXRwdXQgPSBjb250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0XHR2YXIgYnVmZmVyU291cmNlID0gY29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcblx0XHR2YXIgYnVmZmVyID0gY29udGV4dC5jcmVhdGVCdWZmZXIoMSwgMSwgY29udGV4dC5zYW1wbGVSYXRlKTtcblxuXHRcdGJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKVswXSA9IDEuMDtcblx0XHRidWZmZXJTb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuXHRcdGJ1ZmZlclNvdXJjZS5sb29wID0gdHJ1ZTtcblx0XHRcblx0XHRidWZmZXJTb3VyY2UuY29ubmVjdChvdXRwdXQpO1xuXHRcdGJ1ZmZlclNvdXJjZS5zdGFydCgwKTtcblx0XHRcblx0XHRyZXR1cm4gb3V0cHV0O1xuXHRcdFxuXHR9XG5cblx0Ly9cblx0XG5cdGlmKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBEQ0JpYXM7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy5EQ0JpYXMgPSBEQ0JpYXM7XG5cdH1cblxufSkuY2FsbCh0aGlzKTtcbiIsImZ1bmN0aW9uIFNhbXBsZVBsYXllcihjb250ZXh0KSB7XG5cdHZhciBub2RlID0gY29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZhciBidWZmZXJTb3VyY2U7XG5cdHZhciBidWZmZXJTb3VyY2VQcm9wZXJ0aWVzID0ge307XG5cblx0WydidWZmZXInLCAnbG9vcCcsICdsb29wU3RhcnQnLCAnbG9vcEVuZCddLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShub2RlLCBuYW1lLCBtYWtlQnVmZmVyU291cmNlR2V0dGVyU2V0dGVyKG5hbWUpKTtcblx0fSk7XG5cblx0Ly8gVE9ETzogcGxheWJhY2tSYXRlIHdoaWNoIG5lZWRzIHRvIGJlIGFuIEF1ZGlvUGFyYW1cblxuXHRub2RlLnN0YXJ0ID0gZnVuY3Rpb24od2hlbiwgb2Zmc2V0LCBkdXJhdGlvbikge1xuXHRcdC8vIGNvbnNvbGUubG9nKCdzdGFydCcsICd3aGVuJywgd2hlbiwgJ29mZnNldCcsIG9mZnNldCwgJ2R1cmF0aW9uJywgZHVyYXRpb24pO1xuXG5cdFx0dmFyIGJ1ZmZlciA9IGJ1ZmZlclNvdXJjZVByb3BlcnRpZXNbJ2J1ZmZlciddO1xuXHRcdGlmKCFidWZmZXIpIHtcblx0XHRcdGNvbnNvbGUuaW5mbygnbm8gYnVmZmVyIHRvIHBsYXkgc28gYnllZWUnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cdFx0b2Zmc2V0ID0gb2Zmc2V0ICE9PSB1bmRlZmluZWQgPyBvZmZzZXQgOiAwO1xuXHRcdFxuXHRcdC8vIFRPRE8gVGhpcyBpcyBtZWdhIHVnbHkgYnV0IHVyZ2ggd2hhdCBpcyBnb2luZyBvbiB1cmdoXG5cdFx0Ly8gaWYgSSBqdXN0IHBhc3MgJ3VuZGVmaW5lZCcgYXMgZHVyYXRpb24gQ2hyb21lIGRvZXNuJ3QgcGxheSBhbnl0aGluZ1xuXHRcdGlmKHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdjb3JyZWN0aW5nIGZvciBjaHJvbWUgYWdoaCcpO1xuXHRcdFx0dmFyIHNhbXBsZUxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG5cdFx0XHRkdXJhdGlvbiA9IGR1cmF0aW9uICE9PSB1bmRlZmluZWQgPyBkdXJhdGlvbiA6IHNhbXBsZUxlbmd0aCAtIG9mZnNldDtcblx0XHR9XG5cblx0XHQvLyBEaXNjb25uZWN0IGlmIGV4aXN0aW5nLCByZW1vdmUgZXZlbnRzIGxpc3RlbmVyc1xuXHRcdGlmKGJ1ZmZlclNvdXJjZSkge1xuXHRcdFx0YnVmZmVyU291cmNlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgb25FbmRlZCk7XG5cdFx0XHRidWZmZXJTb3VyY2UuZGlzY29ubmVjdChub2RlKTtcblx0XHRcdGJ1ZmZlclNvdXJjZSA9IG51bGw7XG5cdFx0fVxuXG5cdFx0aW5pdGlhbGlzZUJ1ZmZlclNvdXJjZSgpO1xuXG5cdFx0YnVmZmVyU291cmNlLnN0YXJ0KHdoZW4sIG9mZnNldCwgZHVyYXRpb24pO1xuXG5cdH07XG5cblx0bm9kZS5zdG9wID0gZnVuY3Rpb24od2hlbikge1xuXHRcdGJ1ZmZlclNvdXJjZS5zdG9wKHdoZW4pO1xuXHR9O1xuXG5cdG5vZGUuY2FuY2VsU2NoZWR1bGVkRXZlbnRzID0gZnVuY3Rpb24od2hlbikge1xuXHRcdC8vIFRPRE86IHdoZW4gdGhlcmUgaXMgYXV0b21hdGlvblxuXHR9O1xuXG5cdGZ1bmN0aW9uIGluaXRpYWxpc2VCdWZmZXJTb3VyY2UoKSB7XG5cdFx0XG5cdFx0YnVmZmVyU291cmNlID0gY29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcblx0XHRidWZmZXJTb3VyY2UuYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCBvbkVuZGVkKTtcblx0XHRidWZmZXJTb3VyY2UuY29ubmVjdChub2RlKTtcblxuXHRcdE9iamVjdC5rZXlzKGJ1ZmZlclNvdXJjZVByb3BlcnRpZXMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuXHRcdFx0YnVmZmVyU291cmNlW25hbWVdID0gYnVmZmVyU291cmNlUHJvcGVydGllc1tuYW1lXTtcblx0XHR9KTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gb25FbmRlZChlKSB7XG5cdFx0dmFyIHQgPSBlLnRhcmdldDtcblx0XHR0LmRpc2Nvbm5lY3Qobm9kZSk7XG5cdFx0aW5pdGlhbGlzZUJ1ZmZlclNvdXJjZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbWFrZUJ1ZmZlclNvdXJjZUdldHRlclNldHRlcihwcm9wZXJ0eSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gZ2V0QnVmZmVyU291cmNlUHJvcGVydHkocHJvcGVydHkpO1xuXHRcdFx0fSxcblx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRzZXRCdWZmZXJTb3VyY2VQcm9wZXJ0eShwcm9wZXJ0eSwgdik7XG5cdFx0XHR9LFxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZVxuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRCdWZmZXJTb3VyY2VQcm9wZXJ0eShuYW1lKSB7XG5cdFx0cmV0dXJuIGJ1ZmZlclNvdXJjZVByb3BlcnRpZXNbbmFtZV07XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRCdWZmZXJTb3VyY2VQcm9wZXJ0eShuYW1lLCB2YWx1ZSkge1xuXG5cdFx0YnVmZmVyU291cmNlUHJvcGVydGllc1tuYW1lXSA9IHZhbHVlO1xuXG5cdFx0aWYoYnVmZmVyU291cmNlKSB7XG5cdFx0XHRidWZmZXJTb3VyY2VbbmFtZV0gPSB2YWx1ZTtcblx0XHR9XG5cblx0fVxuXG5cdHJldHVybiBub2RlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNhbXBsZVBsYXllcjtcbiIsImZ1bmN0aW9uIGNyZWF0ZVNhdmVMb2FkQnV0dG9ucyh0aGF0KXtcbiAgdmFyIHNhdmVCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICBzYXZlQnRuLnRleHRDb250ZW50ID0gXCJzYXZlIGFsbFwiO1xuICBzYXZlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgIHRoYXQuaW5zdHJ1bWVudHMuZm9yRWFjaChmdW5jdGlvbihpbnN0cnVtZW50KXtcbiAgICAgIGluc3RydW1lbnQuc2F2ZVJvd3MoKTtcbiAgICB9KVxuICB9KVxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNhdmVCdG4pO1xuXG4gIHZhciBsb2FkQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgbG9hZEJ0bi50ZXh0Q29udGVudCA9IFwibG9hZCBhbGxcIjtcbiAgbG9hZEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICBsb2FkQnRuLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIHRydWUpO1xuICAgIHRoYXQuaW5zdHJ1bWVudHMuZm9yRWFjaChmdW5jdGlvbihpbnN0cnVtZW50KXtcbiAgICAgIGluc3RydW1lbnQubG9hZFJvd3MoKTtcbiAgICB9KVxuICB9KVxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxvYWRCdG4pO1xuXG4gIHZhciBleHBvcnRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICBleHBvcnRCdG4udGV4dENvbnRlbnQgPSBcImV4cG9ydCBqdW5rXCI7XG4gIGV4cG9ydEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICB2YXIgaW5zdHJ1bWVudHMgPSBbXTtcbiAgICB0aGF0Lmluc3RydW1lbnRzLmZvckVhY2goZnVuY3Rpb24oaW5zdHJ1bWVudCl7XG4gICAgICBpbnN0cnVtZW50cy5wdXNoKGluc3RydW1lbnQuZXhwb3J0Um93cygpKTtcbiAgICB9KVxuXG4gICAgdmFyIHN0YXRlID0ge1xuICAgICAgaW5zdHJ1bWVudHM6IGluc3RydW1lbnRzLFxuICAgICAgYnBtOiB0aGF0LmJwbSxcbiAgICAgIGtleTogdGhhdC5rZXlcbiAgICB9XG5cbiAgICB2YXIgZG93bmxvYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgZG93bmxvYWQudGV4dENvbnRlbnQgPSBcIlhcIjtcbiAgICB2YXIgZGF0YSA9IFwiZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGYtOCxcIiArIGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzdGF0ZSkpO1xuICAgIGRvd25sb2FkLnNldEF0dHJpYnV0ZSgnaHJlZicsIGRhdGEpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb3dubG9hZClcbiAgfSlcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChleHBvcnRCdG4pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVNYXJrZXJzKHRoYXQpe1xuICB2YXIgbWFya2VyUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICBtYXJrZXJSb3cuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJiZWF0LW1hcmtlcnNcIik7XG5cbiAgZm9yKHZhciBpID0gMDsgaSA8IHRoYXQuc3RlcHM7IGkrKyl7XG4gICAgdmFyIG1hcmtlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgbWFya2VyLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibWFya2VyXCIpO1xuICAgIGlmKGkgJSA0ID09PSAwKSBtYXJrZXIuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtYXJrZXIgb25lLWJlYXRcIik7XG4gICAgbWFya2VyLnNldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIiwgaSk7XG4gICAgbWFya2VyUm93LmFwcGVuZENoaWxkKG1hcmtlcik7XG4gIH1cblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1hcmtlclJvdyk7XG4gIHZhciBjbGVhckZpeCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGNsZWFyRml4LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiY2ZcIik7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2xlYXJGaXgpO1xufTtcblxuZnVuY3Rpb24gY3JlYXRlU2xpZGVyKHRoYXQpe1xuICB2YXIgc2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgc2xpZGVyLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYnBtLXNsaWRlclwiKTtcbiAgdmFyIGJwbUluZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgYnBtSW5mby5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImJwbS1pbmZvXCIpO1xuICBicG1JbmZvLnRleHRDb250ZW50ID0gdGhhdC5icG0rJ2JwbSc7XG4gIHZhciBicG1TbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gIGJwbVNsaWRlci5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwicmFuZ2VcIik7XG4gIGJwbVNsaWRlci5zZXRBdHRyaWJ1dGUoXCJtaW5cIiwgNSk7XG4gIGJwbVNsaWRlci5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB0aGF0LmJwbSk7XG4gIGJwbVNsaWRlci5zZXRBdHRyaWJ1dGUoXCJtYXhcIiwgMTUwKTtcbiAgYnBtU2xpZGVyLm9uaW5wdXQgPSBmdW5jdGlvbiB1cGRhdGVCUE0oZSl7XG4gICAgdGhhdC5icG0gPSBlLnRhcmdldC52YWx1ZUFzTnVtYmVyO1xuICAgIGJwbUluZm8udGV4dENvbnRlbnQgPSB0aGF0LmJwbSArICdicG0nO1xuXG4gICAgdmFyIHdhc1BsYXlpbmcgPSAhIXRoYXQuaW50ZXJ2YWw7XG4gICAgaWYod2FzUGxheWluZykge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhhdC5pbnRlcnZhbCk7XG4gICAgICB0aGF0LnJ1bigpO1xuICAgIH1cbiAgfTtcbiAgc2xpZGVyLmFwcGVuZENoaWxkKGJwbVNsaWRlcik7XG4gIHNsaWRlci5hcHBlbmRDaGlsZChicG1JbmZvKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzbGlkZXIpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVLZXlTZWxlY3QodGhhdCl7XG4gIHZhciBrZXlTZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBrZXlTZWxlY3Quc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJrZXktc2VsZWN0XCIpXG4gIHZhciB0b25pYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XG4gIFtcIkNcIiwgXCJDI1wiLCBcIkRcIiwgXCJEI1wiLCBcIkVcIiwgXCJGXCIsIFwiRiNcIiwgXCJHXCIsIFwiRyNcIiwgXCJBXCIsIFwiQSNcIiwgXCJCXCJdLmZvckVhY2goZnVuY3Rpb24obm90ZSl7XG4gICAgdmFyIG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgb3B0LnZhbHVlID0gb3B0LnRleHRDb250ZW50ID0gbm90ZTtcbiAgICB0b25pYy5hcHBlbmRDaGlsZChvcHQpO1xuICB9KTtcblxuICB0b25pYy5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGUpe1xuICAgIHRoYXQua2V5LnRvbmljID0gZS50YXJnZXQudmFsdWUgKyBcIjNcIjtcbiAgfSlcblxuICBrZXlTZWxlY3QuYXBwZW5kQ2hpbGQodG9uaWMpO1xuXG5cbiAgdmFyIGtleSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XG4gIFtcIm1ham9yXCIsIFwibWlub3JcIiwgXCJwZW50TWFqXCIsIFwicGVudE1pblwiXS5mb3JFYWNoKGZ1bmN0aW9uKHNjYWxlKXtcbiAgICB2YXIgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICBvcHQudmFsdWUgPSBvcHQudGV4dENvbnRlbnQgPSBzY2FsZTtcbiAgICBrZXkuYXBwZW5kQ2hpbGQob3B0KTtcbiAgfSk7XG5cbiAga2V5LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24oZSl7XG4gICAgdGhhdC5rZXkuc2NhbGUgPSBlLnRhcmdldC52YWx1ZTtcbiAgfSlcblxuICBrZXlTZWxlY3QuYXBwZW5kQ2hpbGQoa2V5KTtcblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGtleVNlbGVjdCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBvd2VyQnV0dG9uKHRoYXQpe1xuICB2YXIgcG93ZXJCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICBwb3dlckJ0bi50ZXh0Q29udGVudCA9IFwifD5cIjtcbiAgcG93ZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgaWYodGhhdC5pbnRlcnZhbCl7XG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGF0LmludGVydmFsKTtcbiAgICAgIHRoYXQuaW50ZXJ2YWwgPSB1bmRlZmluZWQ7XG4gICAgICBwb3dlckJ0bi50ZXh0Q29udGVudCA9IFwifD5cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC5ydW4oKTtcbiAgICAgIHBvd2VyQnRuLnRleHRDb250ZW50ID0gXCJ8IHxcIjtcbiAgICB9XG4gIH0pXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocG93ZXJCdG4pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVNYXJrZXJzKHBvc2l0aW9uLCBzdGVwcyl7XG4gIGxhc3RQb3NpdGlvbiA9IHBvc2l0aW9uIC0gMTtcbiAgaWYobGFzdFBvc2l0aW9uIDwgMCl7XG4gICAgbGFzdFBvc2l0aW9uID0gc3RlcHMgLSAxO1xuICB9XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXJrZXJbZGF0YS1pbmRleD1cIicrbGFzdFBvc2l0aW9uKydcIl0nKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFya2VyW2RhdGEtaW5kZXg9XCInK3Bvc2l0aW9uKydcIl0nKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2VxVUkodGhhdCl7XG4gIGNyZWF0ZU1hcmtlcnModGhhdCk7XG4gIGNyZWF0ZVNsaWRlcih0aGF0KTtcbiAgY3JlYXRlS2V5U2VsZWN0KHRoYXQpO1xuICBjcmVhdGVQb3dlckJ1dHRvbih0aGF0KTtcbiAgY3JlYXRlU2F2ZUxvYWRCdXR0b25zKHRoYXQpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVEZWZhdWx0SW5zdHJ1bWVudFVJKHRoYXQsIGNvbnRhaW5lcil7XG4gIHZhciBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICBsYWJlbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxhYmVsXCIpXG4gIGxhYmVsLnRleHRDb250ZW50ID0gdGhhdC5uYW1lO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWwpO1xuXG4gIHZhciBjdXJyZW50U2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcbiAgY3VycmVudFNlbGVjdC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uIHVwZGF0ZVByb2J6KGUpe1xuICAgIHRoYXQuY3VycmVudCA9IH5+ZS50YXJnZXQudmFsdWU7XG4gICAgdGhhdC5sb2FkUm93KCk7XG4gIH0pO1xuICBmb3IodmFyIGkgPSAwOyBpIDwgNjsgaSsrKXtcbiAgICB2YXIgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICBvcHQudmFsdWUgPSBvcHQudGV4dENvbnRlbnQgPSBpO1xuICAgIGN1cnJlbnRTZWxlY3QuYXBwZW5kQ2hpbGQob3B0KTtcbiAgfVxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY3VycmVudFNlbGVjdCk7XG5cbiAgdmFyIG5leHRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgbmV4dElucHV0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJ0ZXh0XCIpO1xuICBuZXh0SW5wdXQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJuZXh0c1wiKTtcbiAgbmV4dElucHV0LnZhbHVlID0gMDtcbiAgbmV4dElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiB1cGRhdGVQcm9ieihlKXtcbiAgICB0aGF0Lm5leHRzW3RoYXQuY3VycmVudF0gPSBlLnRhcmdldC52YWx1ZS5zcGxpdChcIixcIik7XG4gIH0pO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQobmV4dElucHV0KTtcblxuICB2YXIgdm9sU2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICB2b2xTbGlkZXIuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInJhbmdlXCIpO1xuICB2b2xTbGlkZXIuc2V0QXR0cmlidXRlKFwibWluXCIsIDApO1xuICB2b2xTbGlkZXIuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdGhhdC5nYWluLmdhaW4udmFsdWUpO1xuICB2b2xTbGlkZXIuc2V0QXR0cmlidXRlKFwic3RlcFwiLCAwLjA1KTtcbiAgdm9sU2xpZGVyLnNldEF0dHJpYnV0ZShcIm1heFwiLCAxKTtcbiAgdm9sU2xpZGVyLm9uaW5wdXQgPSBmdW5jdGlvbiB1cGRhdGVCUE0oZSl7XG4gICAgdGhhdC51cGRhdGVWb2x1bWUoZS50YXJnZXQudmFsdWVBc051bWJlcik7XG4gIH07XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh2b2xTbGlkZXIpO1xuXG4gIHZhciBmaWx0ZXJTbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gIGZpbHRlclNsaWRlci5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwicmFuZ2VcIik7XG4gIGZpbHRlclNsaWRlci5zZXRBdHRyaWJ1dGUoXCJtaW5cIiwgMCk7XG4gIGZpbHRlclNsaWRlci5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCAzNTApO1xuICBmaWx0ZXJTbGlkZXIuc2V0QXR0cmlidXRlKFwibWF4XCIsIDEwMDAwKTtcbiAgZmlsdGVyU2xpZGVyLm9uaW5wdXQgPSBmdW5jdGlvbiB1cGRhdGVCUE0oZSl7XG4gICAgdGhhdC51cGRhdGVGaWx0ZXIoZS50YXJnZXQudmFsdWVBc051bWJlcik7XG4gIH07XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChmaWx0ZXJTbGlkZXIpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTeW50aFVJKHRoYXQpe1xuICB2YXIgc3ludGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBzeW50aC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGF0Lm5hbWUpO1xuXG4gIHZhciBzeW50aFByb2JzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgc3ludGhQcm9icy5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInN5bnRoLXByb2JzXCIpO1xuICBmb3IodmFyIGkgPSAwOyBpIDwgdGhhdC5wcm9ic1t0aGF0LmN1cnJlbnRdLmxlbmd0aDsgaSsrKXtcbiAgICB2YXIgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICBjZWxsLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJ0ZXh0XCIpXG4gICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInByb2JcIilcbiAgICBpZihpJTQ9PTApIGNlbGwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJwcm9iIG9uZS1iZWF0XCIpO1xuICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiLCBpKTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiB1cGRhdGVQcm9ieihlKXtcbiAgICAgIHRoYXQucHJvYnNbdGhhdC5jdXJyZW50XVt+fmUudGFyZ2V0LmRhdGFzZXQuaW5kZXhdID0gcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSk7XG4gICAgfSk7XG4gICAgc3ludGhQcm9icy5hcHBlbmRDaGlsZChjZWxsKTtcbiAgfVxuXG4gIHZhciBjbGVhckZpeCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGNsZWFyRml4LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiY2ZcIik7XG4gIHN5bnRoUHJvYnMuYXBwZW5kQ2hpbGQoY2xlYXJGaXgpO1xuXG4gIGZvcih2YXIgaSA9IDA7IGkgPCB0aGF0Lm5vdGVzW3RoYXQuY3VycmVudF0ubGVuZ3RoOyBpKyspe1xuICAgIHZhciBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIGNlbGwuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHRcIilcbiAgICBjZWxsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibm90ZXNcIilcbiAgICBpZihpJTQ9PTApIGNlbGwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJub3RlcyBvbmUtYmVhdFwiKTtcbiAgICBjZWxsLnNldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIiwgaSk7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gdXBkYXRlUHJvYnooZSl7XG4gICAgICB0aGF0Lm5vdGVzW3RoYXQuY3VycmVudF1bfn5lLnRhcmdldC5kYXRhc2V0LmluZGV4XSA9IGUudGFyZ2V0LnZhbHVlLnNwbGl0KFwiLFwiKTtcbiAgICB9KTtcbiAgICBzeW50aFByb2JzLmFwcGVuZENoaWxkKGNlbGwpO1xuICB9XG5cbiAgc3ludGguYXBwZW5kQ2hpbGQoc3ludGhQcm9icylcbiAgY3JlYXRlRGVmYXVsdEluc3RydW1lbnRVSSh0aGF0LCBzeW50aCk7XG4gIHJldHVybiBzeW50aDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRHJ1bVVJKHRoYXQpe1xuICB2YXIgZHJ1bSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGRydW0uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhhdC5uYW1lKTtcblxuICBmb3IodmFyIGkgPSAwOyBpIDwgdGhhdC5wcm9ic1t0aGF0LmN1cnJlbnRdLmxlbmd0aDsgaSsrKXtcbiAgICB2YXIgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICBjZWxsLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJ0ZXh0XCIpXG4gICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInByb2JcIilcbiAgICBpZihpJTQ9PTApIGNlbGwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJwcm9iIG9uZS1iZWF0XCIpXG4gICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsIGkpO1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uIHVwZGF0ZVByb2J6KGUpe1xuICAgICAgdGhhdC5wcm9ic1t0aGF0LmN1cnJlbnRdW35+ZS50YXJnZXQuZGF0YXNldC5pbmRleF0gPSBwYXJzZUZsb2F0KGUudGFyZ2V0LnZhbHVlKTtcbiAgICB9KTtcbiAgICBkcnVtLmFwcGVuZENoaWxkKGNlbGwpO1xuICB9XG5cbiAgY3JlYXRlRGVmYXVsdEluc3RydW1lbnRVSSh0aGF0LCBkcnVtKTtcbiAgcmV0dXJuIGRydW07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB1cGRhdGVNYXJrZXJzOiB1cGRhdGVNYXJrZXJzLFxuICBjcmVhdGVTZXFVSTogY3JlYXRlU2VxVUksXG4gIGNyZWF0ZURlZmF1bHRJbnN0cnVtZW50VUk6IGNyZWF0ZURlZmF1bHRJbnN0cnVtZW50VUksXG4gIGNyZWF0ZVN5bnRoVUk6IGNyZWF0ZVN5bnRoVUksXG4gIGNyZWF0ZURydW1VSTogY3JlYXRlRHJ1bVVJXG59IiwidmFyIGNyZWF0ZURydW1VSSA9IHJlcXVpcmUoJy4vVUknKS5jcmVhdGVEcnVtVUk7XG5cbnZhciBEcnVtID0gZnVuY3Rpb24oc2FtcGxlciwgb3B0cywgZ2FpbiwgZmlsdGVyKXtcbiAgdGhpcy5nYWluID0gZ2FpbjtcbiAgdGhpcy5maWx0ZXIgPSBmaWx0ZXI7XG4gIHRoaXMuc2FtcGxlciA9IHNhbXBsZXI7XG4gIHRoaXMubmFtZSA9IG9wdHMubmFtZTtcbiAgdGhpcy5wcm9icyA9IFtdXG4gIHRoaXMubmV4dHMgPSBbXTtcbiAgZm9yKHZhciBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgIHRoaXMucHJvYnMucHVzaChBcnJheSgxNikpO1xuICAgIHRoaXMubmV4dHMucHVzaChbMF0pO1xuICB9XG4gIHRoaXMuY3VycmVudCA9IDA7XG4gIHRoaXMuaW5zdGFsbFJvdygpO1xufVxuXG5EcnVtLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24ocG9zKXtcbiAgaWYoTWF0aC5yYW5kb20oKSA8IHRoaXMucHJvYnNbdGhpcy5jdXJyZW50XVtwb3NdKXtcbiAgICB0aGlzLnNhbXBsZXIuc3RhcnQoKTtcbiAgfVxufVxuXG5EcnVtLnByb3RvdHlwZS5pbnN0YWxsUm93ID0gZnVuY3Rpb24oKXtcbiAgdmFyIGRydW0gPSBjcmVhdGVEcnVtVUkodGhpcyk7XG5cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkcnVtKTtcbn1cblxuRHJ1bS5wcm90b3R5cGUubG9hZFJvd3MgPSBmdW5jdGlvbigpe1xuICB2YXIgdGhhdCA9IHRoaXM7XG4gIHZhciBub3RlU3RyaW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5uYW1lKTtcbiAgaWYoIW5vdGVTdHJpbmcpIHJldHVybjtcbiAgdGhpcy5wcm9icyA9IG5vdGVTdHJpbmcuc3BsaXQoXCIkXCIpLm1hcChmdW5jdGlvbihyb3cpe1xuICAgIHJldHVybiByb3cuc3BsaXQoXCIsXCIpO1xuICB9KTtcblxuICB2YXIgbmV4dFN0cmluZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubmFtZStcIi1uZXh0c1wiKTtcbiAgaWYoIW5leHRTdHJpbmcpIHJldHVybjtcbiAgdGhpcy5uZXh0cyA9IG5leHRTdHJpbmcuc3BsaXQoXCIkXCIpLm1hcChmdW5jdGlvbihyb3cpe1xuICAgIHJldHVybiByb3cuc3BsaXQoXCIsXCIpO1xuICB9KTtcblxuICB0aGlzLmxvYWRSb3coKTtcbn1cblxuRHJ1bS5wcm90b3R5cGUubG9hZFJvdyA9IGZ1bmN0aW9uKCl7XG4gIHZhciB0aGF0ID0gdGhpcztcbiAgdGhpcy5wcm9ic1t0aGlzLmN1cnJlbnRdLmZvckVhY2goZnVuY3Rpb24odmFsLCBpKXtcbiAgICBpZighaXNOYU4odmFsKSl7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuJyt0aGF0Lm5hbWUrJyBpbnB1dFtkYXRhLWluZGV4PVwiJytpKydcIl0nKS52YWx1ZSA9IHZhbDtcbiAgICB9XG4gIH0pO1xuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nK3RoaXMubmFtZSsnIC5uZXh0cycpLnZhbHVlID0gdGhpcy5uZXh0c1t0aGlzLmN1cnJlbnRdLmpvaW4oXCIsXCIpO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuJyt0aGlzLm5hbWUrJyBzZWxlY3QnKS52YWx1ZSA9IHRoaXMuY3VycmVudDtcbn1cblxuRHJ1bS5wcm90b3R5cGUuc2F2ZVJvd3MgPSBmdW5jdGlvbigpe1xuICB2YXIgcm93cyA9IHRoaXMucHJvYnMubWFwKGZ1bmN0aW9uKHJvdyl7XG4gICAgcmV0dXJuIHJvdy5qb2luKFwiLFwiKTtcbiAgfSk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubmFtZSwgcm93cy5qb2luKFwiJFwiKSk7XG5cblxuICB2YXIgbmV4dHMgPSB0aGlzLm5leHRzLm1hcChmdW5jdGlvbihuZXh0KXtcbiAgICByZXR1cm4gbmV4dC5qb2luKFwiLFwiKTtcbiAgfSk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubmFtZStcIi1uZXh0c1wiLCBuZXh0cy5qb2luKFwiJFwiKSk7XG59XG5cbkRydW0ucHJvdG90eXBlLmV4cG9ydFJvd3MgPSBmdW5jdGlvbigpe1xuICByZXR1cm4ge1xuICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICBwcm9iczogdGhpcy5wcm9icyxcbiAgICBuZXh0czogdGhpcy5uZXh0c1xuICB9XG59XG5cbkRydW0ucHJvdG90eXBlLnVwZGF0ZVZvbHVtZSA9IGZ1bmN0aW9uKHZhbCl7XG4gIHRoaXMuZ2Fpbi5nYWluLnZhbHVlID0gdmFsO1xufVxuXG5EcnVtLnByb3RvdHlwZS51cGRhdGVGaWx0ZXIgPSBmdW5jdGlvbih2YWwpe1xuICB0aGlzLmZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSB2YWw7XG59XG5cbkRydW0ucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpe1xuICB2YXIgbmV4dHMgPSB0aGlzLm5leHRzW3RoaXMuY3VycmVudF07XG4gIHRoaXMuY3VycmVudCA9IG5leHRzW35+KE1hdGgucmFuZG9tKCkgKiBuZXh0cy5sZW5ndGgpXTtcbiAgdGhpcy5sb2FkUm93KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERydW07IiwidmFyIFNhbXBsZXIgPSByZXF1aXJlKCcuL3NhbXBsZXInKTtcbnZhciBEcnVtID0gcmVxdWlyZSgnLi9kcnVtJyk7XG5cbnZhciBPc2NpbGxhdG9yID0gcmVxdWlyZSgnb3Blbm11c2ljLW9zY2lsbGF0b3InKTtcbnZhciBTeW50aCA9IHJlcXVpcmUoJy4vc3ludGgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVJbnN0cnVtZW50cyhhYywgZHJ1bXMsIHN5bnRocyl7XG4gIHZhciBpbnN0cnVtZW50cyA9IFtdO1xuXG4gIGRydW1zLmZvckVhY2goZnVuY3Rpb24oZHJ1bSl7XG4gICAgdmFyIHNhbXBsZXIgPSBuZXcgU2FtcGxlcihhYywgJ3NhbXBsZXMvJytkcnVtLm5hbWUrJy53YXYnKTtcbiAgICB2YXIgZ2Fpbk5vZGUgPSBhYy5jcmVhdGVHYWluKCk7XG4gICAgc2FtcGxlci5jb25uZWN0KGdhaW5Ob2RlKTtcbiAgICB2YXIgZmlsdGVyID0gYWMuY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG4gICAgZmlsdGVyLnR5cGUgPSAnbG93cGFzcyc7XG4gICAgZ2Fpbk5vZGUuY29ubmVjdChmaWx0ZXIpO1xuICAgIGZpbHRlci5jb25uZWN0KGFjLmRlc3RpbmF0aW9uKTtcbiAgICB2YXIgZHJ1bSA9IG5ldyBEcnVtKHNhbXBsZXIsIGRydW0sIGdhaW5Ob2RlLCBmaWx0ZXIpO1xuICAgIGluc3RydW1lbnRzLnB1c2goZHJ1bSlcbiAgfSk7XG5cbiAgc3ludGhzLmZvckVhY2goZnVuY3Rpb24oc3ludGgpe1xuICAgIHZhciBvc2NpbGxhdG9yID0gbmV3IE9zY2lsbGF0b3IoYWMpO1xuICAgIG9zY2lsbGF0b3IudHlwZSA9IHN5bnRoLnR5cGU7XG4gICAgdmFyIGdhaW5Ob2RlID0gYWMuY3JlYXRlR2FpbigpO1xuICAgIG9zY2lsbGF0b3IuY29ubmVjdChnYWluTm9kZSk7XG4gICAgdmFyIGZpbHRlciA9IGFjLmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuICAgIGZpbHRlci50eXBlID0gJ2xvd3Bhc3MnO1xuICAgIGdhaW5Ob2RlLmNvbm5lY3QoZmlsdGVyKTtcbiAgICBmaWx0ZXIuY29ubmVjdChhYy5kZXN0aW5hdGlvbik7XG4gICAgdmFyIHN5bnRoZXNpemVyID0gbmV3IFN5bnRoKG9zY2lsbGF0b3IsIHN5bnRoLCBnYWluTm9kZSwgZmlsdGVyKTtcbiAgICBpbnN0cnVtZW50cy5wdXNoKHN5bnRoZXNpemVyKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGluc3RydW1lbnRzO1xufSIsInZhciBTYW1wbGVQbGF5ZXIgPSByZXF1aXJlKCdvcGVubXVzaWMtc2FtcGxlLXBsYXllcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFjLCBwYXRoKXtcbiAgdmFyIHBsYXllciA9IFNhbXBsZVBsYXllcihhYyk7XG5cbiAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgcmVxdWVzdC5vcGVuKCdHRVQnLCBwYXRoLCB0cnVlKTtcbiAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgYWMuZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIG9uQnVmZmVyTG9hZGVkLCBvbkJ1ZmZlckxvYWRFcnJvcik7XG4gIH07XG5cbiAgcmVxdWVzdC5zZW5kKCk7XG5cbiAgZnVuY3Rpb24gb25CdWZmZXJMb2FkZWQoYnVmZmVyKSB7XG4gICAgcGxheWVyLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uQnVmZmVyTG9hZEVycm9yKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ29oIG5vJywgZXJyKTtcbiAgfVxuXG4gIHJldHVybiBwbGF5ZXI7XG59IiwiZnVuY3Rpb24gZ2V0VGljayhicG0pe1xuICByZXR1cm4gKCg2MCAqIDEwMDApIC8gYnBtKSAvIDQ7XG59XG5cbnZhciBTZXF1ZW5jZXIgPSBmdW5jdGlvbihpbnN0cnVtZW50cywgYWMsIGJwbSwgc3RlcHMsIGtleSwgdXBkYXRlVUkpe1xuICB0aGlzLmFjID0gYWM7XG4gIHRoaXMuYnBtID0gYnBtO1xuICB0aGlzLmluc3RydW1lbnRzID0gaW5zdHJ1bWVudHM7XG4gIHRoaXMuaW50ZXJ2YWwgPSBudWxsO1xuICB0aGlzLmtleSA9IGtleTtcbiAgdGhpcy5wb3NpdGlvbiA9IDA7XG4gIHRoaXMudXBkYXRlVUkgPSB1cGRhdGVVSTtcbiAgdGhpcy5zdGVwcyA9IHN0ZXBzO1xufTtcblxuU2VxdWVuY2VyLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbigpe1xuICB2YXIgdGhhdCA9IHRoaXM7XG4gIHZhciB0aWNrID0gZ2V0VGljayh0aGF0LmJwbSk7XG4gIHRoaXMuaW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICB0aGF0LnVwZGF0ZVVJKHRoYXQucG9zaXRpb24sIHRoYXQuc3RlcHMpO1xuICAgIHRoYXQuaW5zdHJ1bWVudHMuZm9yRWFjaChmdW5jdGlvbihpbnN0cnVtZW50KXtcbiAgICAgIGluc3RydW1lbnQucGxheSh0aGF0LnBvc2l0aW9uLCB0aGF0LmFjLCB0aGF0LmtleSk7XG4gICAgfSlcbiAgICB0aGF0LnBvc2l0aW9uKys7XG4gICAgaWYodGhhdC5wb3NpdGlvbiA+PSB0aGF0LnN0ZXBzKXtcbiAgICAgIHRoYXQuaW5zdHJ1bWVudHMuZm9yRWFjaChmdW5jdGlvbihpbnN0cnVtZW50KXtcbiAgICAgICAgaW5zdHJ1bWVudC5uZXh0KCk7XG4gICAgICB9KTtcbiAgICAgIHRoYXQucG9zaXRpb24gPSAwO1xuICAgIH1cbiAgfSwgdGljayk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcXVlbmNlcjsiLCJ2YXIgY3JlYXRlU3ludGhVSSA9IHJlcXVpcmUoJy4vVUknKS5jcmVhdGVTeW50aFVJO1xudmFyIGludDJmcmVxID0gcmVxdWlyZShcImludDJmcmVxXCIpO1xuXG52YXIgU3ludGggPSBmdW5jdGlvbihvc2NpbGxhdG9yLCBvcHRzLCBnYWluLCBmaWx0ZXIpe1xuICB0aGlzLm9zY2lsbGF0b3IgPSBvc2NpbGxhdG9yO1xuICB0aGlzLmdhaW4gPSBnYWluO1xuICB0aGlzLmZpbHRlciA9IGZpbHRlcjtcbiAgdGhpcy5uYW1lID0gb3B0cy5uYW1lO1xuICB0aGlzLnR5cGUgPSBvcHRzLnR5cGU7XG4gIHRoaXMucHJvYnMgPSBbXTtcbiAgdGhpcy5ub3RlcyA9IFtdO1xuICB0aGlzLm5leHRzID0gW107XG4gIGZvcih2YXIgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICB0aGlzLnByb2JzLnB1c2goQXJyYXkoMTYpKTtcbiAgICB0aGlzLm5vdGVzLnB1c2goQXJyYXkoMTYpKTtcbiAgICB0aGlzLm5leHRzLnB1c2goWzBdKTtcbiAgfVxuICB0aGlzLmN1cnJlbnQgPSAwO1xuICB0aGlzLnBsYXlpbmcgPSBmYWxzZTtcbiAgdGhpcy5pbnN0YWxsUm93KCk7XG59XG5cblN5bnRoLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24ocG9zLCBhYywga2V5KXtcbiAgaWYoTWF0aC5yYW5kb20oKSA8IHRoaXMucHJvYnNbdGhpcy5jdXJyZW50XVtwb3NdKXtcbiAgICB2YXIgbm90ZUludCA9IHRoaXMubm90ZXNbdGhpcy5jdXJyZW50XVtwb3NdW35+KE1hdGgucmFuZG9tKCkgKiB0aGlzLm5vdGVzW3RoaXMuY3VycmVudF1bcG9zXS5sZW5ndGgpXVxuICAgIGlmKCFub3RlSW50KSBub3RlSW50ID0gMDtcbiAgICB2YXIgZnJlcSA9IGludDJmcmVxKH5+bm90ZUludCwga2V5KTtcbiAgICB0aGlzLm9zY2lsbGF0b3IuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKGZyZXEsIGFjLmN1cnJlbnRUaW1lKTtcbiAgICB0aGlzLm9zY2lsbGF0b3Iuc3RhcnQoKTtcbiAgICB0aGlzLnBsYXlpbmcgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIGlmKHRoaXMucGxheWluZykgdGhpcy5vc2NpbGxhdG9yLnN0b3AoYWMuY3VycmVudFRpbWUpO1xuICAgIHRoaXMucGxheWluZyA9IGZhbHNlXG4gIH1cbn1cblxuU3ludGgucHJvdG90eXBlLmluc3RhbGxSb3cgPSBmdW5jdGlvbigpe1xuICBzeW50aCA9IGNyZWF0ZVN5bnRoVUkodGhpcyk7XG5cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzeW50aCk7XG59XG5cblN5bnRoLnByb3RvdHlwZS5zYXZlUm93cyA9IGZ1bmN0aW9uKCl7XG4gIHZhciBwcm9icyA9IHRoaXMucHJvYnMubWFwKGZ1bmN0aW9uKHByb2Ipe1xuICAgIHJldHVybiBwcm9iLmpvaW4oXCIsXCIpO1xuICB9KTtcbiAgdmFyIG5vdGVzID0gdGhpcy5ub3Rlcy5tYXAoZnVuY3Rpb24obm90ZSl7XG4gICAgcmV0dXJuIG5vdGUuam9pbihcInxcIik7XG4gIH0pO1xuICB2YXIgbmV4dHMgPSB0aGlzLm5leHRzLm1hcChmdW5jdGlvbihuZXh0KXtcbiAgICByZXR1cm4gbmV4dC5qb2luKFwiLFwiKTtcbiAgfSk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubmFtZStcIi1wcm9ic1wiLCBwcm9icy5qb2luKFwiJFwiKSk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubmFtZStcIi1ub3Rlc1wiLCBub3Rlcy5qb2luKFwiJFwiKSk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubmFtZStcIi1uZXh0c1wiLCBuZXh0cy5qb2luKFwiJFwiKSk7XG59XG5cblN5bnRoLnByb3RvdHlwZS5sb2FkUm93cyA9IGZ1bmN0aW9uKCl7XG4gIHZhciB0aGF0ID0gdGhpcztcbiAgdmFyIHByb2JTdHJpbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLm5hbWUrXCItcHJvYnNcIik7XG4gIGlmKCFwcm9iU3RyaW5nKSByZXR1cm47XG4gIHRoaXMucHJvYnMgPSBwcm9iU3RyaW5nLnNwbGl0KFwiJFwiKS5tYXAoZnVuY3Rpb24ocm93KXtcbiAgICByZXR1cm4gcm93LnNwbGl0KFwiLFwiKTtcbiAgfSk7XG5cbiAgdmFyIG5vdGVzU3RyaW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5uYW1lK1wiLW5vdGVzXCIpO1xuICBpZighbm90ZXNTdHJpbmcpIHJldHVybjtcbiAgdGhpcy5ub3RlcyA9IG5vdGVzU3RyaW5nLnNwbGl0KFwiJFwiKS5tYXAoZnVuY3Rpb24ocm93KXtcbiAgICByZXR1cm4gcm93LnNwbGl0KFwifFwiKS5tYXAoZnVuY3Rpb24oY2VsbCl7XG4gICAgICByZXR1cm4gY2VsbC5zcGxpdChcIixcIik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHZhciBuZXh0U3RyaW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5uYW1lK1wiLW5leHRzXCIpO1xuICBpZighbmV4dFN0cmluZykgcmV0dXJuO1xuICB0aGlzLm5leHRzID0gbmV4dFN0cmluZy5zcGxpdChcIiRcIikubWFwKGZ1bmN0aW9uKHJvdyl7XG4gICAgcmV0dXJuIHJvdy5zcGxpdChcIixcIik7XG4gIH0pO1xuXG4gIHRoaXMubG9hZFJvdygpO1xufTtcblxuU3ludGgucHJvdG90eXBlLmxvYWRSb3cgPSBmdW5jdGlvbigpe1xuICB2YXIgdGhhdCA9IHRoaXM7XG4gIHRoaXMucHJvYnNbdGhpcy5jdXJyZW50XS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaSl7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLicrdGhhdC5uYW1lKycgaW5wdXRbZGF0YS1pbmRleD1cIicraSsnXCJdLnByb2InKS52YWx1ZSA9IHZhbDtcbiAgfSk7XG5cbiAgdGhpcy5ub3Rlc1t0aGlzLmN1cnJlbnRdLmZvckVhY2goZnVuY3Rpb24odmFsLCBpKXtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuJyt0aGF0Lm5hbWUrJyBpbnB1dFtkYXRhLWluZGV4PVwiJytpKydcIl0ubm90ZXMnKS52YWx1ZSA9IHZhbC5qb2luKFwiLFwiKTtcbiAgfSk7XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLicrdGhpcy5uYW1lKycgLm5leHRzJykudmFsdWUgPSB0aGlzLm5leHRzW3RoaXMuY3VycmVudF0uam9pbihcIixcIik7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nK3RoaXMubmFtZSsnIHNlbGVjdCcpLnZhbHVlID0gdGhpcy5jdXJyZW50O1xufTtcblxuU3ludGgucHJvdG90eXBlLmV4cG9ydFJvd3MgPSBmdW5jdGlvbigpe1xuICByZXR1cm4ge1xuICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgcHJvYnM6IHRoaXMucHJvYnMsXG4gICAgbm90ZXM6IHRoaXMubm90ZXMsXG4gICAgbmV4dHM6IHRoaXMubmV4dHNcbiAgfVxufVxuXG5cblN5bnRoLnByb3RvdHlwZS51cGRhdGVWb2x1bWUgPSBmdW5jdGlvbih2YWwpe1xuICB0aGlzLmdhaW4uZ2Fpbi52YWx1ZSA9IHZhbDtcbn1cblxuU3ludGgucHJvdG90eXBlLnVwZGF0ZUZpbHRlciA9IGZ1bmN0aW9uKHZhbCl7XG4gIHRoaXMuZmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IHZhbDtcbn1cblxuU3ludGgucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpe1xuICB2YXIgbmV4dHMgPSB0aGlzLm5leHRzW3RoaXMuY3VycmVudF07XG4gIHRoaXMuY3VycmVudCA9IG5leHRzW35+KE1hdGgucmFuZG9tKCkgKiBuZXh0cy5sZW5ndGgpXTtcbiAgdGhpcy5sb2FkUm93KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bnRoOyJdfQ==
