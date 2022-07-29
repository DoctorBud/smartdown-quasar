
# :::: stats

- Accuracy [](:!Accuracy)
- [Correct Response Time (ms)](:!CorrectRT)
- [Incorrect Response Time (ms)](:!IncongruentRT)

```plotly /autoplay
const myDiv = this.div;
myDiv.innerHTML = `<h3>Waiting for data to be available</h3>`;
this.dependOn.data = function() {
  myDiv.innerHTML = '';
  const experimentData = env.data;
  const correctVsIncorrect = [0, 0];
  experimentData.forEach((trial) => {
    console.log('trial', trial);
    if (trial.correct !== undefined) {
      if (trial.correct) {
        correctVsIncorrect[0] += 1;
      }
      else {
        correctVsIncorrect[1] += 1;
      }
    }
  });
  var data = [{
    values: correctVsIncorrect,
    labels: ['Correct', 'Incorrect'],
    type: 'pie'
  }];

  var layout = {
    height: 250,
    width: 250
  };

  Plotly.newPlot(myDiv, data, layout, {displayModeBar: false});
}

```

---

- [Repeat Experiment](:@JSPsych/Flanker)
- [Back to jsPsych Home](:@JSPsych)
# ::::


```javascript /autoplay
this.dependOn.data = () => {
    var total_trials = jsPsychGlobal.data.get().filter({trial_type: 'psychophysics'}).count();
    var accuracy = Math.round(jsPsychGlobal.data.get().filter({correct: true}).count() / total_trials * 100);
    var correct_rt = Math.round(jsPsychGlobal.data.get().filter({correct: true}).select('time_elapsed').mean());
    var incorrect_rt = Math.round(jsPsychGlobal.data.get().filter({correct: false}).select('time_elapsed').mean());

    console.log('data', jsPsychGlobal.data.get());
    smartdown.set({
      Accuracy: accuracy,
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
    const lastStimulus = stimuli.slice(-1)[0];
    const deltaX = data.click_x - lastStimulus.startX;
    const deltaY = data.click_y - lastStimulus.startY;
    const deltaRadius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const isWithin = deltaRadius < lastStimulus.radius;
    console.log('trial.data1', trial, trial.data);
    data.correct = isWithin;
    data.rt = data.time_elapsed - lastStimulus.show_start_time;
    console.log('on_trial_finish', data);
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
  stimulus: `<br><br><h1>This is a sample program for the jspsych-psychophysics plugin.</h1><br><br><br><br>`,
  prompt: `A white rectangle will appear. \nA red circle will appear 4 sec later.\nType Y or N to exit the experiment`,
  choices: ['Begin'],
  post_trial_gap: 1000
};
// timeline.push(instructionsBlock);


const pixi_flag = false;  // jsPsych.data.getURLVariable('pixi_flag') === '1' ? true : false;

// const text_object = {
//   obj_type: 'text',
//   startX: 'center',
//   startY: 'center',
//   content: 'A white rectangle will appear. \nA red circle will appear 4 sec later.\nType Y or N to exit the experiment',
//   font: "16px 'Arial'",
//   text_color: 'white',
//   show_end_time: 2000 // disappear this text
// }

const yellow_vrect_object = {
    obj_type: 'rect', // means a rectangle
    startX: 50, // location in the canvas
    startY: 50,
    width: 10, // of the rectangle
    height: 20,
    line_color: 'yellow',
    fill_color: 'yellow',
    show_start_time: 2000 // ms after the start of the trial
}

const orange_hrect_object = {
    obj_type: 'rect', // means a rectangle
    startX: 150, // location in the canvas
    startY: 150,
    width: 20, // of the rectangle
    height: 10,
    line_color: 'orange',
    fill_color: 'orange',
    show_start_time: 2000 // ms after the start of the trial
}

const red_circle_object = {
    obj_type: 'circle',
    startX: 150, // location in the canvas
    startY: 250,
    radius: 15,
    line_color: 'red', // You can use the HTML color name instead of the HEX color.
    fill_color: 'red',
    show_start_time: 2000,  // ms after the start of the trial
    show_end_time: 3000   // ms after the start of the trial
}

const blue_circle_object = {
    obj_type: 'circle',
    startX: 150, // location in the canvas
    startY: 250,
    radius: 15,
    line_color: 'blue', // You can use the HTML color name instead of the HEX color.
    fill_color: 'blue',
    show_start_time: 3000 // ms after the start of the trial
}

// function mouse_down_func(event) {
//   const trial = jsPsych.getCurrentTrial();
//   const stimuli = trial.stimuli;
//   const lastStimulus = stimuli.slice(-1)[0];
//   const deltaX = event.offsetX - lastStimulus.startX;
//   const deltaY = event.offsetY - lastStimulus.startY;
//   const deltaRadius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
//   const isWithin = deltaRadius < lastStimulus.radius;
//   console.log('trial.data1', trial, trial.data);
//   trial.data.correct = isWithin;
//   trial.data.rt = trial.time_elapsed - lastStimulus.show_start_time;
//   console.log('mouse', isWithin, event.offsetX, event.offsetY, trial.time_elapsed, lastStimulus.show_start_time);
//   console.log('trial.data2', trial.data);

//   // jsPsych.finishTrial({correct: isWithin});
//   // jsPsych.endCurrentTimeline();
// }

const trial_common = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    response_type: 'mouse',
    canvas_width: 300,
    canvas_height: 500,
    data: {
      correct: null,
      rt: null,
    },
    // mouse_down_func,                
}

const trial1 = {
  ...trial_common,
  stimuli: [yellow_vrect_object, orange_hrect_object, red_circle_object, blue_circle_object],
  background_color: 'pink',
}
timeline.push(trial1);
timeline.push(trial1);
timeline.push(trial1);
timeline.push(trial1);

jsPsych.run(timeline);

window.setTimeout(function() {
  const top = myDiv.offsetTop - 40;
  document.body.scrollTop = top; // For Chrome, Safari and Opera
  document.documentElement.scrollTop = top; // For IE and Firefox
  myDiv.focus();
}, 0);

```
