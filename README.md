#Busta Meme
An HTML5 slider puzzle game that uses the MyBeanJar rewardware service

##Overview

Busta Meme is an HTML5 slider puzzle game designed to take advantage of the [MyBeanJar](http://mybeanjar.com) rewardware service. It is built atop a modified version of [jqPuzzle](https://github.com/2m3/jqPuzzle), featuring a custom solver/hint system heavily inspiried by the A* heuristic algorithm used by [8 Tile Puzzle](https://github.com/smoran02/8-tile-puzzle).

Features include:
- Custom UI for sign-in and registration with MyBeanJar
- Bean award mechanism for puzzle completion and registration


##Dependencies

This project relies upon the MyBeanJar HTML5/JS SDK as well as the jQuery (2) and FastClick libraries. The MyBeanJar SDK and FastClick are included as submodules while jQuery is provided as a Google Hosted library. Modified portions of Jssor Slider and Spin.js as well as the aforementioned jqPuzzle and 8 Tile Puzzle are also used.


##Known Issues

- The UI elements accompanying this game are intended to provide a consistent experience across a wide range of devices. While the hybrid adaptive/response layout provides reasonable coverage, some display issues are known to occur on low-res devices with aspect ratios close to 1:1.

- Since the inclusion of e-mail verification for new accounts, users no longer receive a Bean upon successful registration. The request is still made immediately following registration, but the server does not provide a particularly friendly response to the request. Consequently, users may receive a request error notification following the registration process.
