import { IesData } from "./ies-data";

function removeLeadingBlankLines(lines: string[]): void {
  while (lines.length > 0 && lines[0].trim() === "") {
    lines.shift();
  }
}

function readDocumentVersion(lines: string[]): string {
  const version = lines.shift()?.trim();

  if (version === undefined) {
    throw Error("iesna: failed reading document version");
  }

  return version;
}

function readDocumentHeaders(lines: string[]): { [name: string]: string } {
  const headers: { [key: string]: string } = {};

  while (lines.length > 0) {
    const result = /^\[(.*)\](.*)$/g.exec(lines[0]);
    if (result === null) {
      break;
    }

    lines.shift();

    const header = result[1].trim();
    const value = result[2].trim();

    headers[header] = value;
  }

  return headers;
}

function readDocumentTilt(lines: string[]): string {
  const result = /TILT\s*=\s*(.*)/.exec(lines[0]);

  if (result === null) {
    throw Error("iesna: missing TILT value");
  }

  lines.shift();

  return result[1].trim();
}

function readDocumentCandelaValues(lines: string[]): number[] {
  const buffer = [];

  while (true) {
    const line = lines.shift();
    if (line === undefined) {
      break;
    }

    const elements = line
      .replace(/(\t|,)/g, " ")
      .split(" ")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    for (const element of elements) {
      const value = Number(element);
      if (isNaN(value)) {
        throw Error(`iesna: non-numeric candela value "${element}"`);
      }

      buffer.push(value);
    }
  }

  return buffer;
}

interface IesDocument {
  version: string;
  headers: { [name: string]: string };
  tilt: string;
  values: number[];
}

function readDocument(source: string): IesDocument {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  removeLeadingBlankLines(lines);

  const version = readDocumentVersion(lines);
  const headers = readDocumentHeaders(lines);
  const tilt = readDocumentTilt(lines);
  const values = readDocumentCandelaValues(lines);

  return { version, headers, tilt, values };
}

function parseIesData(document: IesDocument): IesData {
  function getNextValue(): number {
    const value = document.values.shift();

    if (value === undefined) {
      throw Error("iesna: parsing document found too few values");
    }

    return value;
  }

  const lamp = {
    lampCount: getNextValue(),
    lumensPerLamp: getNextValue(),
    multiplier: getNextValue(),
  };

  const verticalAngleCount = getNextValue();
  const horizontalAngleCount = getNextValue();

  const photometricData = {
    goniometerType: getNextValue(),
    verticalAngles: [],
    horizontalAngles: [],
    candela: [],
  };

  const units = getNextValue();

  const dim = {
    width: getNextValue(),
    length: getNextValue(),
    height: getNextValue(),
  };

  const electricalData = {
    ballastFactor: getNextValue(),
    ballastLampPhotometricFactor: getNextValue(),
    inputWatts: getNextValue(),
  };

  const data: IesData = {
    version: document.version,
    headers: document.headers,
    tilt: document.tilt,
    lamp,
    photometricData,
    units,
    dim,
    electricalData,
  };

  // Unpack vertical angles
  for (let i = 0; i < verticalAngleCount; i++) {
    data.photometricData.verticalAngles.push(getNextValue());
  }

  // Unpack horizontal angles
  for (let i = 0; i < horizontalAngleCount; i++) {
    data.photometricData.horizontalAngles.push(getNextValue());
  }

  // Unpack candela values
  for (let i = 0; i < horizontalAngleCount; i++) {
    data.photometricData.candela.push([]);
    for (let j = 0; j < verticalAngleCount; j++) {
      data.photometricData.candela[i].push(getNextValue());
    }
  }

  return data;
}

// Standardizes IES data that has no horizontal sweep by repeating samples.
function standardizeHorizontalAngles0(data: IesData): void {
  data.photometricData.horizontalAngles = [
    0,
    22.5,
    45,
    67.5,
    90,
    112.5,
    135,
    157.5,
    180,
    202.5,
    225,
    247.5,
    270,
    292.5,
    315,
    337.5,
    360,
  ];

  const array = data.photometricData.candela[0];
  if (array === undefined) {
    throw Error("iesna: incomplete candela data");
  }

  for (let i = 1; i < data.photometricData.horizontalAngles.length; i++) {
    data.photometricData.candela.push(array);
  }
}

// Standardizes IES data that has a 90 degree horizontal sweep by repeating samples.
function standardizeHorizontalAngles90(data: IesData): void {
  data.photometricData.horizontalAngles = [
    ...data.photometricData.horizontalAngles,
    ...data.photometricData.horizontalAngles.map((angle) => angle + 90),
    ...data.photometricData.horizontalAngles.map((angle) => angle + 180),
    ...data.photometricData.horizontalAngles.map((angle) => angle + 270),
  ];

  data.photometricData.candela = [
    ...data.photometricData.candela,
    ...data.photometricData.candela.reverse(),
    ...data.photometricData.candela,
    ...data.photometricData.candela.reverse(),
  ];
}

// Standardizes IES data that has a 180 degree horizontal sweep by repeating samples.
function standardizeHorizontalAngles180(data: IesData): void {
  data.photometricData.horizontalAngles = [
    ...data.photometricData.horizontalAngles,
    ...data.photometricData.horizontalAngles.map((angle) => angle + 180),
  ];

  data.photometricData.candela.push(...data.photometricData.candela.reverse());
}

// Some IES documents contain incomplete horizontal angles. This include documents that only sweep
// 90 degrees horizontal and others that only contain a single horizontal sweep. This function
// standardizes the passed IES document to include a complete 360 degree horizontal sweep.
function standardizeHorizontalAngles(data: IesData): void {
  const lastHorizontalAngle =
    data.photometricData.horizontalAngles[data.photometricData.horizontalAngles.length - 1];

  if (lastHorizontalAngle === 0) {
    standardizeHorizontalAngles0(data);
  } else if (lastHorizontalAngle === 90) {
    standardizeHorizontalAngles90(data);
  } else if (lastHorizontalAngle === 180) {
    standardizeHorizontalAngles180(data);
  } else if (lastHorizontalAngle !== 360) {
    throw Error(`iesna: final horizontal angle is ${lastHorizontalAngle}, expect 0/90/180/360`);
  }
}

/**
 * Parses the given IES document into an IesData object. Throws an exception if an error occurs.
 */
export function parse(source: string): IesData {
  const iesDocument = readDocument(source);
  const iesData = parseIesData(iesDocument);

  standardizeHorizontalAngles(iesData);

  return iesData;
}
