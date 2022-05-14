```javascript /autoplay/kiosk
//smartdown.import=https://cdn.jsdelivr.net/gh/jspsych/jsPsych@6.1.0/jspsych.js
//smartdown.import=https://cdn.jsdelivr.net/gh/jspsych/jsPsych@6.1.0/plugins/jspsych-html-button-response.js
//smartdown.import=https://cdn.jsdelivr.net/gh/jspsych/jsPsych@6.1.0/plugins/jspsych-html-keyboard-response.js
//smartdown.import=https://cdn.jsdelivr.net/gh/jspsych/jsPsych@6.1.0/plugins/jspsych-image-button-response.js

env.flankerData = undefined;

const myDiv = this.div;
// myDiv.style.width = '500px';
myDiv.style.height = '400px';
myDiv.style.margin = 'auto';

smartdown.importCssUrl('https://cdn.jsdelivr.net/gh/jspsych/jsPsych@6.1.0/css/jspsych.css');
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
`);

const imgPrefix = '/gallery/resources/';

var reps_per_trial_type = 1;

/*set up experiment structure*/
var timeline = [];

var welcomeBlock = {
  type: 'html-button-response',
  stimulus: 'Welcome to the experiment. Press <b>Begin</b>.',
  choices: ['Begin'],
};
timeline.push(welcomeBlock);


const instructionsStimulus =
`
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
  type: 'html-button-response',
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
    type: 'image-button-response',
    choices: ['<b>&lt</b>;', '<b>&gt;</b>'],
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
  sample: {type: 'fixed-repetitions', size: reps_per_trial_type}
};
timeline.push(testBlock);


var debriefBlock = {
  type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  stimulus: function() {
    var total_trials = jsPsych.data.get().filter({trial_type: 'image-button-response'}).count();
    var accuracy = Math.round(jsPsych.data.get().filter({correct: true}).count() / total_trials * 100);
    var congruent_rt = Math.round(jsPsych.data.get().filter({correct: true, stim_type: 'congruent'}).select('rt').mean());
    var incongruent_rt = Math.round(jsPsych.data.get().filter({correct: true, stim_type: 'incongruent'}).select('rt').mean());
    const result =
`
<p>
  You responded correctly on <strong>${accuracy}%</strong> of the trials.
</p>
<p>
  Your average response time for congruent trials was <strong>${congruent_rt}ms</strong>.
</p>
<p>
  Your average response time for incongruent trials was <strong>${incongruent_rt}ms</strong>.
</p>
<p>
The experiment is now complete. Thank you!
</p>
`;

    smartdown.toggleKiosk(myDiv.id);
    jsPsych.endExperiment();

    return result;
  }
};
timeline.push(debriefBlock);


jsPsych.init({
  on_trial_start: function() {
    myDiv.focus();
  },
  timeline: timeline,
  display_element: myDiv,
  on_finish: function() {
    const experimentData = jsPsych.data.get().values();
    smartdown.setVariable('flankerData', experimentData);
  }
});


window.setTimeout(function() {
  const top = myDiv.offsetTop - 40;
  document.body.scrollTop = top; // For Chrome, Safari and Opera
  document.documentElement.scrollTop = top; // For IE and Firefox
  myDiv.focus();
}, 0);

```

---

- [View Flanker Data](:@JSPsych/FlankerView)
- [Back to jsPsych Home](:@JSPsych)

