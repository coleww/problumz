(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var NUM_BEATS = 16;
var BPM = 120;

var getTick = require('./src/get_tick');

var Sampler = require('./src/sampler');
var Drum = require('./src/drum');

var Markers = require('./src/markers');
var installMarkers = Markers.installMarkers;
var updateMarkers = Markers.updateMarkers;

var ac = new AudioContext();
var instruments = [];

var drums = ['clap', 'cym', 'hat', 'snare', 'kick'];

drums.forEach(function(drum){
  var sampler = new Sampler(ac, 'samples/'+drum+'.wav');
  sampler.connect(ac.destination);
  var drum = new Drum(sampler, 'clap');
  instruments.push(drum)
})

var position = 0;

var interval;

var tick = getTick(BPM);




function run(tick){
  interval = window.setInterval(function(){
    updateMarkers(position, NUM_BEATS);
    instruments.forEach(function(instrument){
      instrument.play(position);
    })
    position++;
    if(position >= 16){
      position = 0;
    }
  }, tick);
};


function createSlider(run){
  var slider = document.createElement("div");
  slider.setAttribute("class", "bpm-slider");
  var bpmInfo = document.createElement("span");
  bpmInfo.setAttribute("class", "bpm-info");
  bpmInfo.textContent = BPM+'bpm';
  var bpmSlider = document.createElement("input");
  bpmSlider.setAttribute("type", "range");
  bpmSlider.setAttribute("min", 20);
  bpmSlider.setAttribute("max", 500);
  bpmSlider.oninput = function updateBPM(e){
    window.clearInterval(interval);
    bpm = e.target.valueAsNumber;
    bpmInfo.textContent = bpm + 'bpm';
    tick = getTick(bpm);
    run(tick);
  };
  slider.appendChild(bpmSlider);
  slider.appendChild(bpmInfo);
  document.body.appendChild(slider);
}


installMarkers(NUM_BEATS);
createSlider(run);
run(tick);

},{"./src/drum":3,"./src/get_tick":4,"./src/markers":5,"./src/sampler":6}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
var Drum = function(sampler, name){
  this.sampler = sampler;
  this.name = name;
  this.notes = Array(16);
  this.installRow();
}

Drum.prototype.play = function(pos){
  if(Math.random() < this.notes[pos]){
    this.sampler.start();
  }
}

Drum.prototype.installRow = function(){
  var that = this;

  var drum = document.createElement("div")
  drum.setAttribute("class", name);

  for(var i = 0; i < this.notes.length; i++){
    var cell = document.createElement("input");
    cell.setAttribute("type", "text")
    cell.setAttribute("class", "drum-prob")
    cell.setAttribute("data-index", i);
    cell.addEventListener('keyup', function updateProbz(e){
      that.notes[~~e.target.dataset.index] = parseFloat(e.target.value);
    });
    drum.appendChild(cell);
  }

  document.body.appendChild(drum);
}

Drum.prototype.loadRow = function(notes){
  // notes => array of values
  // replaces this.notes
  // update dom
}

