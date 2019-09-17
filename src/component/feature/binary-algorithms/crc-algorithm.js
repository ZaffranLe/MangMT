export default function crcCalculate(word, G) {
    let D = "";
    for (let char of word) {
        D += "0" + char.charCodeAt(0).toString(2);
    }
    let r = G.length - 1;
    for (let i = 0; i < r; i++) {
        D += "0";
    }
    D = D.split("");
    // eslint-disable-next-line
    if (D[0] == 0) {
        D.shift();
    }
    G = G.split("");
    while (D.length >= G.length) {
        for (let i = 0; i < G.length; i++) {
            D[i] = D[i] ^ G[i];
        }
        // eslint-disable-next-line
        while (D[0] == 0 && D.length >= G.length) {
            D.shift();
        }
    }
    return D.join("");
}
