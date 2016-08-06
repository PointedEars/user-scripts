/**
 * enableAutocomplete -- Re-enable autocomplete for admin login forms
 *
 * Copyright (C) 2013  Thomas Lahn &lt;cljs@PointedEars.de&gt;
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
// @name         enableAutocomplete
// @namespace    http://PointedEars.de/scripts/Greasemonkey
// @version      0.1
// @description  Re-enable autocomplete for admin login forms
// @include      *admin*
// ==/UserScript==

try
{
  var forms = document.forms;

  for (var i = forms.length; i--;)
  {
    var form = forms[i];

    if (form.autocomplete == "off")
    {
      form.autocomplete = "on";
    }

    for (var els = form.elements, j = els.length; j--;)
    {
      var el = els[j];

      if (el.autocomplete == "off")
      {
        el.autocomplete = "on";
      }
      else if (typeof el.type == "undefined")
      {
        var list = el;

        for (var k = list.length; k--;)
        {
          el = list[k];

          if (el.autocomplete == "off")
          {
            el.autocomplete == "on";
          }
        }
      }
    }
  }
}
catch (e)
{
  if (typeof console != "undefined" && typeof console.log == "function")
  {
    console.log(e);
  }
}
