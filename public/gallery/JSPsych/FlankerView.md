### Visualized Results

```plotly /autoplay/playable
const myDiv = this.div;
myDiv.innerHTML = `<h3>Waiting for flankerData to be available</h3>`;
this.dependOn = ['flankerData'];
this.depend = function() {
  myDiv.innerHTML = '';
  const experimentData = env.flankerData;
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
    height: 350,
    width: 350
  };

  Plotly.newPlot(myDiv, data, layout, {displayModeBar: false});
}

```

Now that we have the data gathered via `jsPsych` in a Smartdown variable, we can use other tech to visualize the data. Since this is a first draft, we'll just do something pretty, but meaningless. We'll just build a pie-chart that shows the correct vs incorrect percentages. We'll use [Plotly](https://smartdown.site/#gallery/Plotly.md), which is a nice library built upon [D3](https://smartdown.site/#gallery/D3.md) that makes it easy to make charts and graphs.

We're going to have to write a little code to make this visualization happen.


### Raw Results


The `jsPsych` results from the previous experiment have been captured in the Smartdown variable `experimentData`, which we can display in raw JSON format via a Smartdown [Cell]()

[Experiment Data](:!flankerData|json)


---

- [Repeat Experiment](:@JSPsych/Flanker)
- [Back to jsPsych Home](:@JSPsych)
