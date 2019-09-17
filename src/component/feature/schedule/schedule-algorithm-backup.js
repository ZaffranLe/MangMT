import _ from "lodash";

let schedule = [];
const employees = {
    NamNH20: {
        group: 1,
        maxShift: 3,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    },
    DatNT11: {
        group: 1,
        maxShift: 3,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    },
    VanQTH: {
        group: 1,
        maxShift: 3,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    },
    TungPT15: {
        group: 1,
        maxShift: 3,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    },
    ThoVH3: {
        group: 1,
        maxShift: 4,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    },
    GiangHT7: {
        group: 1,
        maxShift: 4,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [0, 4],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    },
    ToanNV32: {
        group: 1,
        maxShift: 4,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [
            "d15",
            "d16",
            "d17",
            "d18",
            "d19",
            "d20",
            "d21",
            "d22",
            "d23",
            "d24",
            "d25",
            "d26",
            "d27",
            "d28",
            "d29",
            "d30"
        ],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    },
    LucNV6: {
        group: 1,
        maxShift: 5,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    },
    LongTT2: {
        group: 1,
        maxShift: 5,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    },
    AnhNTV9: {
        group: 1,
        maxShift: 5,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [1, 3, 5],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    },
    TuanNA106: {
        group: 1,
        maxShift: 5,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    },
    SangDV4: {
        group: 1,
        maxShift: 5,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    },
    ThuyNN9: {
        group: 2,
        maxShift: 5,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    },
    HuanHV3: {
        group: 2,
        maxShift: 5,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    },
    TuTT17: {
        group: 2,
        maxShift: 5,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    },
    DungNT173: {
        group: 2,
        maxShift: 5,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    },
    TuanLPM: {
        group: 2,
        maxShift: 5,
        dayShift: 0,
        dayShiftAsFirst: 0,
        dayShiftAsSecond: 0,
        firstOnSecondRate: 1,
        options: [],
        weekendShift: 0,
        dayWithG2: 0,
        done: false
    }
};

function checkDayOption(date, option) {
    // 0 = sunday, saturday = 6
    // 15th day in month = "d15"
    if (
        date.getDay() === option ||
        (option[0] === "d" && date.getDate() == option.slice(1))
    ) {
        return false;
    }
    return true;
}

function checkGroupOf2Emp(emp1, emp2) {
    if (emp1["group"] === 2 && emp2["group"] === 2) {
        return false;
    }
    if (emp1["group"] == 2 || emp2["group"] == 2) {
        if (emp1["dayWithG2"] == 2 || emp2["dayWithG2"] == 2) {
            return false;
        }
    }
    return true;
}

function chooseRandom(max) {
    let randomPosition = Math.floor(Math.random() * max);
    return randomPosition;
}

function chooseEmployee(empId, i, listOption, date) {
    if (i > 0) {
        if (Boolean(schedule[i - 1])) {
            if (
                schedule[i - 1]["firstShift"] === empId ||
                schedule[i - 1]["secondShift"] === empId
            ) {
                return false;
            }
        }
        if (Boolean(schedule[i + 1])) {
            if (
                schedule[i + 1]["firstShift"] === empId ||
                schedule[i + 1]["secondShift"] === empId
            ) {
                return false;
            }
        }
    }
    for (let option of listOption) {
        if (!checkDayOption(date, option)) {
            return false;
        }
    }
    return true;
}

function removeEmployeeFromList(empId, list) {
    list.splice(list.indexOf(empId), 1);
}

function isWeekend(date, weekends = []) {
    if (
        weekends.indexOf(date.getDate()) !== -1 ||
        date.getDay() === 0 ||
        date.getDay() === 6
    ) {
        return true;
    }
    return false;
}

