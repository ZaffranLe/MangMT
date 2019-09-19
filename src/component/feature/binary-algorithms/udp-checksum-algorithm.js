const BIN_CARRY_OUT = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
const _ = require("lodash");
function sum2Bin(bin1, bin2) {
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
        return sum2Bin(sum, BIN_CARRY_OUT);
    }
    return sum;
}

export default function udp16CheckSum(word) {
    let binaryString = "";
    for (let i = 0; i < word.length; i++) {
        binaryString += "0" + word[i].charCodeAt(0).toString(2);
    }
    if (word.length % 2) {
        binaryString += "00000000";
    }
    console.log(binaryString);
    let udp16bNumbers = [];
    for (let i = 0; i < binaryString.length; i += 16) {
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
        let step = {};
        step["first"] = _.clone(udp16bNumbers[0].join(" "));
        step["second"] = _.clone(udp16bNumbers[1].join(" "));
        udp16bNumbers[0] = sum2Bin(udp16bNumbers[0], udp16bNumbers[1]);
        step["result"] = _.clone(udp16bNumbers[0].join(" "));
        udp16bNumbers.splice(1, 1);
        steps.push(step);
    }
    const checksum = udp16bNumbers[0]
        .map(bin => {
            if (bin) return "0";
            return "1";
        })
        .join("");
    const result = {};
    result["checksum"] = checksum;
    result["steps"] = steps;
    return result;
}
