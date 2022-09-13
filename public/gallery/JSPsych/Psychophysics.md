```javascript /autoplay/kiosk
//smartdown.import=https://unpkg.com/jspsych@7.3.0/dist/index.browser.min.js
//smartdown.import=https://unpkg.com/@jspsych/plugin-html-button-response@1.1.1/dist/index.browser.min.js
//smartdown.import=https://unpkg.com/@jspsych/plugin-html-keyboard-response@1.1.1/dist/index.browser.min.js
//smartdown.import=https://cdn.jsdelivr.net/gh/kurokida/jspsych-psychophysics/jspsych-psychophysics.js

console.log('#####Psychopysics playable start');

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

const useAnimatedResponse = false;
const animationDelay = useAnimatedResponse ? 1000 : 0;

// const firstShowTime = 500;
// const firstHideDelta = 2500;
// const secondShowDelta = 1000;
// const secondHideDelta = 4000;

const firstShowTime = 1000;
const firstHideDelta = 500;
const secondShowDelta = 1500;
const secondHideDelta = 4000;

const trialDuration = firstShowTime + firstHideDelta + secondShowDelta + secondHideDelta;

function isBetween(n, center, size) {
  const halfWidth = size / 2;
  return n > center - size && n < center + size;
}

const jsPsych = initJsPsych({
  display_element: myDiv.id,
  use_webaudio: false,
  trial_duration: firstShowTime + firstHideDelta + secondShowDelta + secondHideDelta,

  on_trial_start: function() {
    myDiv.focus();
  },
  on_trial_start: function(trial) {
    trial.start_time = jsPsych.getTotalTime();
    console.log('on_trial_start', trial, trial.start_time);
  },
  on_trial_finish: function(data) {
    const trial = jsPsych.getCurrentTrial();
    console.log('on_trial_finish', trial, trial.start_time, data, trial.type.info.name, data.response);
    if (trial.type.info.name === 'psychophysics') {
      if (data.response) {
        console.log('data', JSON.stringify(data, null, 2));
        const stimuli = trial.stimuli;
        const lastStimulus = stimuli.slice(-1)[0];
        const betweenX = isBetween(data.click_x, lastStimulus.startX, lastStimulus.width);
        const betweenY = isBetween(data.click_y, lastStimulus.startY, lastStimulus.height);

        data.rt = data.time_elapsed - trial.start_time - lastStimulus.show_start_time - animationDelay;
        console.log('rt', data.rt, data.time_elapsed, lastStimulus.show_start_time);
        if (data.rt > 0) {
          data.correct = betweenX && betweenY;
        }
        else {
          data.correct = false;
        }
      }
      else {
        data.rt = null;
        data.correct = null;
      }
    }
  },
  on_finish: function(data){
    const trimmedTrials = data.trials.filter((trial) => {
      return trial.trial_type === 'psychophysics';
    });

    var total_trials = jsPsychGlobal.data.get().filter({trial_type: 'psychophysics'}).count();
    var correct = Math.round(jsPsychGlobal.data.get().filter({correct: true}).count() / total_trials * 100);
    var incorrect = Math.round(jsPsychGlobal.data.get().filter({correct: false}).count() / total_trials * 100);
    var missing = Math.round(jsPsychGlobal.data.get().filter({correct: null}).count() / total_trials * 100);
    var correct_rt = Math.round(jsPsychGlobal.data.get().filter({correct: true}).select('rt').mean());
    var incorrect_rt = Math.round(jsPsychGlobal.data.get().filter({correct: false}).select('rt').mean());

    smartdown.set({
      trialData: trimmedTrials,
      Correct: correct,
      Incorrect: incorrect,
      Missing: missing,
      CorrectRT: correct_rt,
      IncorrectRT: incorrect_rt,
    });

    smartdown.showDisclosure('stats', '', 'inline,scrollable,lightbox');

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
// timeline.push(instructionsBlock);

const pixi_flag = false;  // jsPsych.data.getURLVariable('pixi_flag') === '1' ? true : false;
const symbolRadius = 20;

class Symbol {
  obj_type;
  startX;
  startY;
  width;
  height;
  targetRadius;

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

const stimulusTypes = [
  'glyph',
  'rect',
  'ellipse',
];

const stimulusColors = [
  'red',
  'green',
  'blue',
  // 'orange',
  // 'yellow',
  // 'magenta',
  // 'cyan',
  // // 'black',
  // 'white',
];

const glyphSymbols = [
  'A',
  'B',
  'C',
  'X',
  'Y',
  'Z',
];

function drawSprite(context, x, y) {
  context.fillStyle = 'yellow';
  context.fillRect(100, 100, 100, 100);
}

class Trial {
  type;
  pixi;
  response_type;
  canvas_width;
  canvas_height;
  data;
  stimuli;
  trial_duration;
  mouse_down_func;
  response_start_time;
  response_ends_trial;

  constructor(numSymbols) {
    this.type = jsPsychPsychophysics;
    this.pixi = pixi_flag;
    this.response_type = useAnimatedResponse ? 'key' : 'mouse';
    this.choices = 'NO_KEYS';
    this.canvas_width = canvasWidth;
    this.canvas_height = canvasHeight;
    this.background_color = 'black';
    this.trial_duration = trialDuration;
    this.response_start_time = firstShowTime + firstHideDelta + secondShowDelta;
    this.response_ends_trial = !useAnimatedResponse;
    this.data = {
      correct: null,
      rt: null,
    };

    this.mouse_down_func = (e) => {
      if (useAnimatedResponse) {
        const thisTrial = jsPsych.getCurrentTrial();
        // jsPsych.pauseExperiment();
        const stims = thisTrial.stim_array;
        console.log('mouse_down_func', e.offsetX, e.offsetY, thisTrial);

        stims.forEach((stim) => {
          stim.fill_color = 'pink';
          stim.text_color = 'pink';
        });

        const responseData = {
          // rt: null,
          response_type: 'key',
          // key_press: -1,
          response: true,
          // avg_frame_time: 16.65680473372781,
          // center_x: 150,
          // center_y: 250,
          click_x: e.offsetX,
          click_y: e.offsetY,
          // correct: null,
          // trial_type: 'psychophysics',
          // trial_index: 0,
          // time_elapsed: 5654,
          // internal_node_id: '0.0-0.0',
          // correct: true,
        };

        // window.setTimeout(() => {
        //   jsPsych.resumeExperiment();
        //   jsPsych.finishTrial(responseData);
        // }, animationDelay);
      }
      else {
        console.log('mouse_down_func inert due to !useAnimatedResponse');
      }
    };

    this.buildRawStimuli(numSymbols);
    this.buildStimuli();
  }

  buildRandomStimulus(x, y) {
    const stimulusType = stimulusTypes[Math.floor(Math.random() * stimulusTypes.length)];
    const stimulusColor = stimulusColors[Math.floor(Math.random() * stimulusColors.length)];

    const stimulusX = x;
    const stimulusY = y;
    const stimulusWidth = Math.floor((0.6 + Math.random()) * maxStimulusWidth);
    const stimulusHeight = Math.floor((0.6 + Math.random()) * maxStimulusHeight);

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

// timeline.push(new Trial(1));
// timeline.push(new Trial(1));
// timeline.push(new Trial(1));
// timeline.push(new Trial(1));
// timeline.push(new Trial(1));

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


# :::: stats

```plotly /autoplay
const myDiv = this.div;
myDiv.innerHTML = `<h3>Waiting for data to be available</h3>`;
this.dependOn.trialData = function() {
  myDiv.innerHTML = '';
  const experimentData = env.trialData;
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

- [Repeat Experiment](:@JSPsych/Psychophysics)
- [Back to jsPsych Home](:@JSPsych)
# ::::


