/**
 * ggSpamFilter -- Junk filter for Google Groups
 *
 * Copyright (C) 2010, 2016  Thomas Lahn &lt;cljs@PointedEars.de&gt;
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
// @name         ggSpamFilter
// @version      0.2
// @namespace    http://PointedEars.de/scripts/Greasemonkey
// @description  Junk filter for Google Groups
// @include      http*://groups.google.*/*
// @require     ../object.js
// @require     ../regexp.js
// @require     ../dom.js
// @require     ../dom/css.js
// @not_yet_required     ../httprequest.js
// ==/UserScript==

/*
 * Class name to be set on rows for spam threads (spam rows);
 * use in user stylesheet to format spam as you want
 */
var spamClass = "is-spam";

/*
 * Set this to “true” to format spam rows (see stylesheet definition below);
 * no user stylesheet modifications are necessary.
 */
var formatSpam = true;

/*
 * Stylesheet to be applied to a spam row if formatSpam === true;
 * Note that you break GG’s continuous scrolling if you use "display: none"
 */
var spamStyle = "opacity: 0.25";

/* Add the strings you want to be blacklisted below */

/**
 * Words (strings separated by non-word characters) that are indicative of spam
 * (case-insensitive)
 */
var prescriptionDrugsWords = [
  "abilify", "aceon", "ambien",
  "soma",
  "ultram"
];
var aBlacklistWords = [].concat(
  prescriptionDrugsWords,
  "\\$\\d+", /* price in dollars */
  "gifts?",
  "u"
);
var oBlacklistWords = {
  "prescription drugs": prescriptionDrugsWords,
  "price": "\\$\\d+",
  "other": ["gifts?", "u"]
};

/**
 * Infixes (sub-strings) that are indicative of spam (case-insensitive)
 */
var counterfeitInfixes = [
  "armani",
  "calvin\\s*klein",
  "sell", "shoes?(\\s*trade)?",
  "wholesale"
];
var prescriptionDrugsInfixes = [
  "accupril", "accutane", "acyclovir", "actos", "adderall", "adipex",
  "alesse", "amiodarone", "allegra", "alprazolam", "amoxicillin",
  "aricept", "ativan",
  "baclofen", "bactrim", "benzos", "bipasa", "buspar", "butalbital",
  "carisoprodol", "caverta", "celexa", "cialis", "clonazepam", "codeine",
  "dapoxetine", "desyrel", "diazepam", "diflucan", "diovan", "doxycycline",
  "fioricet", "fosamax",
  "geodon", "glucophage",
  "hydrocodone",
  "imitrex",
  "lamisil", "levitra", "lortab",
  "kamagra", "klonopin",
  "meridia", "microzide",
  "neurontin", "norco",
  "oxycodone", "oxycontin", "opiate",
  "percocet", "phentermine", "propecia",
  "ritalin",
  "sildenafil", "singulair",
  "tadalafil", "tramadol",
  "valium", "valtrex", "viagra", "vicodin",
  "xanax", "xenical",
  "zithromax", "zolpidem", "zovirax", "zyprexa"
];
var pr0nInfixes = [
  "girls?",
  "nude",
  "sexy?"
];
var aBlacklistInfixes = [].concat(
  counterfeitInfixes,
  prescriptionDrugsInfixes,
  pr0nInfixes,
  "adsense",
  "fake\\s*id\\s*card", "fake\\s*passports",
  "online\\s*roulette",
  "paypal",
  "terrorism"
);
var oBlacklistInfixes = {
  "counterfeit": counterfeitInfixes,
  "prescription drugs": prescriptionDrugsInfixes,
  "pr0n": pr0nInfixes,
  "other": [
    "adsense",
    "fake\\s*id\\s*card", "fake\\s*passports",
    "online\\s*roulette",
    "paypal",
    "terrorism"
  ]
};

/* DO NOT modify anything below this (unless you know what you are doing) */

