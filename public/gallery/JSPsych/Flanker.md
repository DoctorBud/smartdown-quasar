
# :::: stats

- Accuracy [](:!Accuracy)
- [Congruent Response (ms)](:!CongruentRT)
- [Incongruent Response (ms)](:!IncongruentRT)

```plotly /autoplay
const myDiv = this.div;
myDiv.innerHTML = `<h3>Waiting for data to be available</h3>`;
this.dependOn.data = function() {
  myDiv.innerHTML = '';
  const experimentData = env.data;
  const correctVsIncorrect = [0, 0];
  experimentData.forEach((trial) => {
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
    var total_trials = jsPsychGlobal.data.get().filter({trial_type: jsPsychImageButtonResponse}).count();
    var accuracy = Math.round(jsPsychGlobal.data.get().filter({correct: true}).count() / total_trials * 100);
    var congruent_rt = Math.round(jsPsychGlobal.data.get().filter({correct: true, stim_type: 'congruent'}).select('rt').mean());
    var incongruent_rt = Math.round(jsPsychGlobal.data.get().filter({correct: true, stim_type: 'incongruent'}).select('rt').mean());

    smartdown.set({
      Accuracy: accuracy,
      CongruentRT: congruent_rt,
      IncongruentRT: incongruent_rt,
    });

  smartdown.showDisclosure('stats', '', 'inline,scrollable,lightbox');
};
```

```javascript /autoplay/kiosk
//smartdown.import=https://unpkg.com/jspsych@7.3.0/dist/index.browser.min.js
//smartdown.import=https://unpkg.com/@jspsych/plugin-html-button-response@1.1.1/dist/index.browser.min.js
//smartdown.import=https://unpkg.com/@jspsych/plugin-image-button-response@1.1.1/dist/index.browser.min.js
//smartdown.import=https://unpkg.com/@jspsych/plugin-html-keyboard-response@1.1.1/dist/index.browser.min.js

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
    myDiv.focus();
  },
  on_finish: function(){
    const experimentData = jsPsych.data.get().values();
    smartdown.setVariable('data', experimentData);
    SQ.setToolbarFade(false);
    smartdown.toggleKiosk(myDiv.id);
    myDiv.style.display = 'none';
  }
});
window.jsPsychGlobal = jsPsych;

env.data = undefined;
const fakeData = [
  {
    "rt": 123030,
    "stimulus": "\n<br>\n<p>\n  In this task, you will see five arrows on the screen, like the example below.\n</p>\n<img src=\"/gallery/resources/inc1.png\"></img>\n<p>\nPress Left if the middle arrow is pointing left. (<b>&lt;</b>)\n</p>\n<p>\nPress Right if the middle arrow is pointing right. (<b>&gt;</b>)\n</p>\n<p>\nPress <b>Begin</b>.\n</p>\n",
    "button_pressed": "0",
    "trial_type": "html-button-response",
    "trial_index": 0,
    "time_elapsed": 123033,
    "internal_node_id": "0.0-0.0"
  },
  {
    "rt": 1217.9999999999854,
    "stimulus": "/gallery/resources/con1.png",
    "button_pressed": "1",
    "stim_type": "congruent",
    "direction": "left",
    "trial_type": "image-button-response",
    "trial_index": 1,
    "time_elapsed": 125257,
    "internal_node_id": "0.0-1.0-0.0",
    "correct": false
  },
  {
    "rt": 1058,
    "stimulus": "/gallery/resources/inc2.png",
    "button_pressed": "1",
    "stim_type": "incongruent",
    "direction": "left",
    "trial_type": "image-button-response",
    "trial_index": 2,
    "time_elapsed": 126840,
    "internal_node_id": "0.0-1.0-0.1",
    "correct": false
  },
  {
    "rt": 676.0000000000291,
    "stimulus": "/gallery/resources/con2.png",
    "button_pressed": "1",
    "stim_type": "congruent",
    "direction": "right",
    "trial_type": "image-button-response",
    "trial_index": 3,
    "time_elapsed": 128357,
    "internal_node_id": "0.0-1.0-0.2",
    "correct": true
  },
  {
    "rt": 500,
    "stimulus": "/gallery/resources/inc1.png",
    "button_pressed": "1",
    "stim_type": "incongruent",
    "direction": "right",
    "trial_type": "image-button-response",
    "trial_index": 4,
    "time_elapsed": 129940,
    "internal_node_id": "0.0-1.0-0.3",
    "correct": true
  },
  {
    "trial_type": "html-keyboard-response",
    "trial_index": 5,
    "time_elapsed": 131906,
    "internal_node_id": "0.0-2.0"
  }
];

// smartdown.set('data', fakeData);
// return;

myDiv.style.height = '400px';
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
  padding: 0;
  font-weight: 600;
  font-size: 50px;
}
`);

const imgPrefix = '/gallery/resources/';

/*set up experiment structure*/
var timeline = [];

const instructionsStimulus =
`
<br>
<p>
  In this task, you will see five arrows on the screen, like the example below.
</p>
<img src="${imgPrefix}inc1.png"></img>
<p>
Press Left if the middle arrow is pointing left. (<b>&lt;</b>)
</p>
<p>
Press Right if the middle arrow is pointing right. (<b>&gt;</b>)
</p>
<p>
Press <b>Begin</b>.
</p>
`;

var instructionsBlock = {
  type: jsPsychHtmlButtonResponse,
  stimulus: instructionsStimulus,
  choices: ['Begin'],
  post_trial_gap: 1000
};
timeline.push(instructionsBlock);

var testStimuli = [
  {
    stimulus: imgPrefix + 'con1.png',
    data: { stim_type: 'congruent', direction: 'left'}
  },
  {
    stimulus: imgPrefix + 'con2.png',
    data: { stim_type: 'congruent', direction: 'right'}
  },
  {
    stimulus: imgPrefix + 'inc1.png',
    data: { stim_type: 'incongruent', direction: 'right'}
  },
  {
    stimulus: imgPrefix + 'inc2.png',
    data: { stim_type: 'incongruent', direction: 'left'}
  }
];

/* defining test timeline */
var testBlock = {
  timeline: [{
    type: jsPsychImageButtonResponse,
    choices: ['<b class="bigbutton">&lt;</b>', '<b class="bigbutton">&gt;</b>'],
    trial_duration: 1500,
    stimulus: jsPsych.timelineVariable('stimulus'),
    data: jsPsych.timelineVariable('data'),
    on_finish: function(data){
      var correct = false;
      if (data.direction == 'left' &&  data.button_pressed === '0' && data.rt > -1) {
        correct = true;
      }
      else if (data.direction == 'right' && data.button_pressed === '1' && data.rt > -1) {
        correct = true;
      }

      data.correct = correct;
      console.log('#data', data.direction, data.button_pressed, data.correct);
    },
    post_trial_gap: function() {
        return Math.floor(Math.random() * 1500) + 500;
    }
  }],
  timeline_variables: testStimuli,
  sample: {
    type: 'with-replacement', // fixed-repetitions',
    size: 6,
    randomize_order: true,
  }
};
timeline.push(testBlock);


// var debriefBlock = {
//   type: 'html-keyboard-response',
//   choices: jsPsych.NO_KEYS,
//   stimulus: function() {
//     jsPsych.endExperiment();

//     return 'xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx';
//   }
// };
// timeline.push(debriefBlock);


jsPsych.run(timeline);

window.setTimeout(function() {
  const top = myDiv.offsetTop - 40;
  document.body.scrollTop = top; // For Chrome, Safari and Opera
  document.documentElement.scrollTop = top; // For IE and Firefox
  myDiv.focus();
}, 0);

```
