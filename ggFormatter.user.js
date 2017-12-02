// ==UserScript==
// @name         ggFormatter
// @version      0.2.2
// @author       Thomas ‘PointedEars’ Lahn <js@PointedEars.de>
// @namespace    http://PointedEars.de/
// @require      http://PointedEars.de/scripts/object.js
// @description  Formats Google Groups postings
// @match        https://groups.google.com/*
// @grant        none
// ==/UserScript==

var selector = ".F0XO1GC-nb-P";
var s = document.createElement("style");
s.type = "text/css";
s.appendChild(document.createTextNode(selector + " { font-family: monospace; }"));
document.head.appendChild(s);

var intv = window.setInterval(function () {
  /*
   * Collapsed postings are not in the document tree yet;
   * use continuous polling (class prevents formatting twice)
   */
  var postings = document.querySelectorAll(selector + ":not(.ggformatter-formatted)");
  if (!postings || postings.length === 0) return;
    [].slice.call(postings).forEach(function (posting) {
        posting.innerHTML = posting.innerHTML.replace(
            /<[^>]*>|\b(\*([^*]+)\*|\/([^\/]+)\/|_([^_]+)_)\b/g,
            function (match, formatted, bold, italic, underline) {
                if (!formatted) return match;
                if (bold) return "*<b>" + bold + "</b>*";
                if (italic) return "/<i>" + italic + "</i>/";
                if (underline) return "_<u>" + underline + "</u>_";
            });

      posting.classList.add("ggformatter-formatted");
    });

    jsx.dmsg("ggFormatter: Formatted " + postings.length + " postings.", "info");
}, 500);
