import React, { Component, Fragment } from "react";
import XLSX from "xlsx";
import { Input, Button, Grid, Segment, Header, Table, Message } from "semantic-ui-react";
class ExcelToJson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workbook: "",
      data: "",
      titleStart: "",
      titleEnd: "",
      titleLine: "",
      dataLineStart: "",
      dataLineEnd: "",
      sheetName: ""
    };
  }

  handleChangeFile = e => {
    var files = e.target.files,
      f = files[0];
    var reader = new FileReader();
    let obj = {};
    reader.onload = function(e) {
      let data = new Uint8Array(e.target.result);
      let workbook = XLSX.read(data, { type: "array" });
      obj["sheetNames"] = workbook["SheetNames"];
      obj["sheets"] = workbook["Sheets"];
    };
    reader.readAsArrayBuffer(f);
    this.setState({
      workbook: obj
    });
    console.log(obj);
  };

  handleConvertToTable = () => {
    let titles = [];
    let titleStart = "G";
    let titleEnd = "P";
    let titleLine = 3;
    let sheetName = "Kho NOC Hà Nội";
    const { workbook } = this.state;
    const from = workbook["sheets"][sheetName]["J2"]["w"];
    const to = workbook["sheets"][sheetName]["M2"]["w"];
    for (let i = titleStart.charCodeAt(0); i <= titleEnd.charCodeAt(0); i++) {
      let cell = String.fromCharCode(i) + titleLine;
      titles.push(workbook["sheets"][sheetName][cell]["w"]);
    }
    let rows = [];
    let dataLineStart = titleLine + 1;
    while (true) {
      let row = [];
      for (let i = titleStart.charCodeAt(0); i <= titleEnd.charCodeAt(0); i++) {
        let cell = String.fromCharCode(i) + dataLineStart;
        if (Boolean(workbook["sheets"][sheetName][cell])) {
          row.push(workbook["sheets"][sheetName][cell]["w"]);
        } else {
          row.push("");
        }
      }
      if (row.join("") === "") {
        break;
      }
      dataLineStart++;
      rows.push(row);
    }
    console.log(rows);
    let data = {};
    data["titles"] = titles;
    data["rows"] = rows;
    this.setState({
      data,
      from,
      to
    });
  };

  render() {
    const { data, from, to } = this.state;
    return (
      <Fragment>
        <Segment>
          <Header>Convert Excel to Json</Header>
        </Segment>

        <Segment>
          <Input label="File to convert" type="file" onChange={this.handleChangeFile} />{" "}
          <Button onClick={this.handleConvertToTable} color="teal">
            Convert
          </Button>
        </Segment>
        <Segment>
          {data !== "" ? (
            <>
              <Input value={from} label="From" size="large" />{" "}
              <Input value={to} label="To" size="large" />
              <Table celled striped>
                <Table.Header>
                  <Table.Row>
                    {data["titles"].map((title, index) => {
                      return (
                        <Table.HeaderCell key={index} title={title}>
                          {title}
                        </Table.HeaderCell>
                      );
                    })}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data["rows"].map((row, index) => {
                    return (
                      <Table.Row key={index}>
                        {row.map((cell, idx) => {
                          return (
                            <Table.Cell key={idx} title={cell}>
                              {cell}
                            </Table.Cell>
                          );
                        })}
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </>
          ) : (
            <Message warning>
              <Message.Header>Nothing to display!</Message.Header>
            </Message>
          )}
        </Segment>
      </Fragment>
    );
  }
}

export default ExcelToJson;
