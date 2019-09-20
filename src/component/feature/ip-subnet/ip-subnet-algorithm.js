const _ = require("lodash");

function decimalToBinary(num) { // Ham doi so thap phan sang chuoi bit
    const binary = [];
    while (num !== 0 || binary.length < 8) {
        binary.push(num % 2);
        num = Math.floor(num / 2);
    }
    return binary.reverse().join("");
}

function binToDecimal(binary) { // Ham doi chuoi bit sang so thap phan
    binary = binary.split("").reverse();
    let num = 0;
    for (let i = 0; i < binary.length; i++) {
        num += binary[i] * Math.pow(2, i);
    }
    return num;
}

function binToHexa(binary) { // Ham doi chuoi bit sang he thap luc phan
    return parseInt(binary, 2).toString(16);
}

function decimalToHexa(num) { // Ham doi so thap phan sang he thap luc phan
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
    // Mau kiem tra xem dau vao co phai IPv4 hay khong
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
    // Cau truc du lieu luu IPv4 dau vao
    data["ipAddr"] = {};
    data["ipAddr"]["name"] = "IP Address";
    data["ipAddr"]["value"] = ip;
    let ipBinary = _.clone( // Doi IPv4 dau vao sang chuoi bit
        ip
            .split(".")
            .map(octet => {
                return decimalToBinary(octet);
            })
            .join("")
    );
    let subnetBinary = _.clone( // Doi subnet mák sang chuoi bit
        subnet["ip"]
            .split(".")
            .map(octet => {
                return decimalToBinary(octet);
            })
            .join("")
    );
    let networkAddrBinary = "";
    for (let i = 0; i < ipBinary.length; i++) { // Tinh toan network address
                                               // bang phep tinh AND giua 2 chuoi bit cua IPv4 va Subnet mask
        networkAddrBinary += ipBinary[i] == 1 && subnetBinary[i] == 1 ? 1 : 0;
    }
    let networkAddr = [];
    for (let i = 0; i < networkAddrBinary.length; i += 8) {
        networkAddr = networkAddr.concat(networkAddrBinary.slice(i, i + 8));
    }
    networkAddr = networkAddr.map(binary => { // Doi chuoi bit cua network address sang he thap phan
        return binToDecimal(binary);
    });

    // Cau truc du lieu luu Network address
    data["networkAddr"] = {};
    data["networkAddr"]["value"] = _.clone(networkAddr.join("."));
    data["networkAddr"]["name"] = "Network Address";

    let start = _.clone(networkAddr); // IP dau tien trong khoang host IP co the su dung = Network address + 1
    start[start.length - 1] = start[start.length - 1] + 1;

    // Cau truc du lieu luu khoang host IP co the su dung
    data["range"] = {};
    data["range"]["value"] = start.join(".") + " - ";
    data["range"]["name"] = "Usable Host IP Range";
    let jumpIndex = -1;
    switch (subnet["type"]) { // Lay ra octet de tinh buoc nhay
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
    // Tinh toan broadcast address
    networkAddr[jumpIndex] = networkAddr[jumpIndex] + jump; 
    for (let i = jumpIndex + 1; i < networkAddr.length; i++) {
        networkAddr[i] = 255;
    }
    let broadcast = _.clone(networkAddr);
    // ----------------------------

    // Cau truc du lieu luu Broadcast Address
    data["broadcastAddr"] = {};
    data["broadcastAddr"]["name"] = "Broadcast Address";
    data["broadcastAddr"]["value"] = broadcast.join(".");
    let end = _.clone(networkAddr); // IP ket thuc trong khoang host IP co the su dung = broadcast address - 1
    end[end.length - 1] = end[end.length - 1] - 1;
    data["range"]["value"] += end.join(".");
    let totalNumOfHosts = Math.pow(2, 32 - parseInt(subnet["cidr"], 10)); // Tinh tong so host

    // Cau truc du lieu luu tong so luong host
    data["totalNumOfHosts"] = {};
    data["totalNumOfHosts"]["value"] = totalNumOfHosts.toLocaleString();
    data["totalNumOfHosts"]["name"] = "Total Number of Hosts";

    // Cau truc du lieu luu so luong host co the dung
    data["numOfUsableHosts"] = {};
    data["numOfUsableHosts"]["value"] = (totalNumOfHosts - 2).toLocaleString(); // So luong host co the dung = tong so luong host - 2
                                                                                // (Loai bo Network address va Broadcast)
    data["numOfUsableHosts"]["name"] = "Number of Usable Hosts";

    // Cau truc du lieu luu subnet mask
    data["subnet"] = {};
    data["subnet"]["name"] = "Subnet Mask";
    data["subnet"]["value"] = subnet["ip"];
    let wildcardAddr = _.clone( // Wildcard Address = 255.255.255.255 - Subnet mask
        subnet["ip"]
            .split(".")
            .map(octet => {
                return 255 - parseInt(octet, 10);
            })
            .join(".")
    );

    // Cau truc du lieu luu Wildcard Address
    data["wildcardAddr"] = {};
    data["wildcardAddr"]["name"] = "Wildcard Address";
    data["wildcardAddr"]["value"] = wildcardAddr;

    // Cau truc du lieu luu Subnet mask duoi dang chuoi bit
    data["binSubnetMask"] = {};
    data["binSubnetMask"]["name"] = "Binary Subnet Mask";
    data["binSubnetMask"]["value"] = subnet["ip"] // Doi subnet mask sang chuoi bit
        .split(".")
        .map(octet => {
            return decimalToBinary(octet);
        })
        .join(".");

    // Cau truc du lieu luu class cua subnet mask
    data["subnetClass"] = {};
    data["subnetClass"]["name"] = "Subnet Mask Class";
    data["subnetClass"]["value"] = subnet["type"];

    // Cau truc du lieu luu phuong phap CIDR
    data["cidr"] = {};
    data["cidr"]["name"] = "CIDR Notation";
    data["cidr"]["value"] = "/" + subnet["cidr"];

    // Cau truc du lieu luu loai IP (Public / Private)
    data["ipType"] = {};
    data["ipType"]["name"] = "IP Type";
    let ipOctets = ip.split(".");
    data["ipType"]["value"] = // Kiem tra IP dau vao la Public hay Private
        ipOctets[0] == 10 ||
        (ipOctets[0] == 172 && ipOctets[1] >= 16 && ipOctets[1] <= 31) ||
        (ipOctets[0] == 192 && ipOctets[1] == 168)
            ? "Private"
            : "Public";

    // Cau truc du lieu luu dang rut gon cua IP va Ssubnet mask      
    data["short"] = {};
    data["short"]["name"] = "Short";
    data["short"]["value"] = ip + " " + subnet["cidr"];

    // Cau truc du lieu luu IPv4 duoi dang chuoi bit
    data["binaryId"] = {};
    data["binaryId"]["name"] = "Binary ID";
    data["binaryId"]["value"] = ip
        .split(".")
        .map(octet => {
            return decimalToBinary(octet);
        })
        .join("");

    // Cau truc du lieu luu IPv4 duoi dang chuoi thap phan
    data["intId"] = {};
    data["intId"]["name"] = "Integer ID";
    data["intId"]["value"] = binToDecimal(data["binaryId"]["value"]);

    // Cau truc du lieu luu IPv4 duoi dang chuoi thap nhi phan
    data["hexaId"] = {};
    data["hexaId"]["name"] = "Hex ID";
    data["hexaId"]["value"] = "0x" + binToHexa(data["binaryId"]["value"]);

    // Cau truc du lieu luu in-addr.arpa
    data["arpa"] = {};
    data["arpa"]["name"] = "in-addr.arpa";
    data["arpa"]["value"] = // Tinh in-addr.arpa bang cach dao nguoc vi tri cua cac octet trong IPv4, sau do them duoi .in-addr.arpa
        ip
            .split(".")
            .reverse()
            .join(".") + ".in-addr.arpa";
    // Cau truc du lieu luu IPv4 Mapped Address
    data["ipv4MappedAddr"] = {};
    data["ipv4MappedAddr"]["name"] = "IPv4 Mapped Address";
    data["ipv4MappedAddr"]["value"] =
        "::ffff:" +
        decimalToHexa(ipOctets[0]) +
        decimalToHexa(ipOctets[1]) +
        "." +
        decimalToHexa(ipOctets[2]) +
        decimalToHexa(ipOctets[3]);

    // Cau truc du lieu luu 6 to 4 prefix
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

    let networks = []; // Danh sach cac network co the su dung ung voi dai IP
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

    // Cau truc du lieu luu tru ket qua de hien thi len giao dien web
    result["networks"]["ip"] = ipOctets.join(".");
    result["networks"]["cidr"] = "/" + subnet["cidr"];
    result["networks"]["networks"] = networks;
    return result; // Ket qua cuoi cung
}
