<div align="center">
  <img src="https://emoji2svg.deno.dev/api/💡" height="160px">
  <h1>IESNA</h1>
  <p>
    <strong>
      TypeScript library for parsing and rendering the
      <br/>
      IESNA LM-63 Photometric file format
    </strong>
    <br />
  </p>

  [<img src="https://img.shields.io/github/v/release/richard-viney/iesna">](https://github.com/richard-viney/iesna/releases/latest)
  [<img src="https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release">](https://github.com/semantic-release/semantic-release)
  [<img src="https://github.com/richard-viney/iesna/actions/workflows/test.yml/badge.svg">](https://github.com/richard-viney/iesna/actions/workflows/test.yml)
  [<img src="https://img.shields.io/badge/License-MIT-blue.svg">](https://opensource.org/license/mit)
</div>

## About

This project is heavily based on the original publication "Parsing The IESNA
LM-63 Photometric Data File" and its accompanying source code, which can be
found [here](./vendor/iesna-c).

## Usage

To render an IES document to an HTML canvas using this library:

```ts
import * as IESNA from "iesna";

IESNA.renderToCanvas({
  iesData: IESNA.parse("IES document goes here"),
  canvas: document.getElementsByTagName("canvas")[0],
});
```

In addition to `IESNA.renderToCanvas()`, light sampling can be done using
`IESNA.sample()`. This function takes an IES data object and an x,y,z coordinate
in light space and returns the light intensity at that position.

```ts
const iesData = IESNA.parse("IES document goes here");
const intensity = IESNA.sample({ iesData, x, y, z });
```

## Demo

There is a demo of rendering IES documents in the browser available
[here](https://richard-viney.github.io/iesna).

To run it locally: `npm install && npm run dev`.
