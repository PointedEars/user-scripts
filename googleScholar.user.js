// ==UserScript==
// @name         Add Google Scholar
// @namespace    http://PointedEars.de/
// @version      0.3
// @description  Adds an entry for Google Scholar in the “More” menu of Google
// @author       Thomas 'PointedEars' Lahn <PointedEars@web.de>
// @match        http*://*.google.ch/*
// @match        http*://*.google.de/*
// @match        http*://*.google.com/*
// @grant        none
// ==/UserScript==

var intv = window.setInterval(function () {
  /* FIXME: Poll continuously and only update the link if it is there */
  var menu = document.getElementById("hdtb-more-mn");
  if (!menu) return;

  window.clearInterval(intv);

  var item = document.createElement("div");
  item.className = "hdtb-mitem";

  var link = document.createElement("a");
  link.className = "q qs";
  var m;
  link.href = "#";
  link.onclick = function () {
    var search = document.location.search;
    var hash = document.location.hash;
    window.location = document.location.protocol + '//scholar.google.com/scholar' + search
      + (search !== "?" ? "&" : "") + "q=" + (hash.match(/[#&]q=([^&]+)/) || ["", ""])[1]
      + hash;
    return false;
  };
  link.appendChild(document.createTextNode("Scholar"));
  item.appendChild(link);

  menu.appendChild(item);
}, 500
