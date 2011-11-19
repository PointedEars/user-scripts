/**
 * Zattoo++ -- UI enhancements for Zattoo Web TV
 * 
 * Copyright (C) 2011 Thomas Lahn &lt;js@PointedEars.de&gt;
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// ==UserScript==
// @name Zattoo++
// @version 0.5.9.8
// @namespace http://PointedEars.de/scripts/Greasemonkey
// @description UI enhancements for Zattoo Web TV
// @include http://zattoo.com/view*
// ==/UserScript==

/* Check if there is a playlist to be improved */
var playlist = document.getElementById("playlist");
if (playlist)
{
  var zattoo_localizer = {
    languages: {},
    language: '',
    current: null,
    gettext: function(s) {
      if (this.current && s in this.current)
      {
        return this.current[s];
      }
      
      return s;
    },
    
    install: function(language) {
      if (language in this.languages)
      {
        this.language = language;
        this.current = this.languages[language];
      }
      else
      {
        this.language = '';
        this.current = null;
      }
    }
  };
  
  zattoo_localizer.languages = {
    "de": {
      "playlistFilter": "Aufnahmen einschränken",
      "matches": "passende Aufnahmen"
    },
    "en": {
      "playlistFilter": "filter",
    },
    "fr": {
      "playlistFilter": "filtre",
    },
    "fr": {
      "playlistFilter": "filtro",
    },
  };

  /* Try hard to determine the user's preferred language */
  var language = ((typeof navigator == "object" && navigator
                    && navigator.browserLanguage || navigator.language
                    || {match: function() { /* */ }})
                  .match(/^[^-,]+/) || [])[0] || "en";
  var head = document.getElementsByTagName("head")[0];
  if (head && head.innerHTML)
  {
    var m = (head.innerHTML.match(
      /\bplayercontroller\s*\.\s*init\s*\([^\)]+,\s*"([^"]+)"\s*,[^,\)]+\)/
    ) || [, ])[1];
  
    if (m)
    {
      language = m;
    }
  }
  zattoo_localizer.install(language);
  
  var _ = function(s) {
    return zattoo_localizer.gettext(s);
  };
  
  if (typeof Array.filter != "function")
  {
    Array.filter = (function() {
      var
        defaultArray = [],
        filter = defaultArray.filter;
      
      if (typeof filter != "function")
      {
        /* No built-in filter method, need to emulate */
        filter = function(callbackfn, thisArg) {
          "use strict";
          
          /*
           * If a thisArg parameter is provided, it will be used as the
           * this value for each invocation of callbackfn. If it is not
           * provided, undefined is used instead.
           */
  
          /*
           * 1. Let O be the result of calling ToObject passing the this value
           *    as the argument.
           */
          var o = Object(thisArg);
          
          /*
           * 2. Let lenValue be the result of calling the [[Get]] internal method
           *    of O with the argument "length".
           */
          var lenValue = o.length;
  
          /*
           * 3. Let len be ToUint32(lenValue).
           */
          var len = lenValue >>> 0;
  
          /*
           * 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
           */
          if (typeof callbackfn != "function")
          {
            throw new TypeError();
          }
          
          /*
           * 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
           */
          var t = thisArg;
          
          /*
           * 6. Let A be a new array created as if by the expression new Array()
           * where Array is the standard built-in constructor with that name.
           */
          var a = [];
          
          /* 7. Let k be 0. */
          var k = 0;
          
          /* 8. Let to be 0. */
          var to = 0;
          
          /* Repeat, while k < len */
          while (k < len)
          {
            /* a. Let Pk be ToString(k). */
            var pk = String(k);
            
            /*
             * b. Let kPresent be the result of calling the [[HasProperty]]
             *    internal method of O with argument Pk.
             */
            var kPresent = pk in o;
            
            /* c. If kPresent is true, then */
            if (kPresent)
            {
              /*
               * i. Let kValue be the result of calling the [[Get]] internal method
               *    of O with argument Pk.
               */
              var kValue = o[pk];
              
              /*
               * ii. Let selected be the result of calling the [[Call]]
               *     internal method of callbackfn with T as the this value
               *     and argument list containing kValue, k, and O.
               */
              var selected = callbackfn.call(t, kValue, k, o);
              
              /* iii. If ToBoolean(selected) is true, then */
              if (!!selected == true)
              {
                /*
                 * 1. Call the [[DefineOwnProperty]] internal method of A
                 *    with arguments ToString(to), Property Descriptor
                 *    {[[Value]]: kValue, [[Writable]]: true, [[Enumerable]]: true,
                 *    [[Configurable]]: true}, and false.
                 */
                try
                {
                  if (typeof Object.defineProperty == "function")
                  {
                    Object.defineProperty(a, to,
                      {
                        value: kValue,
                        writable: true,
                        enumerable: true,
                        configurable: true
                      },
                      false);
                  }
                  else
                  {
                    a[to] = kValue;
                  }
                }
                catch (e)
                {
                  if (e.constructor != TypeError)
                  {
                    throw e;
                  }
                }
                
                /* 2. Increase to by 1. */
                ++to;
              }
            }
            
            /* d. Increase k by 1. */
            ++k;
          }
          
          /* 10. Return A. */
          return a;
        };
      }
      
      return function(thisObj, f) {
        return filter.call(thisObj, f);
      };
    }());
  }
  
  var isMethod = function(obj, property) {
    var t = typeof obj[property];
    return /\bunknown\b/i.test(t) || /\b(function|object)\b/i.test(t) && obj[property];
  };
  
  var gEBCN = function(el, className) {
    if (isMethod(el, "getElementsByClassName"))
    {
      return el.getElementsByClassName(className);
    }
    
    var els = [].slice.call(el.getElementsByTagName("*"), 0);
    return Array.filter(els, function(el) {
      var rx = new RegExp("(^|\\s)" + className + "(\\s|$)");
      return rx.test(el.className);
    });
  };

  var channelsHeader = document.getElementById("channels-header");
  var playlistHeader = channelsHeader.cloneNode(true);
  playlistHeader.id = "playlist-header";
  
  var channels = document.getElementById("channels");
  var channelsScrollWrap = gEBCN(channels, "scrollwrap")[0];
  var channelsScrollWrapStyle = document.defaultView.getComputedStyle(channelsScrollWrap, null);
    
  var simpleSelector = "#channels-header(\\s|$)";
  var rxSelector = new RegExp(simpleSelector, "g");
  
  var channelsHeaderRules = Array.filter(
    document.styleSheets[0].cssRules,
    function(rule) {
      return rxSelector.test(rule.selectorText);
    }
  );
  
  /* Apply #channels-header rules to #playlist-header */
  for ( var i = channelsHeaderRules && channelsHeaderRules.length; i--;)
  {
    var rule = channelsHeaderRules[i];
    rule.selectorText += ", " + rule.selectorText.replace(rxSelector, "#playlist-header$1");
  }
  
  /* Modify #playlist scrollwrap rule */
  var playlistRules = Array.filter(
    document.styleSheets[0].cssRules,
    function(rule) {
      return rule.selectorText == "#playlist .scrollwrap";
    }
  );
  
  if (playlistRules && playlistRules.length > 0)
  {
    playlistRules[0].style.top = channelsScrollWrapStyle.top;
  }
  
  /* Insert clone before playlist scrollwrap */
  var scrollWraps = gEBCN(playlist, "scrollwrap");
  if (scrollWraps && scrollWraps.length)
  {
    var scrollWrap = scrollWraps[0];
    scrollWrap.parentNode.insertBefore(playlistHeader, scrollWrap);
  }
  
  /* Playlist filter setup */
  
  var showAllItems = function() {
    var items = gEBCN(playlist, "play");
    for (var i = items && items.length; i--;)
    {
      items[i].parentNode.style.display = "";
    }
  };
  
  var setupPlaylistFilter = function() {
    var searchField = playlistHeader.getElementsByTagName("input")[0];
    var defaultSearchTerm = _("playlistFilter");
    var playlistForm = playlistHeader.getElementsByTagName("form")[0];
    
    playlistForm.onsubmit = function(e) {
      if (typeof e == "undefined")
      {
        e = window && window.event;
      }
      
      if (e)
      {
        if (isMethod(e, "preventDefault"))
        {
          e.preventDefault();
        }
        
        e.returnValue = false;
      }
      
      return false;
    };
    
    var hideDefaultText = function() {
      if (searchField.className === "default-text")
      {
        searchField.className = "";
        searchField.value = "";
      }
    };
    
    var showDefaultText = function(force) {
      var value = searchField.value;
      if (force || value === "" || value === defaultSearchTerm)
      {
        searchField.className = "default-text";
        searchField.value = defaultSearchTerm;
        showAllItems();
      }
    };
    
    showDefaultText(true);
    
    var filterByExpression = function(el, rx) {
      var title = gEBCN(el, "title")[0].textContent.toLowerCase();
      var episode = gEBCN(el, "episode");
      if (episode && episode.length > 0)
      {
        episode = episode[0].textContent;
      }
      else
      {
        episode = "";
      }
      
      var parent = el.parentNode;
      
      if (rx && (rx.test(title) || rx.test(episode)))
      {
        parent.style.display = "";
        return true;
      }

      parent.style.display = "none";
      return false;
    };

    var regexp_escape = function (s) {
      return s.replace(/[\]\\^$*+?.(){}[]/g, "\\$&");
    };
    
    var header = null,
        origHeader = "",
        origHeight = "";
        
    var filterTableByExpression = function(expression) {
      var items = gEBCN(playlist, "play");
      var len = items && items.length || 0;
      var matches = 0;
      
      if (expression)
      {
        /* If not empty, filter by expression */
        
        /* Fallback if SyntaxError is undefined */
        var SyntaxError;
        
        var rx = null;
        try
        {
          rx = new RegExp(expression, "i");
        }
        catch (e)
        {
          if (e.constructor == SyntaxError || e.name === "SyntaxError")
          {
            rx = new RegExp(regexp_escape(expression), "i");
          }
        }
        
        for (var i = len; i--;)
        {
          if (filterByExpression(items[i], rx))
          {
            ++matches;
          }
        }
      }
      else
      {
        /* if empty */
        showAllItems();
        matches = len;
      }
      
      /* Zattoo sometimes rebuilds the scroll wrapper, we so can't cache this */
      header = gEBCN(scrollWrap, "playlistheader")[0];

      if (!origHeader)
      {
        origHeader = header.textContent;
      }

//      header.style.zIndex = "2";
//      header.style.opacity = "0.9";
//
//      if (!origHeight)
//      {
//        origHeight = document.defaultView.getComputedStyle(header, null).height;
//      }
//
//      header.style.position = "fixed";
//      header.style.left = "5px";
//      header.style.width = (parseFloat(document.defaultView.getComputedStyle(
//        gEBCN(scrollWrap, "scrollable")[0], null).width) - 34) + "px";
//
//      playlist.getElementsByTagName("li")[1].style.marginTop = origHeight;

      header.textContent = origHeader + " (" + matches + "/" + len + ")";

      /*
       * Try to resize the playlist using Zattoo's jQuery;
       * does not work in Chromium yet
       */
      if (typeof read_content_global == "function")
      {
        read_content_global('$', function(name, value) {
          value("#playlist ul").trigger("resize");
//      lazyloadContainer.loadVisibleImages();
        });
      }
      else if (typeof unsafeWindow != "undefined"
                && typeof unsafeWindow.$ == "function")
      {
        unsafeWindow.$("#playlist ul").trigger("resize");
//      unsafeWindow.lazyloadContainer.loadVisibleImages();
      }
    };
    
    /**
     * Creates a container for code that can be run later
     * 
     * @param f : Function
     *   Code to be run later.  The default is <code>null</code>.
     * @param delay : int
     *   Milliseconds after which the code will be run by default.
     * @constructor
     */
    function Timeout(f, delay)
    {
      this.running = false;
      this.code = f || null;
      this.delay = parseInt(delay, 10) || 50;
    }
    
    /**
     * Runs the associated code after <var>delay</var> milliseconds;
     * cancels any planned but not yet performed executions.
     * 
     * @param f : Function
     *   Code to be run later.  The default is the value of the
     *   <code>code</code> property as initialized upon construction.
     *   This argument's value will modify that property if the type
     *   is correct.
     * @param delay : int
     *   Milliseconds after which the code will be run by default.
     *   The default is the value of the <code>delay</code> property
     *   as initialized upon construction.
     *   This argument's value will modify that property if the type
     *   is correct.
     * @see #Timeout()
     */
    Timeout.prototype.run = function(f, delay) {
      this.unset();
      
      if (typeof f == "function")
      {
        this.code = f;
      }
      
      if (delay)
      {
        this.delay = parseInt(delay, 10);
      }
      
      this.running = true;
      var me = this;
      this.data = window.setTimeout(function() {
        me.code();
        me.unset();
        me = null;
      }, this.delay);
    };
    
    /**
     * Cancels the execution of the associated code
     */
    Timeout.prototype.unset = function() {
      if (this.running)
      {
        window.clearTimeout(this.data);
        this.running = false;
      }
    };
    
    /**
     * Provides a container for {@link #Timeout}s.
     * 
     * @param timeouts : Array[Timeout]
     *   The list of {@link #Timeout}s to be considered
     * @constructor
     */
    function TimeoutList(timeouts)
    {
      this.timeouts = timeouts || [];
    }
    
    /**
     * Unsets all {@link #Timeout}s in this container
     */
    TimeoutList.prototype.unsetAll = function() {
      for (var i = 0, timeouts = this.timeouts, len = timeouts.length; i < len; ++i)
      {
        timeouts[i].unset();
      }
    };
    
    var me;
    
    var focusTimeout = new Timeout();
    searchField.addEventListener("focus", function() {
      hideDefaultText();
      
      me = this;
      focusTimeout.run(function() {
        filterTableByExpression(me.value);
      });
    }, false);

    var keyupTimeout = new Timeout();
    searchField.addEventListener("keyup", function() {
      me = this;
      keyupTimeout.run(function() {
        filterTableByExpression(me.value);
      });
    }, false);

    var timeouts = new TimeoutList([focusTimeout, keyupTimeout]);
    
    document.addEventListener("unload", function() {
      me = null;
      timeouts.unsetAll();
      timeouts = null;
    }, false);

    searchField.addEventListener("blur", function() {
      showDefaultText();
    }, false);
  };
  
  setupPlaylistFilter();
}
