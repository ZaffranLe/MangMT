import _ from "lodash";

let schedule = [];

function checkDayOption(date, option) {
    // 15th day in month = 15
    if (date.getDate() === option) {
        return false;
    }
    return true;
}

function checkGroupOf2Emp(emp1, emp2) {
    if (emp1["group"] === 2 && emp2["group"] === 2) {
        return false;
    }
    if (emp1["group"] === 2 || emp2["group"] === 2) {
        if (emp1["dayWithG2"] === 2 || emp2["dayWithG2"] === 2) {
            return false;
        }
    }
    return true;
}

function chooseRandom(max, min = 0) {
    let randomPosition = Math.floor(Math.random() * (max - min) + min);
    return randomPosition;
}

function chooseEmployee(empId, listOption, date) {
    let day = date.getDate() - 1;
    if (day >= 0) {
        if (Boolean(schedule[day - 1])) {
            if (
                schedule[day - 1]["firstShift"] === empId ||
                schedule[day - 1]["secondShift"] === empId
            ) {
                return false;
            }
        }
        if (Boolean(schedule[day + 1])) {
            if (
                schedule[day + 1]["firstShift"] === empId ||
                schedule[day + 1]["secondShift"] === empId
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

export default function getSchedule(year, month, employees, weekends = []) {
    let failureCount = 0;
    let scheduled = false;
    const numOfDaysInMonth = new Date(year, month, 0).getDate();
    while (!scheduled) {
        scheduled = true;
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
            "DungNT173"
        ];
        if (numOfDaysInMonth === 31) {
            let randomEmp1 = chooseRandom(listEmployeeId.length, 7);
            let randomEmp2 = chooseRandom(listEmployeeId.length, 7);
            let emp1 = listEmployeeId[randomEmp1];
            let emp2 = listEmployeeId[randomEmp2];
            if (emp1 !== emp2) {
                employeesClone[emp1]["maxShift"] += 1;
                employeesClone[emp2]["maxShift"] += 1;
            }
        }
        let days = [];
        for (let i = 0; i < numOfDaysInMonth; i++) {
            days[i] = {};
            days[i]["day"] = i + 1;
            days[i]["numOfUnavailable"] = 0;
            let today = new Date(year, month, i + 1);
            days[i]["isWeekend"] = today.getDay() === 6 || today.getDay() === 0;
        }
        schedule = [];
        for (let emp of listEmployeeId) {
            for (let option of employeesClone[emp]["options"]) {
                days[option - 1]["numOfUnavailable"] += 1;
            }
        }
        days = _.reverse(_.sortBy(days, ["numOfUnavailable", "isWeekend"]));
        for (let day of days) {
            let date = new Date(year, month - 1, day["day"]);
            let emp1 = "";
            let chooseEmp1 = false;
            let emp2 = "";
            let chooseEmp2 = false;
            let listEmployeeIdClone = _.cloneDeep(listEmployeeId);
            while (
                !chooseEmp1 &&
                !chooseEmp2 &&
                listEmployeeIdClone.length > 0
            ) {
                chooseEmp1 = true;
                let randomNumber1 = chooseRandom(listEmployeeIdClone.length);
                emp1 = listEmployeeIdClone[randomNumber1];
                let listOption = employeesClone[emp1]["options"];
                if (!chooseEmployee(emp1, listOption, date)) {
                    chooseEmp1 = false;
                }
                if (
                    employeesClone[emp1]["weekendShift"] > 1 &&
                    listEmployeeIdClone.length > 1
                ) {
                    chooseEmp1 = false;
                }
                if (!chooseEmp1) {
                    removeEmployeeFromList(emp1, listEmployeeIdClone);
                    continue;
                }
                chooseEmp1 = true;
                if (emp1 === "NamNH20" || emp1 === "DatNT11") {
                    chooseEmp2 = true;
                    emp2 = emp1 === "NamNH20" ? "DatNT11" : "NamNH20";
                    let listOption = employeesClone[emp2]["options"];
                    if (!chooseEmployee(emp2, listOption, date)) {
                        removeEmployeeFromList(emp1, listEmployeeIdClone);
                        removeEmployeeFromList(emp2, listEmployeeIdClone);
                        chooseEmp1 = false;
                        chooseEmp2 = false;
                        continue;
                    }
                }
                let randomNumber2 = 0;
                while (!chooseEmp2 && listEmployeeIdClone.length > 0) {
                    chooseEmp2 = true;
                    randomNumber2 = chooseRandom(listEmployeeIdClone.length);
                    emp2 = listEmployeeIdClone[randomNumber2];
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
                    if (
                        checkGroupOf2Emp(
                            employeesClone[emp1],
                            employeesClone[emp2]
                        )
                    ) {
                        if (!chooseEmployee(emp2, listOption, date)) {
                            chooseEmp2 = false;
                        }
                    } else {
                        chooseEmp2 = false;
                    }
                    if (
                        employeesClone[emp2]["weekendShift"] > 1 &&
                        listEmployeeIdClone.length > 1
                    ) {
                        chooseEmp2 = false;
                    }
                    if (!chooseEmp2) {
                        removeEmployeeFromList(emp2, listEmployeeIdClone);
                        continue;
                    }
                    chooseEmp2 = true;
                }
                if (chooseEmp1 && chooseEmp2) {
                    let currentDay = day["day"];
                    schedule[currentDay - 1] = {};
                    schedule[currentDay - 1]["day"] = currentDay;

                    if (
                        employeesClone[emp1]["group"] === 2 ||
                        employeesClone[emp2]["group"] === 2
                    ) {
                        if (employeesClone[emp1]["group"] === 2) {
                            employeesClone[emp2]["dayWithG2"] += 1;
                        } else {
                            employeesClone[emp1]["dayWithG2"] += 1;
                        }
                    }

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
                    schedule[currentDay - 1]["firstShift"] = shift1;
                    employeesClone[shift1]["dayShift"] += 1;
                    employeesClone[shift1]["dayShiftAsFirst"] += 1;
                    employeesClone[shift1]["firstOnSecondRate"] =
                        employeesClone[shift1]["dayShiftAsFirst"] /
                        employeesClone[shift1]["dayShiftAsSecond"];
                    schedule[currentDay - 1]["secondShift"] = shift2;
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
                        employeesClone[emp1]["dayShift"] ===
                        employeesClone[emp1]["maxShift"]
                    ) {
                        employeesClone[emp1]["done"] = true;
                        removeEmployeeFromList(emp1, listEmployeeId);
                    }

                    if (
                        employeesClone[emp2]["dayShift"] ===
                        employeesClone[emp2]["maxShift"]
                    ) {
                        employeesClone[emp2]["done"] = true;
                        removeEmployeeFromList(emp2, listEmployeeId);
                    }
                } else {
                    removeEmployeeFromList(emp1, listEmployeeIdClone);
                }
            }
        }
        for (let day of schedule) {
            if (!Boolean(day)) {
                scheduled = false;
                break;
            }
        }
        let count = 0;
        Object.keys(employeesClone).forEach(emp => {
            if (employeesClone[emp]["weekendShift"] == 0) {
                count++;
            }
        });
        if (count > 1) {
            scheduled = false;
        }
        // if (scheduled || failureCount === 100) {
        if (scheduled) {
            let result = {};
            result["schedule"] = schedule;
            result["employees"] = employeesClone;
            console.log(failureCount)
            return result;
        } else {
            failureCount++;
        }
    }
}
