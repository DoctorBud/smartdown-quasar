
# :::: stats

```plotly /autoplay
const myDiv = this.div;
myDiv.innerHTML = `<h3>Waiting for data to be available</h3>`;
this.dependOn.data = function() {
  myDiv.innerHTML = '';
  const experimentData = env.data;
  const correctIncorrectMissing = [0, 0, 0];
  experimentData.forEach((trial) => {
    if (trial.correct === null) {
      correctIncorrectMissing[2] += 1;
    }
    else if (trial.correct) {
      correctIncorrectMissing[0] += 1;
    }
    else {
      correctIncorrectMissing[1] += 1;
    }
  });
  var data = [{
    values: correctIncorrectMissing,
    labels: ['Correct', 'Incorrect', 'Missing'],
    type: 'pie'
  }];

  var layout = {
    autosize: false,
    height: 250,
    width: 250,
    margin: {
      l: 0,
      r: 0,
    },
  };

  Plotly.newPlot(myDiv, data, layout);
}

```

---

- Correct: [](:!Correct)%
- Incorrect: [](:!Incorrect)%
- Missing: [](:!Missing)%
- Correct RT: [](:!CorrectRT) ms
- Incorrect RT: [](:!IncorrectRT) ms

---

- [Repeat Experiment](:@JSPsych/Flanker)
- [Back to jsPsych Home](:@JSPsych)
# ::::


```javascript /autoplay
this.dependOn.data = () => {
    var total_trials = jsPsychGlobal.data.get().filter({trial_type: 'psychophysics'}).count();
    var correct = Math.round(jsPsychGlobal.data.get().filter({correct: true}).count() / total_trials * 100);
    var incorrect = Math.round(jsPsychGlobal.data.get().filter({correct: false}).count() / total_trials * 100);
    var missing = Math.round(jsPsychGlobal.data.get().filter({correct: null}).count() / total_trials * 100);
    var correct_rt = Math.round(jsPsychGlobal.data.get().filter({correct: true}).select('time_elapsed').mean());
    var incorrect_rt = Math.round(jsPsychGlobal.data.get().filter({correct: false}).select('time_elapsed').mean());

    smartdown.set({
      Correct: correct,
      Incorrect: incorrect,
      Missing: missing,
      CorrectRT: correct_rt,
      IncorrectRT: incorrect_rt,
    });

  smartdown.showDisclosure('stats', '', 'inline,scrollable,lightbox');
};
```

```javascript /autoplay/kiosk
//smartdown.import=https://unpkg.com/jspsych@7.3.0/dist/index.browser.min.js
//smartdown.import=https://unpkg.com/@jspsych/plugin-html-button-response@1.1.1/dist/index.browser.min.js
//smartdown.import=https://unpkg.com/@jspsych/plugin-image-button-response@1.1.1/dist/index.browser.min.js
//smartdown.import=https://unpkg.com/@jspsych/plugin-html-keyboard-response@1.1.1/dist/index.browser.min.js
//smartdown.import=https://cdn.jsdelivr.net/gh/kurokida/jspsych-psychophysics/jspsych-psychophysics.js

const myDiv = this.div;

SQ.setToolbarFade(true);

smartdown.importCssCode(
`
.disclosable-content.disclosable-scrollable-content {
  height: auto !important;
}