var intv = window.setInterval(function () {
  var threadList = document.getElementById("f-ic");
  if (!threadList) return;

  window.clearInterval(intv);

  try
  {
    /* DEBUG */
    //  throw new Error();

    var dom = jsx.dom;

    Array.prototype.toAlternation = function () {
      return this.slice().sort(function (a, b) {
        /* Longest match wins */
        return b.length - a.length;
      }).join("|");
    };

    var
      rxWords = (aBlacklistWords.length > 0)
        ? new RegExp("\\b(?:" + aBlacklistWords.toAlternation() + ")\\b", "i")
        : null,

      rxInfixes = (aBlacklistInfixes.length > 0)
        ? new RegExp("(?:" + aBlacklistInfixes.toAlternation() + ")", "i")
        : null;

    if (rxWords || rxInfixes)
    {
      /**
       * Marks a row as spam
       *
       * @param row
       * @param link
       */
      var markAsSpam = function(row, link) {
        //var spamCell = row.cells[1];

        /* for the Bayesian filter */
        //var link = document.createElement("a");
        //        link.href = "";
        //        link.appendChild(document.createTextNode("Unmark"));
        //
        //        spamCell.appendChild(link);
        //        spamCell.appendChild(document.createTextNode(" "));
        //
        //        link = document.createElement("a");
        //link.href = "";
        //link.addEventListener("click", function(e) {
        /* DEBUG */
        //var request = jsx.HTTPRequest(domEl.href);
        //          request.setAsync(false);
        //          request.setSuccessListener(function(response) {
        //            window.alert(response.responseText);
        //          });
        //          request.send();
        //
        //window.alert("Sorry, reporting spam is not yet implemented.");
        //e.preventDefault();
        //}, false);
        //link.appendChild(document.createTextNode("Report"));
        //spamCell.appendChild(link);

        dom.addClassName(row, spamClass, true);
      };

      /**
       * Marks a row as ham (non-spam)
       *
       * @param row
       */
      var markAsHam = function(row, link) {
        /* for the Bayesian filter */
        //        var link = document.createElement("a");
        //        link.href = "";
        //        link.appendChild(document.createTextNode("Mark"));
        //        row.cells[1].appendChild(link);
      };

      if (formatSpam)
      {
        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.id = "ggSpamFilter-style";
        styleSheet.textContent = "." + spamClass + " { " + spamStyle + "; }";
        (document.head || document.getElementsByTagName("head")[0]).appendChild(styleSheet);
      }

      var
        table = threadList.querySelector(".IVILX2C-p-V"),
        rows = table.rows,
        prevSpamCount = 0;

      //window.clearInterval(intv);
      /*intv =*/ window.setInterval(function () {
        var spamCount = 0;

        [].forEach.call(rows, function (row) {
          var
            link = row.querySelector("a"),
            subject = link.textContent,
            mWord = subject.match(rxWords),
            mInfix = subject.match(rxInfixes),
            m = mWord || mInfix;

          if (m)
          {
            if (!dom.hasClassName(row, spamClass))
            {
              markAsSpam(row, link);

              jsx.dmsg('ggSpamFilter:'
                + ' Filtered "' + subject + '"\nbecause it contains'
                + (mWord ? ' the word' : '') + ' "' + m[0] + '".', 'info');
            }

            spamCount++;
          }
        });

        if (spamCount !== prevSpamCount)
        {
          var rowCount = rows.length;
          jsx.dmsg('ggSpamFilter: Filtered ' + spamCount + ' out of ' + rowCount
                   + ' ' + (rowCount > 1 ? 'posting' : 'postings')
                   + " (" + ((spamCount / rowCount) * 100).toFixed(1) + "\xA0%).", 'info');
        }

        prevSpamCount = spamCount;
      }, 500);
    }
  }
  catch (e)
  {
    var
      sError = "Unhandled exception in ggSpamFilter Greasemonkey script:"
        + "\n" + e.message + " [" + e.name + "]"
        + "\nFile: " + e.filename
        + "\nLine: " + e.lineNumber
        + "\nStack trace:\n  " + e.stack,
       sMessage = "\n\nPlease confirm to report this bug via e-mail.";

    if (window.confirm(sError + sMessage))
    {
      var
        sTo = "cljs@PointedEars.de",
        sSubject = "ggSpamFilter Error Report",
        sBody = "Hello PointedEars,\n\nI got the following error message:\n\n"
              + sError
              + "\n\nPlease look into it ASAP.\n\nRegards";

      try
      {
        /* DEBUG */
        //      throw new Error();

        window.location = "mailto:" + encodeURIComponent(sTo)
          + "?subject=" + encodeURIComponent(sSubject)
          + "&body=" + encodeURIComponent(sBody.replace(/\n/g, "\r\n"));
      }
      catch (e2)
      {
        window.alert("Sorry, cannot send e-mail.  Please report this bug in comp.lang.javascript instead.");
        //      var popup = window.open("about:blank");
        //      var doc = popup.document;
        //      doc.open("text/html");
        //      doc.write([
        //        '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"',
        //        '  "http://www.w3.org/TR/html4/strict.dtd">',
        //        '<html>',
        //        '  <head>',
        //        '    <title>ggSpamFilter Error Report</title>',
        //        '  </head>',
        //        '  <body>',
        //        '    <p>You do not seem to have an e-mail client configured.',
        //        '       Please report this bug in',
        //        '       <a href="news:comp.lang.javascript">comp.lang.javascript</a>',
        //        '       or to &lt;' + sTo + '&gt;:</p>',
        //        '    <pre>' + sError.replace(/\n/g, "\r\n") + '</pre>',
        //        '  </body>',
        //        '</html>',
        //      ].join("\r\n"));
        //      doc.close();
      }
    }

    jsx.dmsg(e, "error");
  }
}, 500);