export default function getSchedule(year, month, weekends = []) {
    const employeesClone = _.cloneDeep(employees);
    const listEmployeeId = [
        "NamNH20",
        "DatNT11",
        "VanQTH",
        "TungPT15",
        "ToanNV32",
        "ThoVH3",
        "GiangHT7",
        "LucNV6",
        "LongTT2",
        "AnhNTV9",
        "TuanNA106",
        "SangDV4",
        "ThuyNN9",
        "HuanHV3",
        "TuTT17",
        "DungNT173",
        "TuanLPM"
    ];

    const listFirstShift = [...listEmployeeId];

    const listSecondShift = [...listEmployeeId.slice(0, 12)];

    const listSecondShiftGroup2 = [...listEmployeeId.slice(12)];

    const listPro = [...listEmployeeId.slice(0, 7)];

    const listOtherEmpG1 = [...listEmployeeId.slice(7, 12)];
    const listOtherEmpG2 = [...listEmployeeId.slice(12)];
    const daysInMonth = new Date(year, month, 0).getDate();
    schedule = [];
    for (let i = 0; i < daysInMonth; i++) {
        let date = new Date(year, month - 1, i + 1);
        let listFirstShiftClone = [...listFirstShift];
        let chooseEmp1 = false;
        let chooseEmp2 = false;
        let emp1 = "";
        let emp2 = "";
        while (!chooseEmp1 && !chooseEmp2 && listFirstShiftClone.length > 0) {
            chooseEmp1 = true;
            let randomNumber1 = chooseRandom(listFirstShiftClone.length);
            emp1 = listFirstShiftClone[randomNumber1];
            let listOption = employeesClone[emp1]["options"];
            if (!chooseEmployee(emp1, i, listOption, date)) {
                chooseEmp1 = false;
            }
            if (!chooseEmp1) {
                removeEmployeeFromList(emp1, listFirstShiftClone);
                continue;
            }

            chooseEmp1 = true;

            let emp2FromGroup2 = false;
            let listSecondShiftGroup2Clone = [...listSecondShiftGroup2];
            let listSecondShiftClone = [...listSecondShift];
            let randomNumber2 = 0;

            if (emp1 === "NamNH20" || emp1 === "DatNT11") {
                chooseEmp2 = true;
                emp2 = emp1 === "NamNH20" ? "DatNT11" : "NamNH20";
                let listOption = employeesClone[emp2]["options"];
                if (!chooseEmployee(emp2, i, listOption, date)) {
                    removeEmployeeFromList(emp1, listFirstShiftClone);
                    removeEmployeeFromList(emp2, listSecondShiftClone);
                    chooseEmp1 = false;
                    chooseEmp2 = false;
                    continue;
                }
            }
            while (!chooseEmp2 && listSecondShiftGroup2Clone.length > 0) {
                chooseEmp2 = true;
                randomNumber2 = chooseRandom(listSecondShiftGroup2Clone.length);
                emp2 = listSecondShiftGroup2Clone[randomNumber2];
                let listOption = employeesClone[emp2]["options"];
                if (emp1 === emp2) {
                    chooseEmp2 = false;
                }
                if (
                    checkGroupOf2Emp(employeesClone[emp1], employeesClone[emp2])
                ) {
                    if (!chooseEmployee(emp2, i, listOption, date)) {
                        chooseEmp2 = false;
                    }
                } else {
                    chooseEmp2 = false;
                }
                if (!chooseEmp2) {
                    removeEmployeeFromList(emp2, listSecondShiftGroup2Clone);
                    continue;
                }
                chooseEmp2 = true;
                emp2FromGroup2 = true;
            }

            while (!chooseEmp2 && listSecondShiftClone.length > 0) {
                chooseEmp2 = true;
                randomNumber2 = chooseRandom(listSecondShiftClone.length);
                emp2 = listSecondShiftClone[randomNumber2];
                if (emp2 === "NamNH20" || emp2 === "DatNT11") {
                    chooseEmp2 = false;
                }
                let listOption = employeesClone[emp2]["options"];
                if (emp1 === emp2) {
                    chooseEmp2 = false;
                }
                if (
                    checkGroupOf2Emp(employeesClone[emp1], employeesClone[emp2])
                ) {
                    if (!chooseEmployee(emp2, i, listOption, date)) {
                        chooseEmp2 = false;
                    }
                } else {
                    chooseEmp2 = false;
                }
                if (!chooseEmp2) {
                    removeEmployeeFromList(emp2, listSecondShiftClone);
                    continue;
                }
                chooseEmp2 = true;
            }

            if (chooseEmp1 && chooseEmp2) {
                schedule[i] = {};
                schedule[i]["day"] = i + 1;
                schedule[i]["firstShift"] = emp1;
                employeesClone[emp1]["dayShift"] += 1;
                employeesClone[emp1]["dayShiftAsFirst"] += 1;

                schedule[i]["secondShift"] = emp2;
                employeesClone[emp2]["dayShift"] += 1;
                employeesClone[emp2]["dayShiftAsSecond"] += 1;

                if (isWeekend(date, weekends)) {
                    employeesClone[emp1]["weekendShift"] += 1;
                    employeesClone[emp2]["weekendShift"] += 1;
                }
                if (emp2FromGroup2) {
                    employeesClone[emp1]["dayWithG2"] += 1;
                    removeEmployeeFromList(emp2, listSecondShiftGroup2);
                } else {
                    removeEmployeeFromList(emp2, listSecondShift);
                }
                removeEmployeeFromList(emp1, listFirstShift);
            } else {
                removeEmployeeFromList(emp1, listFirstShiftClone);
            }
        }
    }

    for (let i = 0; i < daysInMonth; i++) {
        if (!Boolean(schedule[i])) {
            let emp1 = "";
            let chooseEmp1 = false;
            let emp2 = "";
            let chooseEmp2 = false;
            let date = new Date(year, month - 1, i + 1);

            let listProClone = [...listPro];
            while (!chooseEmp1 && !chooseEmp2 && listProClone.length > 0) {
                chooseEmp1 = true;
                let randomNumber1 = chooseRandom(listProClone.length);
                emp1 = listProClone[randomNumber1];
                let listOption = employeesClone[emp1]["options"];
                if (!chooseEmployee(emp1, i, listOption, date)) {
                    chooseEmp1 = false;
                }
                if (!chooseEmp1) {
                    removeEmployeeFromList(emp1, listProClone);
                    continue;
                }

                chooseEmp1 = true;
                if (emp1 === "NamNH20" || emp1 === "DatNT11") {
                    chooseEmp2 = true;
                    emp2 = emp1 === "NamNH20" ? "DatNT11" : "NamNH20";
                    let listOption = employeesClone[emp2]["options"];
                    if (!chooseEmployee(emp2, i, listOption, date)) {
                        removeEmployeeFromList(emp1, listProClone);
                        removeEmployeeFromList(emp2, listProClone);
                        chooseEmp1 = false;
                        chooseEmp2 = false;
                        continue;
                    }
                }

                let randomNumber2 = 0;
                while (!chooseEmp2 && listProClone.length > 0) {
                    chooseEmp2 = true;
                    randomNumber2 = chooseRandom(listProClone.length);
                    emp2 = listProClone[randomNumber2];
                    if (emp2 === "NamNH20" || emp2 === "DatNT11") {
                        chooseEmp2 = false;
                    }
                    if (emp1 === emp2) {
                        chooseEmp2 = false;
                    }
                    let listOption = employeesClone[emp2]["options"];
                    if (
                        employeesClone[emp1]["firstOnSecondRate"] > 1 &&
                        employeesClone[emp2]["firstOnSecondRate"] > 1
                    ) {
                        chooseEmp2 = false;
                    }
                    if (!chooseEmployee(emp2, i, listOption, date)) {
                        chooseEmp2 = false;
                    }
                    if (!chooseEmp2) {
                        removeEmployeeFromList(emp2, listProClone);
                        continue;
                    }
                    chooseEmp2 = true;
                }
                if (chooseEmp1 && chooseEmp2) {
                    schedule[i] = {};
                    schedule[i]["day"] = i + 1;

                    let rate =
                        employeesClone[emp1]["firstOnSecondRate"] -
                        employeesClone[emp2]["firstOnSecondRate"];
                    let shift1 = "";
                    let shift2 = "";
                    if (rate > 0) {
                        shift1 = emp2;
                        shift2 = emp1;
                    } else {
                        shift1 = emp1;
                        shift2 = emp2;
                    }
                    schedule[i]["firstShift"] = shift1;
                    employeesClone[shift1]["dayShift"] += 1;
                    employeesClone[shift1]["dayShiftAsFirst"] += 1;
                    employeesClone[shift1]["firstOnSecondRate"] =
                        employeesClone[shift1]["dayShiftAsFirst"] /
                        employeesClone[shift1]["dayShiftAsSecond"];
                    schedule[i]["secondShift"] = shift2;
                    employeesClone[shift2]["dayShift"] += 1;
                    employeesClone[shift2]["dayShiftAsSecond"] += 1;
                    employeesClone[shift2]["firstOnSecondRate"] =
                        employeesClone[shift2]["dayShiftAsFirst"] /
                        employeesClone[shift2]["dayShiftAsSecond"];
                    if (isWeekend(date, weekends)) {
                        employeesClone[shift1]["weekendShift"] += 1;
                        employeesClone[shift2]["weekendShift"] += 1;
                    }
                    if (
                        employeesClone[shift1]["dayShift"] ===
                        employeesClone[shift1]["maxShift"]
                    ) {
                        removeEmployeeFromList(shift1, listPro);
                    }
                    if (
                        employeesClone[shift2]["dayShift"] ===
                        employeesClone[shift2]["maxShift"]
                    ) {
                        removeEmployeeFromList(shift2, listPro);
                    }
                } else {
                    removeEmployeeFromList(emp1, listProClone);
                }
            }
        }
    }

    if (listPro.length > 0) {
        listOtherEmpG1.concat(listPro);
    }

    for (let i = 0; i < daysInMonth; i++) {
        if (!Boolean(schedule[i])) {
            let emp1 = "";
            let chooseEmp1 = false;
            let emp2 = "";
            let chooseEmp2 = false;
            let date = new Date(year, month - 1, i + 1);

            let listOtherEmpG1Clone = [...listOtherEmpG1];
            while (
                !chooseEmp1 &&
                !chooseEmp2 &&
                listOtherEmpG1Clone.length > 0
            ) {
                chooseEmp1 = true;
                let randomNumber1 = chooseRandom(listOtherEmpG1Clone.length);
                emp1 = listOtherEmpG1Clone[randomNumber1];
                let listOption = employeesClone[emp1]["options"];
                if (!chooseEmployee(emp1, i, listOption, date)) {
                    chooseEmp1 = false;
                }
                if (!chooseEmp1) {
                    removeEmployeeFromList(emp1, listOtherEmpG1Clone);
                    continue;
                }

                chooseEmp1 = true;

                let listOtherEmpG2Clone = [...listOtherEmpG2];
                let randomNumber2 = 0;

                while (!chooseEmp2 && listOtherEmpG2Clone.length > 0) {
                    chooseEmp2 = true;
                    randomNumber2 = chooseRandom(listOtherEmpG2Clone.length);
                    emp2 = listOtherEmpG2Clone[randomNumber2];
                    let listOption = employeesClone[emp2]["options"];
                    if (
                        employeesClone[emp1]["firstOnSecondRate"] > 1 &&
                        employeesClone[emp2]["firstOnSecondRate"] > 1
                    ) {
                        chooseEmp2 = false;
                    }
                    if (!chooseEmployee(emp2, i, listOption, date)) {
                        chooseEmp2 = false;
                    }
                    if (!chooseEmp2) {
                        removeEmployeeFromList(emp2, listOtherEmpG2Clone);
                        continue;
                    }
                    chooseEmp2 = true;
                    if (chooseEmp1 && chooseEmp2) {
                        schedule[i] = {};
                        schedule[i]["day"] = i + 1;
                        employeesClone[emp1]["dayWithG2"] += 1;
                        let rate =
                            employeesClone[emp1]["firstOnSecondRate"] -
                            employeesClone[emp2]["firstOnSecondRate"];
                        let shift1 = "";
                        let shift2 = "";
                        if (rate > 0) {
                            shift1 = emp2;
                            shift2 = emp1;
                        } else {
                            shift1 = emp1;
                            shift2 = emp2;
                        }
                        schedule[i]["firstShift"] = shift1;
                        employeesClone[shift1]["dayShift"] += 1;
                        employeesClone[shift1]["dayShiftAsFirst"] += 1;
                        employeesClone[shift1]["firstOnSecondRate"] =
                            employeesClone[shift1]["dayShiftAsFirst"] /
                            employeesClone[shift1]["dayShiftAsSecond"];
                        if (isWeekend(date, weekends)) {
                            employeesClone[shift1]["weekendShift"] += 1;
                            employeesClone[shift2]["weekendShift"] += 1;
                        }
                        if (
                            employeesClone[shift1]["dayShift"] ===
                            employeesClone[shift1]["maxShift"]
                        ) {
                            employeesClone[shift1]["done"] = true;
                            removeEmployeeFromList(
                                shift1,
                                rate > 0 ? listOtherEmpG2 : listOtherEmpG1
                            );
                        }

                        schedule[i]["secondShift"] = shift2;
                        employeesClone[shift2]["dayShift"] += 1;
                        employeesClone[shift2]["dayShiftAsSecond"] += 1;
                        employeesClone[shift2]["firstOnSecondRate"] =
                            employeesClone[shift2]["dayShiftAsFirst"] /
                            employeesClone[shift2]["dayShiftAsSecond"];
                        if (
                            employeesClone[shift2]["dayShift"] ===
                            employeesClone[shift2]["maxShift"]
                        ) {
                            employeesClone[shift2]["done"] = true;
                            removeEmployeeFromList(
                                shift2,
                                rate > 0 ? listOtherEmpG1 : listOtherEmpG2
                            );
                        }
                    } else {
                        removeEmployeeFromList(emp1, listOtherEmpG1Clone);
                    }
                }
            }
        }
    }

    let result = {};
    result["schedule"] = schedule;
    result["employees"] = employeesClone;

    return result;
}
