// ==UserScript==
// @name         ggFormatter
// @version      0.2.2
// @author       Thomas ‘PointedEars’ Lahn <js@PointedEars.de>
// @namespace    http://PointedEars.de/
// @description  Formats Google Groups postings
// @match        https://groups.google.com/*
// @grant        none
// ==/UserScript==

var s = document.createElement("style");
s.type = "text/css";
var selector = ".F0XO1GC-nb-P div div div";
s.appendChild(document.createTextNode(selector + " { font-family: monospace; }"));
document.head.appendChild(s);

//document.addEventListener("DOMContentLoaded", function () {
    var postings = document.querySelectorAll(selector);
    [].slice.call(postings).forEach(function (posting) {
        posting.innerHTML = posting.innerHTML.replace(
            /<[^>]*>|\b(\*([^*]+)\*|\/([^\/]+)\/|_([^_]+)_)\b/g,
            function (match, formatted, bold, italic, underline) {
                if (!formatted) return match;
                if (bold) return "*<b>" + bold + "</b>*";
                if (italic) return "/<i>" + italic + "</i>/";
                if (underline) return "_<u>" + underline + "</u>_";
            });
    });
//}, false
