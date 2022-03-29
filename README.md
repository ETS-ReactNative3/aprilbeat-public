<h1 align="center">Aprilbeat!</h1>

<h2 align="center">open-source web-based online rhythm game</h2>

<p align="center">
  <a href="https://twitter.com/boneapriltea"><img src="https://img.shields.io/badge/twitter-@boneapriltea-blue.svg" alt="Twitter" /></a>
  <br>
  <a href="https://aprilbeatdocs.vercel.app"><img src="https://img.shields.io/badge/read%20the-docs-brightgreen.svg?style=flat" alt="Docs"></a>
  <a href="https://www.codefactor.io/repository/github/boneapriltea/aprilbeat-public"><img src="https://www.codefactor.io/repository/github/boneapriltea/aprilbeat-public/badge" alt="Codefactor"></a>
</p>

**Aprilbeat** is an new open-source, online, fully web-based rhythm game. It plays songs in
APB format (See:
[Introduction to APB](https://boneaprilteadocs.vercel.app/apb)).

It is recommended to play this game on Google Chrome.

**Table of contents:**

<!-- toc -->

- [Video Demo](#video-demo)
- [Quick Tour](#quick-tour)
- [Technology](#technology)
- [Running Aprilbeat Locally](#running-aprilbeat-locally)
- [License](#license)

<!-- tocstop -->

## Status

This project is under development, but is in a quite stable state. Users are encouraged to try it out.

We are accepting bug reports (please report with as much detail as possible and follow the existing issue templates). Feature requests are also welcome, but understand that our focus is on completing the game to feature parity before adding new features. A few resources are available as starting points to getting involved and understanding the project:

- Detailed release changelogs are available on the [official aprilbeat site](https://aprilbeat.vercel.app/home/changelog/lazer).
- Read lav's [twitter posts](https://twitter.com/lavablelavs) to explore where the project is currently and the roadmap going forward.

## Quick Tour

![Music selection](public/assets/music-selection.png)

- Play **online songs** instantly in your browser.

- You can also play **custom songs** by dragging the APB File into
  the upload custom APB screen. There is also a community-supported beatmaps, you can find them using
  [APB Search](http://apbsearch.vercel.app). We are working on implementing this directly on to the website with the feature told called april!direct

- There’s an **online internet ranking** system. You can compete with other
  players and see your rank online. We are also working on implementing a full real-time multiplayer using bi-directional socket.

- **Keyboard mode** (3-to-6 keys). Play along the music with your keyboard.

- Play together with friends in real-time using
  **party mode.** (beta)

- **Multiple difficulties.** Each song has multiple difficulties to accommodate
  every player skill levels.

- **Adjustable speed.** You can adjust the speed (spacing) of the notes to make
  it easy-to-sightread. This does not affect the speed of the song; lowering the
  speed causes notes to become more dense on-screen.

- [**Scoring and grading system.**](https://aprilbeatdocs.vercel.app/scoring-and-judgment)
  Master the song to get the S+ grade (score over 1000000 or "1 Million with 6 zeros").

- **Background Video support.** Certain selected songs will have a background video playing while playing.

- **Early/Late indicator.** Aprilbeat will tell you if you press the note too early
  or too late.

- **Audio latency compensation.** Some systems may have audio latency. Aprilbeat
  contains a comprehensive and smart calibration system to compensate for the audio latency.

**Play now at https://aprilbeat.vercel.app/.**

## Technology

- The web application is powered by **[React](https://facebook.github.io/react/)
  and [NextJS](https://nextjs.org/).**

- The native animations is powered by **[Framer Motion](https://www.framer.com/motion/).**

## Running Aprilbeat Locally

```
# Clone Aprilbeat
git clone https://github.com/boneapriltea/aprilbeat.git

# Enter the main repository
cd aprilbeat

# Install the dependencies
npm i

# Start development server
npm run dev
```

Note: Online ranking features are not available when developing locally.

## License

Copyright (c) 2022 Bone April Tea

_aprilbeat_'s code and frameworks are licensed under the [MIT licence](https://opensource.org/licenses/MIT). Please see [the licence file](LICENCE) for more information. Check the [tl;dr](https://tldrlegal.com/license/mit-license) here.

Please note that this _does not cover_ the usage of the "aprilbeat" or "lav" branding in any software, resources, advertising or promotion, as this is protected by trademark law.
