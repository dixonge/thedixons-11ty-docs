---
searchTitle: Search
putTheJsInTheHead: true
layout: layouts/houses.njk
---
# Search

<form action="https://duckduckgo.com/" method="get" class="search" id="eleventy-search">
	<div class="search-lo lo">
		<div class="lo-c lo-maxgrow">
			<label for="search-term" class="sr-only">Search Terms</label>
			<input type="search" name="q" id="search-term" value="site:www.thedixons.net " class="search-txt" autocomplete="off">
		</div>
		<div class="lo-c">
			<button type="submit" class="search-btn btn-form">Search</button>
		</div>
	</div>
	<p>Search provided by <span class="investors-noauth"><a href="https://duckduckgo.com/">Duck Duck Go</a>.</span></p>
<div id="search-results" class="hide">
	<h2 id="search-results-count" aria-live="polite">Results</h2>
	<ol id="search-results-list"></ol>
</div>