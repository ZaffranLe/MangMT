export default function crcCalculate(input, type, G) {
    let D = "";
    // Type co 2 loai: chuoi ky tu - chuoi bit
    if (type === "bin") {
        D = input;
    } else {
        for (let char of input) {
            D += "0" + char.charCodeAt(0).toString(2); // Doi chuoi ky tu ra chuoi bit
        }
    }
    let r = G.length - 1;
    for (let i = 0; i < r; i++) { // Cong them r = G-1 bit 0 vao cuoi chuoi D
        D += "0";
    }
    D = D.split("");
    // eslint-disable-next-line
    if (D[0] == 0) { // Neu bit dau tien cua D la 0 thi loai bo
        D.shift();
    }
    G = G.split("");
    while (D.length >= G.length) {
        for (let i = 0; i < G.length; i++) { // Thuc hien phep tinh XOR voi G tu dau chuoi D toi cuoi
            D[i] = D[i] ^ G[i];
        }
        // eslint-disable-next-line
        while (D[0] == 0 && D.length >= G.length) { // Xoa cac bit 0 dau tien sau khi thuc hien moi buoc tinh toan
            D.shift();
        }
    }
    return D.join(""); // Ket qua cuoi cung
}
