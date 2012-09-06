/**
 * ggSpamFilter -- Junk filter for Google Groups
 * 
 * Copyright (C) 2010  Thomas Lahn &lt;cljs@PointedEars.de&gt;
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
// @namespace    http://PointedEars.de/scripts/Greasemonkey
// @description  Junk filter for Google Groups
// @include      http://groups.google.*/*
// @require     ../object.js
// @require     ../dom.js
// @require     ../dom/xpath.js
// @require     ../httprequest.js
// ==/UserScript==

try
{
  /* DEBUG */
//  throw new Error();
  
  /* Add the strings you want to be blacklisted below */
  /**
   * Words (strings separated by non-word characters) that are indicative of spam
   */
  var aBlacklistWords = [
    "\\$\\d+",
    "abilify", "aceon", "ambien",
    "gifts?",
    "soma",
    "u", "ultram"
  ];
    
  /**
   * Infixes (sub-strings) that are indicative of spam
   */
  var aBlacklistInfixes = [
    "accupril", "accutane", "acyclovir", "actos",
      "adsense", "adderall", "adipex", "alesse", "amiodarone",
      "allegra", "alprazolam", "amoxicillin", "armani",
    "bactrim", "bipasa", "buspar", "butalbital",
    "carisoprodol", "calvin\\s*klein", "caverta", "celexa", "cialis",
      "codeine",
    "desyrel", "diazepam", "diflucan", "diovan",
    "fake\\s*id\\s*card", "fake\\s*passports", "fioricet", "fosamax",
    "geodon", "girls?",
    "hydrocodone",
    "imitrex",
    "lamisil", "levitra", "lortab",
    "kamagra", "klonopin",
    "meridia", "microzide",
    "norco", "nude",
    "online\\s*roulette", "oxycodone", "oxycontin",
    "paypal", "percocet", "phentermine", "propecia",
    "ritalin",
    "sell", "sexy?", "shoes?(\\s*trade)?", "sildenafil", "singulair",
    "tadalafil", "terrorism", "tramadol",
    "valium", "valtrex", "viagra", "vicodin",
    "wholesale",
    "xanax", "xenical",
    "zithromax", "zolpidem", "zovirax", "zyprexa"
  ];
    
  /* Don't modify anything below this */
  var
    rxWords = (aBlacklistWords.length > 0)
      ? new RegExp("\\b(?:" + aBlacklistWords.join('|') + ")\\b", "i")
      : null,
  
    rxInfixes = (aBlacklistInfixes.length > 0)
      ? new RegExp("(?:" + aBlacklistInfixes.join('|') + ")", "i")
      : null;
  
  if (rxWords || rxInfixes)
  {
    var
      aRes = jsx.dom.xpath.evaluate(
        './/div[@class="maincontoutboxatt"]//a[@href and not(@class="st")]',
        document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE),
      count = 0;
    
    if (aRes.length > 0)
    {
      var prepareTable = function(table) {
        var cell = table.rows[0].insertCell(1);
        var bold = document.createElement("b");
        bold.appendChild(document.createTextNode("Spam?"));
        cell.appendChild(bold);
        
        cell = table.rows[1].insertCell(1);
      };
      
      /**
       * Inserts a cell for a "report as spam" link
       * 
       * @param row
       */
      var prepareRow = function(row) {
        var cell = row.insertCell(1);
        return cell;
      };
        
      /**
       * Marks a row as spam
       * 
       * @param row
       */
      var markAsSpam = function(row, domEl) {
        var spamCell = row.cells[1];

        /* for the Bayesian filter */
        var link = document.createElement("a");
//        link.href = "";
//        link.appendChild(document.createTextNode("Unmark"));
//
//        spamCell.appendChild(link);
//        spamCell.appendChild(document.createTextNode(" "));
//
//        link = document.createElement("a");
        link.href = "";
        link.addEventListener("click", function(e) {
          /* DEBUG */
          var request = jsx.HTTPRequest(domEl.href);
//          request.setAsync(false);
//          request.setSuccessListener(function(response) {
//            window.alert(response.responseText);
//          });
//          request.send();
//
          window.alert("Sorry, reporting spam is not yet implemented.");
          e.preventDefault();
        }, false);
        link.appendChild(document.createTextNode("Report"));
        spamCell.appendChild(link);
        domEl.style.opacity = "0.5";
      };
     
      /**
       * Marks a row as ham (non-spam)
       * 
       * @param row
       */
      var markAsHam = function(row, domEl) {
        /* for the Bayesian filter */
//        var link = document.createElement("a");
//        link.href = "";
//        link.appendChild(document.createTextNode("Mark"));
//        row.cells[1].appendChild(link);
      };

      prepareTable(aRes[0].parentNode.parentNode.parentNode);
     
      for (var len = i = aRes && aRes.length; i--;)
      {
        var
          domEl = aRes[i],
          
          /* Link is nested in a table-cell which is nested in a table-row */
          row = domEl.parentNode.parentNode;
          
          subject = domEl.textContent,
          mWord = subject.match(rxWords),
          mInfix = subject.match(rxInfixes),
          m = mWord || mInfix;
          
        prepareRow(row);
          
        if (m)
        {
          markAsSpam(row, domEl);
          
          jsx.dmsg('ggSpamFilter:'
            + ' Filtered "' + subject + '"\nbecause it contains'
            + (mWord ? ' the word' : '') + ' "' + m[0] + '"', 'info');
            
          count++;
        }
        else
        {
          markAsHam(row, domEl);
        }
      }
    
      jsx.dmsg('google-groups: Filtered ' + count + ' out of ' + len
        + ' posting(s).', 'info');
    }
  }
}
catch (e)
{
  var sError = "Unhandled exception in ggSpamFilter Greasemonkey script:"
    + "\n" + e.message + " [" + e.name + "]"
    + "\nFile: " + e.filename
    + "\nLine: " + e.lineNumber
    + "\nStack trace:\n  " + e.stack;
  var sMessage = "\n\nPlease confirm to report this bug via e-mail.";

  if (window.confirm(sError + sMessage))
  {
    var sTo = "cljs@PointedEars.de";
    var sSubject = "ggSpamFilter Error Report";
    var sBody =
      "Hello PointedEars,\n\nI got the following error message:\n\n"
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
