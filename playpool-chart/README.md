This is a simple idea for a particular type of chart.

You can read [my blog post on the playpool chart idea](http://guypursey.com/blog/201607042300-playpool-chart) to find out more.

This visualisation is available to see on the web directly via [Blocks](http://bl.ocks.org/guypursey/f0c2101efd29dfb71ac1b5f81d71ef30).

## Local usage

If downloading as a local repo, viewing the HTML file directly can be problematic unless you enable CORS (cross-origin resource sharing). This is because the data is pulled in from `sample-data.tsv` and if you view the HTML file directly without CORS enabled the browser is prevented from getting the data file even though it's in the same folder.

To get around this, I've specified `http-server` as a devDependency.

You can use either `npm start` or `http-server` to start up a simple local server and then go its address (e.g., `localhost:8080`) in your browser directly to see the file.

## Local development

If developing this visualisation for yourself, you should know that the Node packages are included as dependencies in `package.json`.

You can use `npm install` as usual to get these.

Amend `index.html` and `main.js` to make changes.

Because the visualisation was developed with the browser and specifically Blocks, in mind, each time you update `main.js` you will need to run

	browserify main.js > bundle.js

This updates the `bundle.js` file that pulls together the main code and any package dependencies for the browser.
