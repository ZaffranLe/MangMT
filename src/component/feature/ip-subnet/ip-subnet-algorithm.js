const _ = require("lodash");

function decimalToBinary(num) {
    const binary = [];
    while (num !== 0 || binary.length < 8) {
        binary.push(num % 2);
        num = Math.floor(num / 2);
    }
    return binary.reverse().join("");
}

function binToDecimal(binary) {
    binary = binary.split("").reverse();
    let num = 0;
    for (let i = 0; i < binary.length; i++) {
        num += binary[i] * Math.pow(2, i);
    }
    return num;
}

function binToHexa(binary) {
    return parseInt(binary, 2).toString(16);
}

function decimalToHexa(num) {
    let hexa = parseInt(num, 10).toString(16);
    if (hexa.length === 1) {
        hexa = "0" + hexa;
    }
    return hexa;
}

export default function ipSubnet(ip, subnet = "") {
    const result = {};
    let ipv4Reg = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    if (!ipv4Reg.test(ip)) {
        result["notIP"] = {};
        result["notIP"]["name"] = "Wrong IP Address";
        result["notIP"]["value"] = "This isn't a valid IPv4 Address.";
        return result;
    }
    if (subnet === "") {
        result["forgotSubnet"] = {};
        result["forgotSubnet"]["name"] = "Missing Subnet mask";
        result["forgotSubnet"]["value"] =
            "You have to choose a subnet mask first.";
        return result;
    }
    result["ipAddr"] = {};
    result["ipAddr"]["name"] = "IP Address";
    result["ipAddr"]["value"] = ip;
    let ipBinary = _.clone(
        ip
            .split(".")
            .map(octet => {
                return decimalToBinary(octet);
            })
            .join("")
    );
    let subnetBinary = _.clone(
        subnet["ip"]
            .split(".")
            .map(octet => {
                return decimalToBinary(octet);
            })
            .join("")
    );
    let networkAddrBinary = "";
    for (let i = 0; i < ipBinary.length; i++) {
        networkAddrBinary += ipBinary[i] == 1 && subnetBinary[i] == 1 ? 1 : 0;
    }
    let networkAddr = [];
    for (let i = 0; i < networkAddrBinary.length; i += 8) {
        networkAddr = networkAddr.concat(networkAddrBinary.slice(i, i + 8));
    }
    networkAddr = networkAddr.map(binary => {
        return binToDecimal(binary);
    });
    result["networkAddr"] = {};
    result["networkAddr"]["value"] = _.clone(networkAddr.join("."));
    result["networkAddr"]["name"] = "Network Address";

    let start = _.clone(networkAddr);
    start[start.length - 1] = start[start.length - 1] + 1;

    result["range"] = {};
    result["range"]["value"] = start.join(".") + " - ";
    result["range"]["name"] = "Usable Host IP Range";
    let jumpIndex = -1;
    switch (subnet["type"]) {
        case "Other":
            jumpIndex = 0;
            break;
        case "A":
            jumpIndex = 1;
            break;
        case "B":
            jumpIndex = 2;
            break;
        case "C":
            jumpIndex = 3;
            break;
        default:
            break;
    }
    let jump = 255 - subnet["ip"].split(".")[jumpIndex];
    networkAddr[jumpIndex] = networkAddr[jumpIndex] + jump;
    for (let i = jumpIndex + 1; i < networkAddr.length; i++) {
        networkAddr[i] = 255;
    }
    let broadcast = _.clone(networkAddr);
    result["broadcastAddr"] = {};
    result["broadcastAddr"]["name"] = "Broadcast Address";
    result["broadcastAddr"]["value"] = broadcast.join(".");
    let end = _.clone(networkAddr);
    end[end.length - 1] = end[end.length - 1] - 1;
    result["range"]["value"] += end.join(".");
    let totalNumOfHosts = (jump + 1) * Math.pow(256, 3 - jumpIndex);
    result["totalNumOfHosts"] = {};
    result["totalNumOfHosts"]["value"] = totalNumOfHosts;
    result["totalNumOfHosts"]["name"] = "Total Number of Hosts";

    result["numOfUsableHosts"] = {};
    result["numOfUsableHosts"]["value"] = totalNumOfHosts - 2;
    result["numOfUsableHosts"]["name"] = "Number of Usable Hosts";

    result["subnet"] = {};
    result["subnet"]["name"] = "Subnet Mask";
    result["subnet"]["value"] = subnet["ip"];
    let wildcardAddr = _.clone(
        subnet["ip"]
            .split(".")
            .map(octet => {
                return 255 - parseInt(octet, 10);
            })
            .join(".")
    );
    result["wildcardAddr"] = {};
    result["wildcardAddr"]["name"] = "Wildcard Address";
    result["wildcardAddr"]["value"] = wildcardAddr;

    result["binSubnetMask"] = {};
    result["binSubnetMask"]["name"] = "Binary Subnet Mask";
    result["binSubnetMask"]["value"] = subnet["ip"]
        .split(".")
        .map(octet => {
            return decimalToBinary(octet);
        })
        .join(".");

    result["cidr"] = {};
    result["cidr"]["name"] = "CIDR Notation";
    result["cidr"]["value"] = subnet["cidr"];

    result["ipType"] = {};
    result["ipType"]["name"] = "IP Type";
    let ipOctets = ip.split(".");
    result["ipType"]["value"] =
        ipOctets[0] == 10 ||
        (ipOctets[0] == 172 && ipOctets[1] >= 16 && ipOctets[1] <= 31) ||
        (ipOctets[0] == 192 && ipOctets[1] == 168)
            ? "Private"
            : "Public";

    result["short"] = {};
    result["short"]["name"] = "Short";
    result["short"]["value"] = ip + " " + subnet["cidr"];

    result["binaryId"] = {};
    result["binaryId"]["name"] = "Binary ID";
    result["binaryId"]["value"] = ip
        .split(".")
        .map(octet => {
            return decimalToBinary(octet);
        })
        .join("");

    result["intId"] = {};
    result["intId"]["name"] = "Integer ID";
    result["intId"]["value"] = binToDecimal(result["binaryId"]["value"]);

    result["hexaId"] = {};
    result["hexaId"]["name"] = "Hex ID";
    result["hexaId"]["value"] = "0x" + binToHexa(result["binaryId"]["value"]);

    result["arpa"] = {};
    result["arpa"]["name"] = "in-addr.arpa";
    result["arpa"]["value"] =
        ip
            .split(".")
            .reverse()
            .join(".") + ".in-addr.arpa";

    result["ipv4MappedAddr"] = {};
    result["ipv4MappedAddr"]["name"] = "IPv4 Mapped Address";
    result["ipv4MappedAddr"]["value"] =
        "::ffff:" +
        decimalToHexa(ipOctets[0]) +
        decimalToHexa(ipOctets[1]) +
        "." +
        decimalToHexa(ipOctets[2]) +
        decimalToHexa(ipOctets[3]);

    result["6to4Prefix"] = {};
    result["6to4Prefix"]["name"] = "6to4 Prefix";
    result["6to4Prefix"]["value"] =
        "2002:" +
        decimalToHexa(ipOctets[0]) +
        decimalToHexa(ipOctets[1]) +
        "." +
        decimalToHexa(ipOctets[2]) +
        decimalToHexa(ipOctets[3]) +
        "::/48";

    return result;
}