module.exports = Drum;
},{}],4:[function(require,module,exports){
module.exports = function(bpm){
  return (60 * 1000) / bpm;
}
},{}],5:[function(require,module,exports){
function installMarkers(num){
  var markerRow = document.createElement("div")
  markerRow.setAttribute("class", "beat-markers");

  for(var i = 0; i < num; i++){
    var marker = document.createElement("div");
    marker.setAttribute("class", "marker")
    marker.setAttribute("data-index", i);
    markerRow.appendChild(marker);
  }

  document.body.appendChild(markerRow);
  var clearFix = document.createElement("div");
  clearFix.setAttribute("class", "cf");
  document.body.appendChild(clearFix);
};

function updateMarkers(position, num){
  lastPosition = position - 1;
  if(lastPosition < 0){
    lastPosition = num - 1;
  }
  document.querySelector('.marker[data-index="'+lastPosition+'"]').classList.remove('active');

  document.querySelector('.marker[data-index="'+position+'"]').classList.add('active');
}

module.exports = {
  installMarkers: installMarkers,
  updateMarkers: updateMarkers
}
},{}],6:[function(require,module,exports){
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
},{"openmusic-sample-player":2}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vcGVubXVzaWMtc2FtcGxlLXBsYXllci9pbmRleC5qcyIsInNyYy9kcnVtLmpzIiwic3JjL2dldF90aWNrLmpzIiwic3JjL21hcmtlcnMuanMiLCJzcmMvc2FtcGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBOVU1fQkVBVFMgPSAxNjtcbnZhciBCUE0gPSAxMjA7XG5cbnZhciBnZXRUaWNrID0gcmVxdWlyZSgnLi9zcmMvZ2V0X3RpY2snKTtcblxudmFyIFNhbXBsZXIgPSByZXF1aXJlKCcuL3NyYy9zYW1wbGVyJyk7XG52YXIgRHJ1bSA9IHJlcXVpcmUoJy4vc3JjL2RydW0nKTtcblxudmFyIE1hcmtlcnMgPSByZXF1aXJlKCcuL3NyYy9tYXJrZXJzJyk7XG52YXIgaW5zdGFsbE1hcmtlcnMgPSBNYXJrZXJzLmluc3RhbGxNYXJrZXJzO1xudmFyIHVwZGF0ZU1hcmtlcnMgPSBNYXJrZXJzLnVwZGF0ZU1hcmtlcnM7XG5cbnZhciBhYyA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbnZhciBpbnN0cnVtZW50cyA9IFtdO1xuXG52YXIgZHJ1bXMgPSBbJ2NsYXAnLCAnY3ltJywgJ2hhdCcsICdzbmFyZScsICdraWNrJ107XG5cbmRydW1zLmZvckVhY2goZnVuY3Rpb24oZHJ1bSl7XG4gIHZhciBzYW1wbGVyID0gbmV3IFNhbXBsZXIoYWMsICdzYW1wbGVzLycrZHJ1bSsnLndhdicpO1xuICBzYW1wbGVyLmNvbm5lY3QoYWMuZGVzdGluYXRpb24pO1xuICB2YXIgZHJ1bSA9IG5ldyBEcnVtKHNhbXBsZXIsICdjbGFwJyk7XG4gIGluc3RydW1lbnRzLnB1c2goZHJ1bSlcbn0pXG5cbnZhciBwb3NpdGlvbiA9IDA7XG5cbnZhciBpbnRlcnZhbDtcblxudmFyIHRpY2sgPSBnZXRUaWNrKEJQTSk7XG5cblxuXG5cbmZ1bmN0aW9uIHJ1bih0aWNrKXtcbiAgaW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICB1cGRhdGVNYXJrZXJzKHBvc2l0aW9uLCBOVU1fQkVBVFMpO1xuICAgIGluc3RydW1lbnRzLmZvckVhY2goZnVuY3Rpb24oaW5zdHJ1bWVudCl7XG4gICAgICBpbnN0cnVtZW50LnBsYXkocG9zaXRpb24pO1xuICAgIH0pXG4gICAgcG9zaXRpb24rKztcbiAgICBpZihwb3NpdGlvbiA+PSAxNil7XG4gICAgICBwb3NpdGlvbiA9IDA7XG4gICAgfVxuICB9LCB0aWNrKTtcbn07XG5cblxuZnVuY3Rpb24gY3JlYXRlU2xpZGVyKHJ1bil7XG4gIHZhciBzbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBzbGlkZXIuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJicG0tc2xpZGVyXCIpO1xuICB2YXIgYnBtSW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICBicG1JbmZvLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYnBtLWluZm9cIik7XG4gIGJwbUluZm8udGV4dENvbnRlbnQgPSBCUE0rJ2JwbSc7XG4gIHZhciBicG1TbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gIGJwbVNsaWRlci5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwicmFuZ2VcIik7XG4gIGJwbVNsaWRlci5zZXRBdHRyaWJ1dGUoXCJtaW5cIiwgMjApO1xuICBicG1TbGlkZXIuc2V0QXR0cmlidXRlKFwibWF4XCIsIDUwMCk7XG4gIGJwbVNsaWRlci5vbmlucHV0ID0gZnVuY3Rpb24gdXBkYXRlQlBNKGUpe1xuICAgIHdpbmRvdy5jbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICBicG0gPSBlLnRhcmdldC52YWx1ZUFzTnVtYmVyO1xuICAgIGJwbUluZm8udGV4dENvbnRlbnQgPSBicG0gKyAnYnBtJztcbiAgICB0aWNrID0gZ2V0VGljayhicG0pO1xuICAgIHJ1bih0aWNrKTtcbiAgfTtcbiAgc2xpZGVyLmFwcGVuZENoaWxkKGJwbVNsaWRlcik7XG4gIHNsaWRlci5hcHBlbmRDaGlsZChicG1JbmZvKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzbGlkZXIpO1xufVxuXG5cbmluc3RhbGxNYXJrZXJzKE5VTV9CRUFUUyk7XG5jcmVhdGVTbGlkZXIocnVuKTtcbnJ1bih0aWNrKTtcbiIsImZ1bmN0aW9uIFNhbXBsZVBsYXllcihjb250ZXh0KSB7XG5cdHZhciBub2RlID0gY29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZhciBidWZmZXJTb3VyY2U7XG5cdHZhciBidWZmZXJTb3VyY2VQcm9wZXJ0aWVzID0ge307XG5cblx0WydidWZmZXInLCAnbG9vcCcsICdsb29wU3RhcnQnLCAnbG9vcEVuZCddLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShub2RlLCBuYW1lLCBtYWtlQnVmZmVyU291cmNlR2V0dGVyU2V0dGVyKG5hbWUpKTtcblx0fSk7XG5cblx0Ly8gVE9ETzogcGxheWJhY2tSYXRlIHdoaWNoIG5lZWRzIHRvIGJlIGFuIEF1ZGlvUGFyYW1cblxuXHRub2RlLnN0YXJ0ID0gZnVuY3Rpb24od2hlbiwgb2Zmc2V0LCBkdXJhdGlvbikge1xuXHRcdC8vIGNvbnNvbGUubG9nKCdzdGFydCcsICd3aGVuJywgd2hlbiwgJ29mZnNldCcsIG9mZnNldCwgJ2R1cmF0aW9uJywgZHVyYXRpb24pO1xuXG5cdFx0dmFyIGJ1ZmZlciA9IGJ1ZmZlclNvdXJjZVByb3BlcnRpZXNbJ2J1ZmZlciddO1xuXHRcdGlmKCFidWZmZXIpIHtcblx0XHRcdGNvbnNvbGUuaW5mbygnbm8gYnVmZmVyIHRvIHBsYXkgc28gYnllZWUnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR3aGVuID0gd2hlbiAhPT0gdW5kZWZpbmVkID8gd2hlbiA6IDA7XG5cdFx0b2Zmc2V0ID0gb2Zmc2V0ICE9PSB1bmRlZmluZWQgPyBvZmZzZXQgOiAwO1xuXHRcdFxuXHRcdC8vIFRPRE8gVGhpcyBpcyBtZWdhIHVnbHkgYnV0IHVyZ2ggd2hhdCBpcyBnb2luZyBvbiB1cmdoXG5cdFx0Ly8gaWYgSSBqdXN0IHBhc3MgJ3VuZGVmaW5lZCcgYXMgZHVyYXRpb24gQ2hyb21lIGRvZXNuJ3QgcGxheSBhbnl0aGluZ1xuXHRcdGlmKHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdjb3JyZWN0aW5nIGZvciBjaHJvbWUgYWdoaCcpO1xuXHRcdFx0dmFyIHNhbXBsZUxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG5cdFx0XHRkdXJhdGlvbiA9IGR1cmF0aW9uICE9PSB1bmRlZmluZWQgPyBkdXJhdGlvbiA6IHNhbXBsZUxlbmd0aCAtIG9mZnNldDtcblx0XHR9XG5cblx0XHQvLyBEaXNjb25uZWN0IGlmIGV4aXN0aW5nLCByZW1vdmUgZXZlbnRzIGxpc3RlbmVyc1xuXHRcdGlmKGJ1ZmZlclNvdXJjZSkge1xuXHRcdFx0YnVmZmVyU291cmNlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgb25FbmRlZCk7XG5cdFx0XHRidWZmZXJTb3VyY2UuZGlzY29ubmVjdChub2RlKTtcblx0XHRcdGJ1ZmZlclNvdXJjZSA9IG51bGw7XG5cdFx0fVxuXG5cdFx0aW5pdGlhbGlzZUJ1ZmZlclNvdXJjZSgpO1xuXG5cdFx0YnVmZmVyU291cmNlLnN0YXJ0KHdoZW4sIG9mZnNldCwgZHVyYXRpb24pO1xuXG5cdH07XG5cblx0bm9kZS5zdG9wID0gZnVuY3Rpb24od2hlbikge1xuXHRcdGJ1ZmZlclNvdXJjZS5zdG9wKHdoZW4pO1xuXHR9O1xuXG5cdG5vZGUuY2FuY2VsU2NoZWR1bGVkRXZlbnRzID0gZnVuY3Rpb24od2hlbikge1xuXHRcdC8vIFRPRE86IHdoZW4gdGhlcmUgaXMgYXV0b21hdGlvblxuXHR9O1xuXG5cdGZ1bmN0aW9uIGluaXRpYWxpc2VCdWZmZXJTb3VyY2UoKSB7XG5cdFx0XG5cdFx0YnVmZmVyU291cmNlID0gY29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcblx0XHRidWZmZXJTb3VyY2UuYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCBvbkVuZGVkKTtcblx0XHRidWZmZXJTb3VyY2UuY29ubmVjdChub2RlKTtcblxuXHRcdE9iamVjdC5rZXlzKGJ1ZmZlclNvdXJjZVByb3BlcnRpZXMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuXHRcdFx0YnVmZmVyU291cmNlW25hbWVdID0gYnVmZmVyU291cmNlUHJvcGVydGllc1tuYW1lXTtcblx0XHR9KTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gb25FbmRlZChlKSB7XG5cdFx0dmFyIHQgPSBlLnRhcmdldDtcblx0XHR0LmRpc2Nvbm5lY3Qobm9kZSk7XG5cdFx0aW5pdGlhbGlzZUJ1ZmZlclNvdXJjZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbWFrZUJ1ZmZlclNvdXJjZUdldHRlclNldHRlcihwcm9wZXJ0eSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gZ2V0QnVmZmVyU291cmNlUHJvcGVydHkocHJvcGVydHkpO1xuXHRcdFx0fSxcblx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHRzZXRCdWZmZXJTb3VyY2VQcm9wZXJ0eShwcm9wZXJ0eSwgdik7XG5cdFx0XHR9LFxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZVxuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRCdWZmZXJTb3VyY2VQcm9wZXJ0eShuYW1lKSB7XG5cdFx0cmV0dXJuIGJ1ZmZlclNvdXJjZVByb3BlcnRpZXNbbmFtZV07XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRCdWZmZXJTb3VyY2VQcm9wZXJ0eShuYW1lLCB2YWx1ZSkge1xuXG5cdFx0YnVmZmVyU291cmNlUHJvcGVydGllc1tuYW1lXSA9IHZhbHVlO1xuXG5cdFx0aWYoYnVmZmVyU291cmNlKSB7XG5cdFx0XHRidWZmZXJTb3VyY2VbbmFtZV0gPSB2YWx1ZTtcblx0XHR9XG5cblx0fVxuXG5cdHJldHVybiBub2RlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNhbXBsZVBsYXllcjtcbiIsInZhciBEcnVtID0gZnVuY3Rpb24oc2FtcGxlciwgbmFtZSl7XG4gIHRoaXMuc2FtcGxlciA9IHNhbXBsZXI7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMubm90ZXMgPSBBcnJheSgxNik7XG4gIHRoaXMuaW5zdGFsbFJvdygpO1xufVxuXG5EcnVtLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24ocG9zKXtcbiAgaWYoTWF0aC5yYW5kb20oKSA8IHRoaXMubm90ZXNbcG9zXSl7XG4gICAgdGhpcy5zYW1wbGVyLnN0YXJ0KCk7XG4gIH1cbn1cblxuRHJ1bS5wcm90b3R5cGUuaW5zdGFsbFJvdyA9IGZ1bmN0aW9uKCl7XG4gIHZhciB0aGF0ID0gdGhpcztcblxuICB2YXIgZHJ1bSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgZHJ1bS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBuYW1lKTtcblxuICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5ub3Rlcy5sZW5ndGg7IGkrKyl7XG4gICAgdmFyIGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwidGV4dFwiKVxuICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJkcnVtLXByb2JcIilcbiAgICBjZWxsLnNldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIiwgaSk7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uIHVwZGF0ZVByb2J6KGUpe1xuICAgICAgdGhhdC5ub3Rlc1t+fmUudGFyZ2V0LmRhdGFzZXQuaW5kZXhdID0gcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSk7XG4gICAgfSk7XG4gICAgZHJ1bS5hcHBlbmRDaGlsZChjZWxsKTtcbiAgfVxuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZHJ1bSk7XG59XG5cbkRydW0ucHJvdG90eXBlLmxvYWRSb3cgPSBmdW5jdGlvbihub3Rlcyl7XG4gIC8vIG5vdGVzID0+IGFycmF5IG9mIHZhbHVlc1xuICAvLyByZXBsYWNlcyB0aGlzLm5vdGVzXG4gIC8vIHVwZGF0ZSBkb21cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEcnVtOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYnBtKXtcbiAgcmV0dXJuICg2MCAqIDEwMDApIC8gYnBtO1xufSIsImZ1bmN0aW9uIGluc3RhbGxNYXJrZXJzKG51bSl7XG4gIHZhciBtYXJrZXJSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gIG1hcmtlclJvdy5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImJlYXQtbWFya2Vyc1wiKTtcblxuICBmb3IodmFyIGkgPSAwOyBpIDwgbnVtOyBpKyspe1xuICAgIHZhciBtYXJrZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG1hcmtlci5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1hcmtlclwiKVxuICAgIG1hcmtlci5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsIGkpO1xuICAgIG1hcmtlclJvdy5hcHBlbmRDaGlsZChtYXJrZXIpO1xuICB9XG5cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtYXJrZXJSb3cpO1xuICB2YXIgY2xlYXJGaXggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBjbGVhckZpeC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImNmXCIpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNsZWFyRml4KTtcbn07XG5cbmZ1bmN0aW9uIHVwZGF0ZU1hcmtlcnMocG9zaXRpb24sIG51bSl7XG4gIGxhc3RQb3NpdGlvbiA9IHBvc2l0aW9uIC0gMTtcbiAgaWYobGFzdFBvc2l0aW9uIDwgMCl7XG4gICAgbGFzdFBvc2l0aW9uID0gbnVtIC0gMTtcbiAgfVxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFya2VyW2RhdGEtaW5kZXg9XCInK2xhc3RQb3NpdGlvbisnXCJdJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1hcmtlcltkYXRhLWluZGV4PVwiJytwb3NpdGlvbisnXCJdJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpbnN0YWxsTWFya2VyczogaW5zdGFsbE1hcmtlcnMsXG4gIHVwZGF0ZU1hcmtlcnM6IHVwZGF0ZU1hcmtlcnNcbn0iLCJ2YXIgU2FtcGxlUGxheWVyID0gcmVxdWlyZSgnb3Blbm11c2ljLXNhbXBsZS1wbGF5ZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhYywgcGF0aCl7XG4gIHZhciBwbGF5ZXIgPSBTYW1wbGVQbGF5ZXIoYWMpO1xuXG4gIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHJlcXVlc3Qub3BlbignR0VUJywgcGF0aCwgdHJ1ZSk7XG4gIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcblxuICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIGFjLmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCBvbkJ1ZmZlckxvYWRlZCwgb25CdWZmZXJMb2FkRXJyb3IpO1xuICB9O1xuXG4gIHJlcXVlc3Quc2VuZCgpO1xuXG4gIGZ1bmN0aW9uIG9uQnVmZmVyTG9hZGVkKGJ1ZmZlcikge1xuICAgIHBsYXllci5idWZmZXIgPSBidWZmZXI7XG4gIH1cblxuICBmdW5jdGlvbiBvbkJ1ZmZlckxvYWRFcnJvcihlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKCdvaCBubycsIGVycik7XG4gIH1cblxuICByZXR1cm4gcGxheWVyO1xufSJdfQ==
