import React from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import getSchedule from "./schedule-algorithm";
import {
    Grid,
    Input,
    Segment,
    Header,
    Button,
    Tab,
    Table,
    Modal
} from "semantic-ui-react";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
const DragAndDropCalendar = withDragAndDrop(Calendar);

const empColor = {
    NamNH20: {
        color: "black",
        bgColor: "#00aa99"
    },
    DatNT11: {
        color: "black",
        bgColor: "#ff6600"
    },
    GiangHT7: {
        color: "black",
        bgColor: "#ffcc33"
    },
    VanQTH: {
        color: "black",
        bgColor: "#ffccff"
    },
    TungPT15: {
        color: "white",
        bgColor: "#000"
    },
    ToanNV32: {
        color: "white",
        bgColor: "#999"
    },
    ThoVH3: {
        color: "black",
        bgColor: "#9999ff"
    },
    LucNV6: {
        color: "white",
        bgColor: "#00cc00"
    },
    LongTT2: {
        color: "black",
        bgColor: "#ccff00"
    },
    AnhNTV9: {
        color: "black",
        bgColor: "#999966"
    },
    TuanNA106: {
        color: "black",
        bgColor: "#00ffff"
    },
    SangDV4: {
        color: "white",
        bgColor: "#336600"
    },
    ThuyNN9: {
        color: "black",
        bgColor: "#dddddd"
    },
    HuanHV3: {
        color: "black",
        bgColor: "#ffcccc"
    },
    TuTT17: {
        color: "white",
        bgColor: "#0066cc"
    },
    DungNT173: {
        color: "black",
        bgColor: "#ff3399"
    },
    TuanLPM: {
        color: "black",
        bgColor: "#ff9933"
    }
};

moment.locale("vi-VN");
const localizer = momentLocalizer(moment);

let allViews = Object.keys(Views).map(k => Views[k]);

const ColoredDateCellWrapper = ({ children }) =>
    React.cloneElement(React.Children.only(children), {
        style: {
            backgroundColor: "lightblue"
        }
    });

class EmpModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal>
        
      </Modal>
    );
  }
}

class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            employees: {}
        };
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    createSchedule = () => {
        const { year, month } = this.state;
        const result = getSchedule(this.state.year, this.state.month);
        const events = [];
        for (let day of result["schedule"]) {
            const event1 = {};
            const event2 = {};
            if (Boolean(day)) {
                event1["title"] = day["firstShift"];
                event1["start"] = new Date(
                    year,
                    month - 1,
                    day["day"],
                    7,
                    0,
                    0,
                    0
                );
                event1["end"] = new Date(
                    year,
                    month - 1,
                    day["day"],
                    9,
                    0,
                    0,
                    0
                );
                events.push(event1);
                event2["title"] = day["secondShift"];
                event2["start"] = new Date(
                    year,
                    month - 1,
                    day["day"],
                    11,
                    0,
                    0,
                    0
                );
                event2["end"] = new Date(
                    year,
                    month - 1,
                    day["day"],
                    13,
                    0,
                    0,
                    0
                );
                events.push(event2);
            }
        }
        this.setState({
            events,
            employees: result["employees"]
        });
    };

    moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
        const { events } = this.state;

        const idx = events.indexOf(event);
        let allDay = event.allDay;

        if (!event.allDay && droppedOnAllDaySlot) {
            allDay = true;
        } else if (event.allDay && !droppedOnAllDaySlot) {
            allDay = false;
        }

        const updatedEvent = { ...event, start, end, allDay };

        const nextEvents = [...events];
        nextEvents.splice(idx, 1, updatedEvent);

        this.setState({
            events: nextEvents
        });
    };

    handleSelect = ({ start, end }) => {
        const title = window.prompt("Employee ID");
        if (title)
            this.setState({
                events: [
                    ...this.state.events,
                    {
                        start,
                        end,
                        title
                    }
                ]
            });
    };

    render() {
        const { employees } = this.state;
        const rows = [];
        Object.keys(employees).forEach((emp, index) => {
            rows.push(
                <Table.Row key={index}>
                    <Table.Cell
                        style={{
                            backgroundColor: empColor[emp]["bgColor"],
                            color: empColor[emp]["color"]
                        }}
                    >
                        {emp}
                    </Table.Cell>
                    <Table.Cell>{employees[emp].group}</Table.Cell>
                    <Table.Cell>
                        {employees[emp].dayShift} - Max:{" "}
                        {employees[emp].maxShift}
                    </Table.Cell>
                    <Table.Cell>
                        {employees[emp].dayShiftAsFirst - 1}
                    </Table.Cell>
                    <Table.Cell>
                        {employees[emp].dayShiftAsSecond - 1}
                    </Table.Cell>
                    <Table.Cell>{employees[emp].dayWithG2}</Table.Cell>
                    <Table.Cell>{employees[emp].weekendShift}</Table.Cell>
                    <Table.Cell>
                        {employees[emp].done ? "True" : "False"}{" "}
                    </Table.Cell>
                </Table.Row>
            );
        });

        const panes = [
            {
                menuItem: "Schedule",
                render: () => (
                    <Segment>
                        <DragAndDropCalendar
                            selectable
                            onEventDrop={this.moveEvent}
                            style={{ height: 700 }}
                            events={this.state.events}
                            views={allViews}
                            step={60}
                            max={new Date()}
                            defaultDate={new Date()}
                            components={{
                                timeSlotWrapper: ColoredDateCellWrapper
                            }}
                            onSelectSlot={this.handleSelect}
                            localizer={localizer}
                            eventPropGetter={event => {
                                return {
                                    style: {
                                        backgroundColor:
                                            empColor[event.title]["bgColor"],
                                        color: empColor[event.title]["color"]
                                    }
                                };
                            }}
                        />
                    </Segment>
                )
            },
            {
                menuItem: "Info",
                render: () => (
                    <Segment>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>ID</Table.HeaderCell>
                                    <Table.HeaderCell>Group</Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Number of shift
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        As first
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        As second
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Shift with group 2
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Shift on weekend
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>Done</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {rows.map(row => {
                                    return row;
                                })}
                            </Table.Body>
                        </Table>
                    </Segment>
                )
            }
        ];
        return (
            <>
                <Segment>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <Header>NOC NET Scheudle</Header>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Input
                                    type="number"
                                    name="year"
                                    label="Year"
                                    min={new Date().getFullYear()}
                                    onChange={this.handleChange}
                                    value={this.state.year}
                                />
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Input
                                    type="number"
                                    name="month"
                                    label="Month"
                                    min={1}
                                    max={12}
                                    onChange={this.handleChange}
                                    value={this.state.month}
                                />
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Button
                                    onClick={this.createSchedule}
                                    positive
                                    content="Create schedule"
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Segment>
                    <Tab panes={panes} />
                </Segment>
            </>
        );
    }
}

export default Schedule;
