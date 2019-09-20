const _ = require("lodash")

function isExponentOf2(num) { // Ham kiem tra xem 1 so co phai la luy thua cua 2 hay khong
    return Math.log2(num) === Math.round(Math.log2(num));
}

function calculateHammingCode(hammingCode) { // Ham tinh toan hamming code
    const pList = []; // Danh sach cac parity bit (cac bit la luy thua cua 2)
    for (let i = 0; i < hammingCode.length; i++) {
        if (isExponentOf2(i + 1)) { // Neu bit la 1 parity bit
            let binaries = [];
            let indexes = [];
            for (let j = i; j < hammingCode.length; j += (i + 1) * 2) { // Lay ra cac bit con lai de tinh toan theo quy luat
                binaries = binaries.concat(
                    hammingCode.slice(j, j < hammingCode.length && i + 1 + j)
                );
                let max = j < hammingCode.length ? i + j + 1 : hammingCode.length;
                for (let k = j; k < max; k++) {
                    indexes.push(k);
                }
            }
            let p = {};
            p["binaries"] = binaries.slice(1);
            p["index"] = i;
            p["indexes"] = indexes;
            pList.push(p);
        }
    }
    for (let p of pList) { // Thuc hien tinh toan parity bit theo quy luat "So chan"
        let countBit1 = 0;
        for (let bit of p["binaries"]) {
            countBit1 += parseInt(bit, 10);
        }
        hammingCode[p["index"]] = countBit1 % 2;
    }
    // Cau truc du lieu hien thi ket qua len giao dien web
    const result = {};
    result["hammingCode"] = hammingCode.join("");
    let pListClone = _.cloneDeep(pList);
    pListClone.forEach(p => {
        let binaries = [];
        for (let i = 0; i < hammingCode.length; i++) {
            if (p["indexes"].indexOf(i) === -1) {
                binaries.push("");
            } else {
                binaries.push(hammingCode[i]);
            }
        }
        p["binaries"] = binaries;
    });
    result["pList"] = pListClone;
    return result; // Tra ve ket qua cuoi cung
}

export function hammingCode(input, type) { // Ham tinh hamming code
    let bin = "";
    // Type co 2 loai: chuoi bit - chuoi ky tu
    if (type === "bin") {
        bin = input;
    } else {
        for (let char of input) {
            bin += "0" + char.charCodeAt(0).toString(2); // Doi chuoi ky tu sang chuoi bit
        }
    }
    let bitArr = bin.split("");
    let hammingCode = [];
    let index = 0;
    while (bitArr.length > 0) { // Tinh ra chuoi bit ket qua voi cac bit luy thua cua 2
        if (!isExponentOf2(index + 1)) {
            hammingCode[index] = parseInt(bitArr.shift(), 10);
        } else { // Danh dau cac bit luy thua cua 2
            hammingCode[index] = false;
        }
        index++;
    }
    return calculateHammingCode(hammingCode);
}

export function fixHammingCode(hammingCode) { // Ham sua loi hamming code
    hammingCode = hammingCode.split("");
    let hammingCodeAsObjects = hammingCode.map((bit, i) => {
        let obj = {};
        obj["bit"] = bit;
        obj["index"] = i;
        obj["isTrue"] = false;
        obj["falseCount"] = 0;
        return obj;
    });
    const pList = [];
    for (let i = 0; i < hammingCodeAsObjects.length; i++) { // Tim kiem cac parity bit
        if (isExponentOf2(i + 1)) {
            let binaries = [];
            for (let j = i; j < hammingCodeAsObjects.length; j += (i + 1) * 2) { // Loc ra cac bit con lai dung de tinh toan
                binaries = binaries.concat(                                     // ung voi moi 1 parity bit
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
    for (let p of pList) { // Kiem tra su chinh xac cua cac parity bit
        let countBit1 = 0;
        for (let bitObj of p["binaries"]) {
            countBit1 += parseInt(bitObj["bit"], 10);
        }
        // eslint-disable-next-line
        if (p["parityBit"]["bit"] == countBit1 % 2) { // Neu parity bit chinh xac
            p["parityBit"]["isTrue"] = true; // thi se danh dau cac bit dung
            for (let bitObj of p["binaries"]) { 
                bitObj["isTrue"] = true;
            }
        } else { // Danh dau cac bit sai
            p["parityBit"]["falseCount"] += 1;
            for (let bitObj of p["binaries"]) {
                bitObj["falseCount"] += 1;
            }
            falseCount++;
        }
    }

    let wrongBitIndex = -1; // Bien luu vi tri cua bit bi sai

    for (let p of pList) { // Dem so lan xuat hien cua cac bit trong cac parity bit sai
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
    if (wrongBitIndex === -1) { // Neu vi tri cua bit sai = -1, tuc la khong co bit nao sai trong chuoi dau vao
        result["hammingCode"] = "Hamming code is good!";
        return result;
    } else { // Bit bi sai se la bit xuat hien nhieu lan nhat trong cac parity bit khong chinh xac
        // eslint-disable-next-line
        hammingCode[wrongBitIndex] =
            hammingCode[wrongBitIndex] == 1 ? "0" : "1";
    }
    let originalBinaries = hammingCode.filter((bit, i) => { // Tra ve chuoi ban dau
        return !isExponentOf2(i + 1);
    });

    // Cau truc du lieu luu tru ket qua hien thi len giao dien web
    originalBinaries = originalBinaries.join("");
    hammingCode = hammingCode.join("");
    result["hammingCode"] = hammingCode;
    result["char"] = String.fromCharCode(
        parseInt(originalBinaries, 2).toString(10)
    );

    let pListClone = _.cloneDeep(pList);
    pListClone.forEach(p => {
        let binaries = [];
        let indexes = p["binaries"].map(bin => {
            return bin["index"];
        });
        indexes.unshift(p["parityBit"]["index"]);
        for (let i =0 ;i < hammingCode.length; i++) {
            if (indexes.indexOf(i) === -1) {
                binaries.push("");
            } else {
                binaries.push(hammingCode[i]);
            }
        }
        p["binaries"] = binaries;
    })
    result["pList"] = pListClone;
    return result; // Ket qua cuoi cung
}
