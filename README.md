# IESNA

[![npm version][npm-badge]][npm-link]
[![ci][ci-badge]][ci-link]
[![semantic-release][semantic-release-badge]][semantic-release-link]

TypeScript library for parsing, inspecting, sampling and rendering the IESNA LM-63 Photometric file
format.

This project is heavily based on the original publication "Parsing The IESNA LM-63 Photometric Data
File" and its accompanying source code that is available at
http://lumen.iee.put.poznan.pl/kw/iesna.txt. For reference purposes, a copy of the original
publication is included in this repository under `vendor/iesna-c/`.

## Usage

To render an IES document to an HTML canvas using this library:

```typescript
import * as IESNA from "@lightspeedgraphics/iesna";

IESNA.renderToCanvas({
  iesData: IESNA.parse("IES document goes here"),
  canvas: document.getElementsByTagName("canvas")[0],
});
```

In addition to the `IESNA.renderToCanvas()` method, custom light sampling can be done using the
`IESNA.sample()` function. This function accepts an IES data object and x,y,z coordinate in light
space. and returns the light intensity at that position.

```typescript
const iesData = IESNA.parse("IES document goes here");
const intensity = IESNA.sample({ iesData, x, y, z });
```

## Demo

There is a demo app that shows the rendering of IES documents in the browser. Run it with
`npm install && npm run dev` then go to `http://localhost:5000`.

## License

Licensed under the MIT license. You must read and agree to its terms to use this software.

## Contributors

This library was written by Lightspeed Graphics Ltd. All contributions welcome.

[npm-link]: https://www.npmjs.com/package/@lightspeedgraphics/iesna
[npm-badge]: https://badge.fury.io/js/%40lightspeedgraphics%2Fiesna.svg
[ci-link]: https://github.com/lightspeedgraphics/iesna/actions
[ci-badge]: https://github.com/lightspeedgraphics/iesna/workflows/ci/badge.svg
[semantic-release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-link]: https://github.com/semantic-release/semantic-release
