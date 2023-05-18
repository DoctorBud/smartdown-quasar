## Accessing External Data Sources

blah

### Accessing BatBase Data

[Bat Eco-Interactions aka BatBase](https://www.batbase.org) describes itself as:

> With over 1,400 species worldwide, bats are critical components to many ecosystems as pollinators, seed dispersers, and consumers of night-flying insects, among many other ecological roles. We created the Bat Eco-Interactions Database to facilitate scientific research worldwide on bat diets and the ecosystem services they provide by gathering all published, peer-reviewed accounts of these interactions.

This document is an exploration of whether we can *play* with the BatBase data in Smartdown by first fetching relevant data from the BatBase server and storing it in a Smartdown variable, and then seeing if we can visualize or analyze the data. This is not intended to be a full appliction; rather, it is an *explorable explanation* of an approach to obtaining, analyzing, and visualizing interesting data from an external source.

### Trying to get the data from BatBase

It appears that `BatBase` doesn't currently have a documented public API for the purpose of querying, and possibly editing, the rich set of eco-interaction data. But after inspecting the behavior of the web application and examining the source code at the [BatBase GitLab Repository](https://gitlab.com/bat-eco-interactions/BatBase), it looks like we might be able to obtain the data we want via the server's data-providing endpoints.

#### Using a proxy to address CORS

Because BatBase does not explicitly support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), we'll have to *proxy* our request through a proxy server. After experimenting with various options, I learned that CloudFlare provides a [CloudFlare Workers](https://workers.cloudflare.com) capability that makes it easy to deploy a prozy server that bridges between a CORS-aware web application and a legacy CORS-unaware server. I adopted and adapted the code at [CORSFlare](https://github.com/Darkseal/CORSflare) so that I could use a CloudFlare worker as a CORS proxy. I used the [Worker Route](https://developers.cloudflare.com/workers/platform/triggers/routes/) capability to enable my existing [smartdown.site](https://smartdown.site) to support a `/corsproxy` route which invokes the worker, which then invokes the BatBase server and adds the proper CORS headers.

### Using the `/stats` endpoint via Javascript and `fetch`

The endpoint `https://www.batbase.org/stats/` returns a small JSON object with summary statistics about the current contents of the BatBase dataset. Let's see if we can invoke `/stats` and display the result. We'll start out by using a Javascript playable that uses [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to obtain the data. We will use `POST` and supply a `body` content of `{"tag":"db"}`, which will return statistics about the entire database. (There are likely other values for `tag` that will perform different queries, but they have not been explored yet).

```javascript /playable/autoplay
  const statsURL = `https://smartdown.site/corsproxy/stats/`;
  const statsOpts = {
    method: 'post',
    body: '{"tag":"db"}',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  };

  const statsData = await fetch(statsURL, statsOpts);
  if (statsData.status === 200) {
    console.log('statsData', statsData);
    const stats = await statsData.json();
    console.log('stats', stats);
    smartdown.set('Stats', stats);
  }
  else {
    console.log('statsData error', statsData);
  }
```

[Stats](:!Stats|json)

### Visualizing the Result

Let's build a little pie chart using `Plotly`. The response from the `/stats` endpoint is JSON, but it is not well-suited for immediate usage because it has human-readable labels instead of pure numbers. An example response would be:

```
{
  "bat": "535 Bat Species",
  "cite": "725 Citations",
  "int": "16491 Interactions",
  "loc": "941 Locations in 120 Countries",
  "nonBat": "2552 Other Species"
}
```

So we need to clean up this data a little bit before displaying it.

#### A Pie Chart

```javascript /plotly/playable/autoplay
function cleanup(key, value) {
  const tokens = value.split(' ');
  const firstNumber = tokens[0];
  const label = tokens.slice(1).join(' ');

  return [firstNumber, label];
}

var layout = {
    title: 'Batbase Database Stats',
    autosize: true,
    width: 600,
    height: 600,
    margin: {
      t: 100, b: 0, l: 50, r: 0
    }
};

this.dependOn.Stats = () => {
  const stats = env.Stats;
  const statsKeys = Object.keys(stats);

  const values = [];
  const labels = [];

  statsKeys.forEach((key) => {
    const cleanData = cleanup(key, stats[key]);
    values.push(cleanData[0]);
    labels.push(cleanData[1]);
  });

  const plot = {
    values,
    labels,
    text: 'FOOO',
    type:   'pie',
    hoverinfo: 'text',
    hole: .3
  };

  Plotly.newPlot(this.div,
    [plot],
    layout,
    {displayModeBar: false} );
};

```

### More Data Visualization


**TBD**


