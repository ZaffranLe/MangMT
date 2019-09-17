const _ = require("lodash");

function isExponentOf2(num) {
  return Math.log2(num) === Math.round(Math.log2(num));
}

function calculateHammingCode(hammingCode) {
  const pList = [];
  for (let i = 0; i < hammingCode.length; i++) {
    if (isExponentOf2(i + 1)) {
      let binaries = [];
      for (let j = i; j < hammingCode.length; j += (i + 1) * 2) {
        binaries = binaries.concat(
          hammingCode.slice(j, j < hammingCode.length && i + 1 + j)
        );
      }
      let p = {};
      p["binaries"] = binaries.slice(1);
      p["index"] = i;
      pList.push(p);
    }
  }
  console.log(pList);
  for (let p of pList) {
    let countBit1 = 0;
    for (let bit of p["binaries"]) {
      countBit1 += parseInt(bit, 10);
    }
    hammingCode[p["index"]] = countBit1 % 2;
  }

  return hammingCode.join("");
}

export function hammingCode(word) {
  let bin = ""; 
  for (let char of word) {
    bin += "0" + char.charCodeAt(0).toString(2);
  }
  let bitArr = bin.split("");
  let hammingCode = [];
  let index = 0;
  while (bitArr.length > 0) {
    if (!isExponentOf2(index + 1)) {
      hammingCode[index] = parseInt(bitArr.shift(), 10);
    } else {
      hammingCode[index] = false;
    }
    index++;
  }

  return calculateHammingCode(hammingCode);
}

export function fixHammingCode(hammingCode) {
  hammingCode = hammingCode.split("");
  console.log(hammingCode);
  let hammingCodeAsObjects = hammingCode.map((bit, i) => {
    let obj = {};
    obj["bit"] = bit;
    obj["index"] = i;
    obj["isTrue"] = false;
    obj["falseCount"] = 0;
    return obj;
  });
  const pList = [];
  for (let i = 0; i < hammingCodeAsObjects.length; i++) {
    if (isExponentOf2(i + 1)) {
      let binaries = [];
      for (let j = i; j < hammingCodeAsObjects.length; j += (i + 1) * 2) {
        binaries = binaries.concat(
          hammingCodeAsObjects.slice(
            j,
            j < hammingCodeAsObjects.length && i + 1 + j
          )
        );
      }
      let p = {};
      p["binaries"] = binaries.slice(1);
      p["parityBit"] = binaries[0];
      pList.push(p);
    }
  }
  let falseCount = 0;
  for (let p of pList) {
    let countBit1 = 0;
    for (let bitObj of p["binaries"]) {
      countBit1 += parseInt(bitObj["bit"], 10);
    }
    if (p["parityBit"]["bit"] == countBit1 % 2) {
      p["parityBit"]["isTrue"] = true;
      for (let bitObj of p["binaries"]) {
        bitObj["isTrue"] = true;
      }
    } else {
      p["parityBit"]["falseCount"] += 1;
      for (let bitObj of p["binaries"]) {
        bitObj["falseCount"] += 1;
      }
      falseCount++;
    }
  }

  let wrongBitIndex = -1;

  for (let p of pList) {
    if (
      !p["parityBit"]["isTrue"] &&
      p["parityBit"]["falseCount"] === falseCount
    ) {
      wrongBitIndex = p["parityBit"]["index"];
      break;
    }
    for (let bitObj of p["binaries"]) {
      if (!bitObj["isTrue"] && bitObj["falseCount"] === falseCount) {
        wrongBitIndex = bitObj["index"];
        break;
      }
    }
  }
  let result = {};
  if (wrongBitIndex === -1) {
    result["hammingCode"] = "Hamming code is good!";
  } else {
    hammingCode[wrongBitIndex] = hammingCode[wrongBitIndex] == 1 ? "0" : "1";
  }
  let originalBinaries = hammingCode.filter((bit, i) => {
    return !isExponentOf2(i + 1);
  });
  originalBinaries = originalBinaries.join("");
  hammingCode = hammingCode.join("");
  result["hammingCode"] = hammingCode;
  result["char"] = String.fromCharCode(
    parseInt(originalBinaries, 2).toString(10)
  );
  return result;
}