.smartdown-container .disclosable-wrapper.disclosable-position.disclosable-scrollable {
  height: auto !important;
}
`);

const jsPsych = initJsPsych({
  display_element: myDiv.id,
  use_webaudio: false,
  on_trial_start: function() {
    console.log('on_trial_start');
    myDiv.focus();
  },
  on_trial_finish: function(data) {
    const trial = jsPsych.getCurrentTrial();
    const stimuli = trial.stimuli;
    if (stimuli) {
      const lastStimulus = stimuli.slice(-1)[0];
      const deltaX = data.click_x - lastStimulus.startX;
      const deltaY = data.click_y - lastStimulus.startY;
      const deltaRadius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (data.response) {
        data.rt = data.time_elapsed - lastStimulus.show_start_time;
        if (data.rt > 0) {
          const isWithin = deltaRadius < lastStimulus.radius;
          data.correct = isWithin;
        }
        else {
          data.correct = false;
        }
      }
      else {
        data.rt = null;
        data.correct = null;
      }
      console.log('on_trial_finish', data, data.correct, data.rt);
    }
  },
  on_finish: function(data){
    console.log('on_finish', data.trials);
    smartdown.setVariable('data', data.trials);
    SQ.setToolbarFade(false);
    smartdown.toggleKiosk(myDiv.id);
    myDiv.style.display = 'none';
  }
});
console.log(`jsPsych Version ${jsPsych.version()}`)

window.jsPsychGlobal = jsPsych;

env.data = undefined;

// const fakeData = [
// ];
// smartdown.set('data', fakeData);
// return;

myDiv.style.height = 'auto';
myDiv.style.margin = 'auto';

smartdown.importCssUrl('https://unpkg.com/jspsych@7.2.3/css/jspsych.css');
smartdown.importCssCode(
`
#${myDiv.id} .jspsych-content img {
 height: 150px;
}
.jspsych-display-element {
  font-size: 14px;
}
.smartdown-playable-kiosk {
  background: white !important;
  //margin-top: 22px !important;
}
b.bigbutton {
  margin-left: 20px;
  margin-right: 20px;
  font-weight: 600;
  font-size: 150%;
}
`);

const imgPrefix = '/gallery/resources/';

/*set up experiment structure*/
var timeline = [];

var instructionsBlock = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <br>
    <h4>Instructions</h4>
    <ul>
      <li>
      You will be briefly shown a small set of colored symbols, after which the screen will go blank.
      </li>
      <li>
        After the blank screen is displayed, the original set of symbols will appear, but with one of those symbols having a different color.
      </li>
      <li>
        Click or tap the symbol whose color changed.
      </li>
    </ul>

    <br>
    <br>
  `,
  prompt: ``,
  choices: ['Begin'],
  post_trial_gap: 1000
};
timeline.push(instructionsBlock);


const pixi_flag = false;  // jsPsych.data.getURLVariable('pixi_flag') === '1' ? true : false;
const symbolRadius = 20;

class Symbol {
  obj_type;
  startX;
  startY;
  width;
  height;

  constructor(type, x, y, width, height) {
    this.obj_type = type;
    this.startX = x;
    this.startY = y;
    this.width = width;
    this.height = height;
  }

  clone() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  changeColor() {
    console.log('changeColor has no Symbol implementation');
  }
}


class Glyph extends Symbol {
  content;
  font;
  text_color;

  constructor(name, x, y, width, height, color) {
    super('text', x, y, width, height);

    this.content = name;
    this.font = `${width}px 'Arial'`;
    this.text_color = color;
  }

  changeColor() {
    let newColor;

    do {
      newColor = stimulusColors[Math.floor(Math.random() * stimulusColors.length)];
    } while (newColor === this.text_color);

    this.text_color = newColor;
  }
}

class Rect extends Symbol {
  content;
  width;
  height;
  line_color;
  fill_color;

  constructor(x, y, width, height, color) {
    super('rect', x, y, width, height);

    this.width = width;
    this.height = height;
    this.line_color = color;
    this.fill_color = color;
  }

  changeColor() {
    let newColor;

    do {
      newColor = stimulusColors[Math.floor(Math.random() * stimulusColors.length)];
    } while (newColor === this.line_color);

    this.line_color = newColor;
    this.fill_color = newColor;
  }
}

class Ellipse extends Symbol {
  content;
  radius;
  line_color;
  fill_color;

  constructor(x, y, width, height, color) {
    super('circle', x, y, width, height);

    this.radius = Math.floor(width / 2);
    this.line_color = color;
    this.fill_color = color;
  }

  changeColor() {
    let newColor;

    do {
      newColor = stimulusColors[Math.floor(Math.random() * stimulusColors.length)];
    } while (newColor === this.line_color);

    this.line_color = newColor;
    this.fill_color = newColor;
  }
}


const canvasWidth = 300;
const canvasHeight = 500;
const maxStimulusWidth = Math.floor(canvasWidth / 6);
const maxStimulusHeight = maxStimulusWidth;

// const firstShowTime = 500;
// const firstHideDelta = 2500;
// const secondShowDelta = 500;
// const secondHideDelta = 2500;

const firstShowTime = 1000;
const firstHideDelta = 500;
const secondShowDelta = 1500;
const secondHideDelta = 4000;
const trialDuration = firstShowTime + firstHideDelta + secondShowDelta + secondHideDelta;

const stimulusTypes = [
  'glyph',
  'rect',
  'ellipse',
];

const stimulusColors = [
  'red',
  'green',
  'blue',
  'orange',
  'yellow',
  'magenta',
  'cyan',
  'purple',
  'brown',
  'black',
  'white',
];

const glyphSymbols = [
  'A',
  'B',
  'C',
  'X',
  'Y',
  'Z',
];

