const BIN_CARRY_OUT = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
const _ = require("lodash");
function sum2Bin(bin1, bin2) {
  // Ham thuc hien cong 2 chuoi 16 bit
  let sum = [];
  let isCarryOut = false;
  for (let i = 15; i >= 0; i--) {
    let bin = bin1[i] + bin2[i];
    if (isCarryOut) {
      bin++;
      isCarryOut = false;
    }
    if (bin >= 2) {
      bin -= 2;
      isCarryOut = true;
    }
    sum[i] = bin;
  }
  if (isCarryOut) {
    // Neu nhu co du 1 sau khi cong bit cuoi cung
    // thi se thuc hien cong 1 bit du day vao ket qua
    return sum2Bin(sum, BIN_CARRY_OUT);
  }
  return sum;
}

export default function udp16CheckSum(input, type) {
  let binaryString = "";
  // type gom 2 loai: chuoi ky tu - chuoi bit
  if (type === "word") { // Neu la chuoi ky tu
    for (let i = 0; i < input.length; i++) {
      // Doi chuoi ky tu sang chuoi bit
      binaryString += "0" + input[i].charCodeAt(0).toString(2);
    }
  } else {
    binaryString = input;
  }
  let leftOver = binaryString.length % 16;
  for (let i = 0; i < 16 - leftOver; i++) { // Bo sung them so bit 0 de do dai chuoi la boi so cua 16
    binaryString += "0";
  }

  let udp16bNumbers = [];
  for (let i = 0; i < binaryString.length; i += 16) { // Tach chuoi bit ra cac chuoi con co do dai la 16 bit
    udp16bNumbers.push(
      binaryString
        .slice(i, i + 16)
        .split("")
        .map(bit => {
          return parseInt(bit, 16);
        })
    );
  }
  let steps = [];
  while (udp16bNumbers.length > 1) {
    // Vong lap cong lan luot 2 so lai voi nhau cho toi khi ra ket qua cuoi cung
    let step = {};
    step["first"] = _.clone(udp16bNumbers[0].join(" "));
    step["second"] = _.clone(udp16bNumbers[1].join(" "));
    udp16bNumbers[0] = sum2Bin(udp16bNumbers[0], udp16bNumbers[1]);
    step["result"] = _.clone(udp16bNumbers[0].join(" "));
    udp16bNumbers.splice(1, 1);
    steps.push(step);
  }
  const checksum = udp16bNumbers[0] // Dao nguoc gia tri bit cua chuoi ket qua
    .map(bin => {
      if (bin) return "0";
      return "1";
    })
    .join("");
  const result = {};
  result["checksum"] = checksum; // Ket qua cuoi cung
  result["steps"] = steps; // So buoc thuc hien
  return result;
}
