const { DateTime } = require("luxon");
const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
const Terser = require("terser");
const HumanReadable = require("human-readable-numbers");
const markdownIt = require("markdown-it");
const syntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");
const loadLanguages = require("prismjs/components/");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

const rssPlugin = require("@11ty/eleventy-plugin-rss");
const cfg = require("./_data/config.js");
const slugify = require('slugify');

// Load yaml from Prism to highlight frontmatter
loadLanguages(['yaml']);

const shortcodes = {
	link: function(linkUrl, content) {
		return (linkUrl ? `<a href="${linkUrl}">` : "") +
			content +
			(linkUrl ? `</a>` : "");
	}
};

module.exports = function(eleventyConfig) {
	eleventyConfig.setDataDeepMerge(true);
	if(!process.env.ELEVENTY_PRODUCTION) {
		eleventyConfig.setQuietMode(true);
	}

	eleventyConfig.setBrowserSyncConfig({
		ui: false,
		ghostMode: false
	});

	eleventyConfig.addPlugin(syntaxHighlightPlugin, {
		templateFormats: "md",
		init: function({ Prism }) {
			Prism.languages.markdown = Prism.languages.extend('markup', {
				'frontmatter': {
					pattern: /^---[\s\S]*?^---$/m,
					greedy: true,
					inside: Prism.languages.yaml
				}
			});
		}
	});
	eleventyConfig.addPlugin(rssPlugin) ;
	eleventyConfig.addPlugin(eleventyNavigationPlugin);

	eleventyConfig.addCollection("sidebarNav", function(collection) {
		// everything but news
		return collection.getAll().filter(item => (item.data.tags || []).indexOf("news") === -1);
	});

	let md = new markdownIt();
	eleventyConfig.addPairedShortcode("callout", function(content, level = "warn", format = "html") {
		if( format === "md" ) {
			content = md.renderInline(content);
		}
		return `<div class="elv-callout elv-callout-${level}">${content}</div>`;
	});

	eleventyConfig.addShortcode("emoji", function(emoji, alt = "") {
		return `<span aria-hidden="true" class="emoji">${emoji}</span>` +
			(alt ? `<span class="sr-only">${alt}</span>` : "");
	});

	eleventyConfig.addShortcode("codetitle", function(title, heading = "Filename") {
		return `<div class="codetitle codetitle-left"><b>${heading} </b>${title}</div>`;
	});

	eleventyConfig.addPairedShortcode("minilink", function(text, href) {
		return `<a href="${href}" class="minilink minilink-lower">${text}</a>`;
	});

	eleventyConfig.addPairedShortcode("codewithprompt", function(text, prePrefixCode, when) {
		return `<div data-preprefix-${prePrefixCode}="${when}">

\`\`\`bash/-
${text.trim()}
\`\`\`

</div>`;
	});

	eleventyConfig.addShortcode("addedin", function(version, tag, extraClass) {
		if( typeof version !== "string" ) {
			tag = version.tag;
			version = version.version;
		}

		let versionPrefix = "";
		if(("" + version).match(/^[0-9]/)) {
			versionPrefix = "v";
		}

		tag = tag || "span";

		return `<${tag} class="minilink minilink-addedin${extraClass ? ` ${extraClass}`: ""}">New in ${versionPrefix}${version}</${tag}>`;
	});

	eleventyConfig.addPassthroughCopy({
		"node_modules/instant.page/instantpage.js": "js/instant.page.js",
		"node_modules/@11ty/logo/img/logo-300x418.png": "img/logo-github.png",
		"node_modules/@11ty/logo/img/logo-96x96.png": "img/favicon.png"

	});
	eleventyConfig.addPassthroughCopy("css/fonts");
	eleventyConfig.addPassthroughCopy("img");
	eleventyConfig.addPassthroughCopy("favicon.ico");

	eleventyConfig.addFilter("toJSON", function(obj) {
		return JSON.stringify(obj);
	});

	eleventyConfig.addFilter("toSearchEntry", function(str) {
		// <a class="direct-link" href="#eleventy-is-supported-financially-by-the-following-lovely-people" title="Direct link to this heading">#</a>
		return str.replace(/<a class="direct-link"[^>]*>#<\/a\>/g, "");
	});

	eleventyConfig.addFilter("humanReadableNum", function(num) {
		return HumanReadable.toHumanString(num);
	});

	eleventyConfig.addShortcode("templatelangs", function(languages, page, whitelist, anchor, isinline) {
		let parentTag = isinline ? "span" : "ul";
		let childTag = isinline ? "span" : "li";

		return `<${parentTag} class="inlinelist">${languages.filter(lang => !whitelist ? true : whitelist.indexOf(lang.ext) > -1).map(lang => `<${childTag} class="inlinelist-item${page.url == lang.url ? ' active' : ''}"><a href="${lang.url}${anchor || ''}">${lang.name} <code>*.${lang.ext}</code></a></${childTag}>`).join(" ")}</${parentTag}>`;
	});

	eleventyConfig.addShortcode("latestVersion", function(versions, config, prefix = "v") {
		for( let version of versions ) {
			if( version.tag === "LATEST" ) {
				continue;
			}
			if( !config.prerelease && version.prerelease ) {
				continue;
			}

			return prefix + version.tag.substr(1);
		}
	});

	eleventyConfig.addFilter("orphanWrap", str => {
		let splitSpace = str.split(" ");
		let after = "";
		if( splitSpace.length > 2 ) {
			after += " ";

			// TODO strip HTML from this?
			let lastWord = splitSpace.pop();
			let secondLastWord = splitSpace.pop();

			after += `${secondLastWord}&nbsp;${lastWord}`;
		}

		return splitSpace.join(" ") + after;
	});

	function randomizeArray(arr) {
		let a = arr.slice(0);
		for (let i = a.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	// Thanks to https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
	eleventyConfig.addFilter("shuffle", arr => {
		if( Array.isArray(arr) ) {
			return randomizeArray(arr);
		}

		let keys = randomizeArray(Object.keys(arr));
		let a = {};
		for(let key of keys) {
			a[key] = arr[key];
		}
		return a;
	});

	// Thanks to https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
	eleventyConfig.addFilter("randompick", arr => {
		if( Array.isArray(arr) ) {
			return arr[Math.floor(Math.random() * arr.length)];
		}

		let randkey = Object.keys(arr)[Math.floor(Math.random() * arr.length)];
		return arr[randkey]
	});

	eleventyConfig.addFilter("getsize", arr => {
		if( Array.isArray(arr) ) {
			return arr.length
		}

		return Object.keys(arr).length;
	});

	/* Markdown */
	let markdownItAnchor = require("markdown-it-anchor");
	let markdownItToc = require("markdown-it-table-of-contents");

	function removeExtraText(s) {
		let newStr = String(s).replace(/New\ in\ v\d+\.\d+\.\d+/, "");
		newStr = newStr.replace(/⚠️/g, "");
		newStr = newStr.replace(/[?!]/g, "");
		newStr = newStr.replace(/<[^>]*>/g, "");
		return newStr;
	}

	function markdownItSlugify(s) {
		return slugify(removeExtraText(s), { lower: true, remove: /[:’'`,]/g });
	}

	let mdIt = markdownIt({
		html: true,
		breaks: true,
		linkify: true
	})
	.use(markdownItAnchor, {
		permalink: true,
		slugify: markdownItSlugify,
		permalinkBefore: false,
		permalinkClass: "direct-link",
		permalinkSymbol: "#",
		level: [1,2,3,4]
	})
	.use(markdownItToc, {
		includeLevel: [2, 3],
		slugify: markdownItSlugify,
		format: function(heading) {
			return removeExtraText(heading);
		},
		transformLink: function(link) {
			// remove backticks from markdown code
			return link.replace(/\%60/g, "");
		}
	});

	mdIt.linkify.tlds('.io', false);
	eleventyConfig.setLibrary("md", mdIt);

	eleventyConfig.addFilter("newsDate", dateObj => {
		return DateTime.fromJSDate(dateObj).toFormat("yyyy LLLL dd");
	});

	// Until https://github.com/valeriangalliat/markdown-it-anchor/issues/58 is fixed
	eleventyConfig.addTransform("remove-aria-hidden-markdown-anchor", function(content, outputPath) {
		if( outputPath && outputPath.endsWith(".html") ) {
			return content.replace(/ aria\-hidden\=\"true\"\>\#\<\/a\>/g, ` title="Direct link to this heading">#</a>`);
		}

		return content;
	});

	if( cfg.minifyHtml ) {
		eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
			if( process.env.ELEVENTY_PRODUCTION && outputPath && outputPath.endsWith(".html") ) {
				let minified = htmlmin.minify(content, {
					useShortDoctype: true,
					removeComments: true,
					collapseWhitespace: true
				});
				return minified;
			}

			return content;
		});
	}

	eleventyConfig.addFilter("jsmin", function(code) {
		if(process.env.ELEVENTY_PRODUCTION) {
			let minified = Terser.minify(code);
			if( minified.error ) {
				console.log("Terser error: ", minified.error);
				return code;
			}

			return minified.code;
		}

		return code;
	});

	eleventyConfig.addFilter("cssmin", function(code) {
		if(process.env.ELEVENTY_PRODUCTION) {
			return new CleanCSS({}).minify(code).styles;
		}

		return code;
	});

	return {
		templateFormats: ["html", "njk", "md", "11ty.js"],
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dataTemplateEngine: false,
		passthroughFileCopy: true
	};
};
