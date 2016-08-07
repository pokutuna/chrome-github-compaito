chrome-github-compaito
===

[![Build Status](https://travis-ci.org/pokutuna/chrome-github-compaito.svg?branch=master)](https://travis-ci.org/pokutuna/chrome-github-compaito)

__compaito__ is a chrome extension to jump to [Compare View](https://github.com/blog/612-introducing-github-compare-view) by picking 2 commits.

Install
---

visit [Chrome Web Store - compaito](https://chrome.google.com/webstore/detail/compaito/bibcmambgkheppahlcghnocnjdbnjlgl)

[![icon](https://raw.githubusercontent.com/pokutuna/chrome-github-compaito/master/src/img/compaito_clipped.png)](https://chrome.google.com/webstore/detail/compaito/bibcmambgkheppahlcghnocnjdbnjlgl)

Demo
---

![demo](https://raw.githubusercontent.com/pokutuna/chrome-github-compaito/master/misc/example.gif)


Usage
---

- __pick commits and jump__ (hover and click the picker)

![pick and jump demo](https://raw.githubusercontent.com/pokutuna/chrome-github-compaito/master/misc/pick_and_jump.gif)


- __pick a previous commit__ (click `~`)

![pick previous commit demo](https://raw.githubusercontent.com/pokutuna/chrome-github-compaito/master/misc/previous_commit.gif)


- __cancel picking__ (click `x`)

![cancel demo](https://raw.githubusercontent.com/pokutuna/chrome-github-compaito/master/misc/cancel.gif)


- __set hostnames to enable picker__ (adaptable to GitHub Enterprise)

![set hostname demo](https://raw.githubusercontent.com/pokutuna/chrome-github-compaito/master/misc/set_hostname.gif)


Changelog
---
- 0.1.0 (2016-08-07)
  - Open a compare view in pull request review mode if it is available. (see [More code review tools](https://github.com/blog/2123-more-code-review-tools).) It's able to add a line comment in compare view.
- 0.0.3 (2016-06-23)
  - Fix commit url patterns.
