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
    result["networks"] = {};
    result["networks"]["networks"] = [];
    const data = {};
    let ipv4Reg = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    if (!ipv4Reg.test(ip)) {
        data["notIP"] = {};
        data["notIP"]["name"] = "Wrong IP Address";
        data["notIP"]["value"] = "This isn't a valid IPv4 Address.";
        result["data"] = data;
        return result;
    }
    if (subnet === "") {
        data["forgotSubnet"] = {};
        data["forgotSubnet"]["name"] = "Missing Subnet mask";
        data["forgotSubnet"]["value"] =
            "You have to choose a subnet mask first.";
        result["data"] = data;
        return result;
    }
    data["ipAddr"] = {};
    data["ipAddr"]["name"] = "IP Address";
    data["ipAddr"]["value"] = ip;
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
    data["networkAddr"] = {};
    data["networkAddr"]["value"] = _.clone(networkAddr.join("."));
    data["networkAddr"]["name"] = "Network Address";

    let start = _.clone(networkAddr);
    start[start.length - 1] = start[start.length - 1] + 1;

    data["range"] = {};
    data["range"]["value"] = start.join(".") + " - ";
    data["range"]["name"] = "Usable Host IP Range";
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
    data["broadcastAddr"] = {};
    data["broadcastAddr"]["name"] = "Broadcast Address";
    data["broadcastAddr"]["value"] = broadcast.join(".");
    let end = _.clone(networkAddr);
    end[end.length - 1] = end[end.length - 1] - 1;
    data["range"]["value"] += end.join(".");
    let totalNumOfHosts = Math.pow(2, 32 - parseInt(subnet["cidr"], 10));
    data["totalNumOfHosts"] = {};
    data["totalNumOfHosts"]["value"] = totalNumOfHosts.toLocaleString();
    data["totalNumOfHosts"]["name"] = "Total Number of Hosts";

    data["numOfUsableHosts"] = {};
    data["numOfUsableHosts"]["value"] = (totalNumOfHosts - 2).toLocaleString();
    data["numOfUsableHosts"]["name"] = "Number of Usable Hosts";

    data["subnet"] = {};
    data["subnet"]["name"] = "Subnet Mask";
    data["subnet"]["value"] = subnet["ip"];
    let wildcardAddr = _.clone(
        subnet["ip"]
            .split(".")
            .map(octet => {
                return 255 - parseInt(octet, 10);
            })
            .join(".")
    );
    data["wildcardAddr"] = {};
    data["wildcardAddr"]["name"] = "Wildcard Address";
    data["wildcardAddr"]["value"] = wildcardAddr;

    data["binSubnetMask"] = {};
    data["binSubnetMask"]["name"] = "Binary Subnet Mask";
    data["binSubnetMask"]["value"] = subnet["ip"]
        .split(".")
        .map(octet => {
            return decimalToBinary(octet);
        })
        .join(".");

    data["subnetClass"] = {};
    data["subnetClass"]["name"] = "Subnet Mask Class";
    data["subnetClass"]["value"] = subnet["type"];

    data["cidr"] = {};
    data["cidr"]["name"] = "CIDR Notation";
    data["cidr"]["value"] = "/" + subnet["cidr"];

    data["ipType"] = {};
    data["ipType"]["name"] = "IP Type";
    let ipOctets = ip.split(".");
    data["ipType"]["value"] =
        ipOctets[0] == 10 ||
        (ipOctets[0] == 172 && ipOctets[1] >= 16 && ipOctets[1] <= 31) ||
        (ipOctets[0] == 192 && ipOctets[1] == 168)
            ? "Private"
            : "Public";

    data["short"] = {};
    data["short"]["name"] = "Short";
    data["short"]["value"] = ip + " " + subnet["cidr"];

    data["binaryId"] = {};
    data["binaryId"]["name"] = "Binary ID";
    data["binaryId"]["value"] = ip
        .split(".")
        .map(octet => {
            return decimalToBinary(octet);
        })
        .join("");

    data["intId"] = {};
    data["intId"]["name"] = "Integer ID";
    data["intId"]["value"] = binToDecimal(data["binaryId"]["value"]);

    data["hexaId"] = {};
    data["hexaId"]["name"] = "Hex ID";
    data["hexaId"]["value"] = "0x" + binToHexa(data["binaryId"]["value"]);

    data["arpa"] = {};
    data["arpa"]["name"] = "in-addr.arpa";
    data["arpa"]["value"] =
        ip
            .split(".")
            .reverse()
            .join(".") + ".in-addr.arpa";

    data["ipv4MappedAddr"] = {};
    data["ipv4MappedAddr"]["name"] = "IPv4 Mapped Address";
    data["ipv4MappedAddr"]["value"] =
        "::ffff:" +
        decimalToHexa(ipOctets[0]) +
        decimalToHexa(ipOctets[1]) +
        "." +
        decimalToHexa(ipOctets[2]) +
        decimalToHexa(ipOctets[3]);

    data["6to4Prefix"] = {};
    data["6to4Prefix"]["name"] = "6to4 Prefix";
    data["6to4Prefix"]["value"] =
        "2002:" +
        decimalToHexa(ipOctets[0]) +
        decimalToHexa(ipOctets[1]) +
        "." +
        decimalToHexa(ipOctets[2]) +
        decimalToHexa(ipOctets[3]) +
        "::/48";

    result["data"] = data;

    let networks = [];
    while (networks.length < 256 / (jump + 1) && jump !== 255) {
        let network = {};
        let posNetAddr = _.clone(ipOctets);
        posNetAddr[jumpIndex] = (jump + 1) * networks.length;
        for (let i = jumpIndex + 1; i < posNetAddr.length; i++) {
            posNetAddr[i] = 0;
        }
        network["addr"] = posNetAddr.join(".");
        let start = _.clone(posNetAddr);
        start[start.length - 1] = start[start.length - 1] + 1;
        network["range"] = start.join(".") + " - ";
        posNetAddr[jumpIndex] = posNetAddr[jumpIndex] + jump;
        for (let i = jumpIndex + 1; i < posNetAddr.length; i++) {
            posNetAddr[i] = 255;
        }
        network["broadcast"] = posNetAddr.join(".");
        let end = _.clone(posNetAddr);
        end[end.length - 1] = end[end.length - 1] - 1;
        network["range"] += end.join(".");
        networks.push(network);
    }
    for (let i = jumpIndex; i < ipOctets.length; i++) {
        ipOctets[i] = "*";
    }
    result["networks"]["ip"] = ipOctets.join(".");
    result["networks"]["cidr"] = "/" + subnet["cidr"];
    result["networks"]["networks"] = networks;
    return result;
}