class Trial {
  type;
  pixi;
  response_type;
  trial_duration;
  canvas_width;
  canvas_height;
  data;
  stimuli;

  constructor(numSymbols) {
    this.type = jsPsychPsychophysics;
    this.pixi = pixi_flag;
    this.response_type = 'mouse';
    this.trial_duration = trialDuration;
    this.canvas_width = canvasWidth;
    this.canvas_height = canvasHeight;
    this.data = {
      correct: null,
      rt: null,
    };

    this.buildRawStimuli(numSymbols);
    this.buildStimuli();
  }

  buildRandomStimulus(x, y) {
    const stimulusType = stimulusTypes[Math.floor(Math.random() * stimulusTypes.length)];
    const stimulusColor = stimulusColors[Math.floor(Math.random() * stimulusColors.length)];

    const stimulusX = x;
    const stimulusY = y;
    const stimulusWidth = Math.floor((0.5 + Math.random()) * maxStimulusWidth);
    const stimulusHeight = Math.floor((0.5 + Math.random()) * maxStimulusHeight);

    let stimulus = null;
    switch (stimulusType) {
      case 'glyph':
        const glyphLetter = glyphSymbols[Math.floor(Math.random() * glyphSymbols.length)];
        stimulus = new Glyph(glyphLetter, stimulusX, stimulusY, stimulusWidth, stimulusHeight, stimulusColor);
        break;
        
      case 'rect':
        stimulus = new Rect(stimulusX, stimulusY, stimulusWidth, stimulusHeight, stimulusColor);
        break;
        
      case 'ellipse':
        stimulus = new Ellipse(stimulusX, stimulusY, stimulusWidth, stimulusHeight, stimulusColor);
        break;
    }

    return stimulus;
  }

  generateRandomLocations(numSymbols) {
    const allLocations = [];
    const locations = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      10, 11, 12, 13, 14,
    ];
    const shuffledLocations = locations.sort(() => Math.random() - 0.5);
    const chosenLocations = shuffledLocations.slice(0, numSymbols);
    const xyLocations = chosenLocations.map((locationIndex) => {
      return {
        x: (.5 + locationIndex % 3) * (maxStimulusWidth * 2),
        y: (.5 + Math.floor(locationIndex / 3)) * (maxStimulusHeight * 2),
      };
    });
    return xyLocations;
  }

  buildRawStimuli(numSymbols) {
    this.rawStimuli = [];

    const locations = this.generateRandomLocations(numSymbols);

    for (let i = 0; i < numSymbols; ++i) {
      const stimulus = this.buildRandomStimulus(locations[i].x, locations[i].y);
      this.rawStimuli.push(stimulus);
    }

    const changedStimulus = this.rawStimuli[this.rawStimuli.length - 1].clone();
    changedStimulus.changeColor();

    this.rawStimuli.push(changedStimulus);
  }

  buildStimuli() {
    const rawStimuli = this.rawStimuli;

    const stimuli = [];
    for (const stimulus of rawStimuli.slice(0, -1)) {
      const timedStimulus = {
        ...stimulus,
        show_start_time: firstShowTime,
        show_end_time: firstShowTime + firstHideDelta,
      }
      stimuli.push(timedStimulus);
    }
    for (const stimulus of rawStimuli.slice(0, -1)) {
      const timedStimulus = {
        ...stimulus,
        show_start_time: firstShowTime + firstHideDelta + secondShowDelta,
        show_end_time: firstShowTime + firstHideDelta + secondShowDelta + secondHideDelta,
      }
      stimuli.push(timedStimulus);
    }
    const changedStimulus = {
      ...rawStimuli[rawStimuli.length - 1],
      show_start_time: firstShowTime + firstHideDelta + secondShowDelta,
      show_end_time: firstShowTime + firstHideDelta + secondShowDelta + secondHideDelta,
    }
    stimuli.push(changedStimulus);

    this.stimuli = stimuli;
  }
}

timeline.push(new Trial(3 + Math.floor(Math.random() * 3)));
timeline.push(new Trial(3 + Math.floor(Math.random() * 3)));
timeline.push(new Trial(3 + Math.floor(Math.random() * 3)));
timeline.push(new Trial(3 + Math.floor(Math.random() * 3)));
timeline.push(new Trial(3 + Math.floor(Math.random() * 3)));

jsPsych.run(timeline);

window.setTimeout(function() {
  const top = myDiv.offsetTop - 40;
  document.body.scrollTop = top; // For Chrome, Safari and Opera
  document.documentElement.scrollTop = top; // For IE and Firefox
  myDiv.focus();
}, 0);

```
