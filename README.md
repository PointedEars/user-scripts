# Userscripts for Web browsers

| Script | Purpose |
|:-----|:--------|
| [`enableAutocomplete.user.js`](enableAutocomplete.user.js) | Re-enables autocomplete in login forms |
| [`ggFormatter.user.js`](#ggformatteruserjs) | Formats Google Groups messages |
| [`ggSpamFilter.user.js`](ggSpamFilter.user.js) | Configurable spam filter for Google Groups (*until a better Web interface comes along ;-))* |
| [`googleScholar.user.js`](googleScholar.user.js) | Adds Google Scholar to Google Search’s “More” menu |
| [`zattoo.user.js`](zattoo.user.js) | Tweaks to [Zattoo](http://zattoo.com/)’s Web interface (proof-of-concept, now obsoleted by built-in features) |

## Usage

Add them to your favorite userscript manager, for example:

  - [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
    or [Control Freak](https://chrome.google.com/webstore/detail/control-freak/jgnchehlaggacipokckdlbdemfeohdhc/)
    for [Chromium](http://www.chromium.org/Home)/[Google Chrome](https://www.google.com/chrome/)
    (Chromium also [supports userscripts natively by converting them to extensions](http://www.chromium.org/developers/design-documents/user-scripts/)). If you use Tampermonkey, you can select the “Raw” button in GitHub’s source code view to install a userscript.
  - [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) for [Mozilla Firefox](http://getfirefox.com/)
  - [Kango](http://kangoextensions.com/) for [Microsoft Internet Explorer](http://microsoft.com/ie),
    Firefox, Chrome, [Opera](http://www.opera.com/), and [Apple Safari](http://www.apple.com/safari/)
  - [Ninjakit](http://os0x.hatenablog.com/entry/20100612/1276330696) for Chrome and Safari

See ![Wikipedia](https://upload.wikimedia.org/wikipedia/commons/b/b0/Wikipedia-favicon.png) [Greasemonkey](https://en.wikipedia.org/wiki/Greasemonkey) for more.

## Details

### [`ggFormatter.user.js`](ggFormatter.user.js)

Modifies the display of Google Groups postings to

- use `the monospaced font` specified in the Web browser settings (useful for source code and ASCII art);
- use **bold style** to format text enclosed in asterisks (“\*…\*”);
- use *italic style* to format text enclosed in forward slashes (“/…/”), and
- underline text enclosed in underscores (“\_…\_”).

[↑ Usage](#usage)
