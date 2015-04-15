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
  var tonic = document.createElement("select");
  ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].forEach(function(note){
    var opt = document.createElement("option");
    opt.value = opt.textContent = note;
    tonic.appendChild(opt);
  });

  tonic.addEventListener("change", function(e){
    that.key.tonic = e.target.value + "3";
  })
  document.body.appendChild(tonic);


  var keySelect = document.createElement("select");
  ["major", "minor", "pentMaj", "pentMin"].forEach(function(scale){
    var opt = document.createElement("option");
    opt.value = opt.textContent = scale;
    keySelect.appendChild(opt);
  });

  keySelect.addEventListener("change", function(e){
    that.key.scale = e.target.value;
  })
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

  var slider = document.createElement("input");
  slider.setAttribute("type", "range");
  slider.setAttribute("min", 0);
  slider.setAttribute("value", that.gain.gain.value);
  slider.setAttribute("step", 0.05);
  slider.setAttribute("max", 1);
  slider.oninput = function updateBPM(e){
    that.updateVolume(e.target.valueAsNumber);
  };
  container.appendChild(slider);
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