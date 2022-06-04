function stringtimetoSeconds(str) {
  arr = str.split(":");
  return parseInt(arr[0]) * 60 * 60 + parseInt(arr[1]) * 60 + parseInt(arr[2]);
}
function percentToStringtime(perc) {
  mode = "";
  all = Math.round((perc * 86400) / 100);
  h = Math.floor(all / 3600);
  all -= h * 3600;
  m = Math.floor(all / 60);
  all -= m * 60;
  s = all;
  if (h > 12) {
    h -= 12;
    mode = " PM";
  } else {
    mode = " AM";
  }
  if (h == 12) {
    mode = " PM";
  }
  if (h == 0) {
    h = 12;
  }
  // adding 0 if single
  if (h >= 0 && h < 10) {
    h = "0" + h;
  }
  if (m >= 0 && m < 10) {
    m = "0" + m;
  }
  if (s >= 0 && s < 10) {
    s = "0" + s;
  }
  return h + ":" + m + ":" + s + mode;
}
function secondToStringTime(sec) {
  mode = "";
  h = Math.floor(sec / 3600);
  sec -= h * 3600;
  m = Math.floor(sec / 60);
  sec -= m * 60;
  s = sec;
  if (h > 12) {
    h -= 12;
    mode = " PM";
  } else {
    mode = " AM";
  }
  if (h == 12) {
    mode = " PM";
  }
  if (h == 0) {
    h = 12;
  }
  // adding 0 if single
  if (h >= 0 && h < 10) {
    h = "0" + h;
  }
  if (m >= 0 && m < 10) {
    m = "0" + m;
  }
  if (s >= 0 && s < 10) {
    s = "0" + s;
  }

  return h + ":" + m + ":" + s + mode;
}
function secondToStringDurationTime(sec) {
  massage = "";

  h = Math.floor(sec / 3600);
  sec -= h * 3600;
  m = Math.floor(sec / 60);
  sec -= m * 60;
  s = sec;
  if (h > 0) {
    massage += h;
    massage += "h ";
  }
  if (m > 0) {
    massage += m;
    massage += "m ";
  }
  if (s > 0) {
    massage += s;
    massage += "s ";
  }
  return massage;
}
function stringTimeToInputTime(t) {
  arr = t.split(":");
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length == 1) {
      arr[i] = "0" + arr[i];
    }
  }
  return arr[0] + ":" + arr[1] + ":" + arr[2];
}

/////////////////#####################//////////////###########################
function scrapDates(obj) {
  var d1 = new Date();
  let n = 1;
  console.log(d1.getTime());
  var d2 = new Date(d1.getTime() + n * 86400000);
  // console.log(d2);
  // console.log(d2.getFullYear());
  // console.log(d2.getMonth());
  // console.log(d2.getDate());

  dates = [];
  is_there = false;

  for (let i = 0; i < obj.length; i++) {
    is_there = false;
    for (let j = 0; j < dates.length; j++) {
      if (dates[j] == obj[i].date) {
        is_there = true;
        break;
      }
    }
    if (!is_there) {
      dates.push(obj[i].date);
    }
  }
  return dates;
}
function scrapCurrentData(obj) {
  data = [];
  for (let i = 0; i < current_dates.length; i++) {
    dayly = [];
    for (let j = 0; j < obj.length; j++) {
      if (obj[j].date == current_dates[i]) {
        // dayly.push([
        //   obj[j].status_code,
        //   obj[j].time,
        //   obj[j].loc_name,
        //   obj[j].vehicle_id,
        //   obj[j].odometer,
        //   obj[j].eng_hours,
        //   obj[j].notes,
        //   obj[j].document,
        //   obj[j].trailer,
        //   obj[j].lat,
        //   obj[j].lng,
        //   obj[j].id,
        //   obj[j].status_code >= 0 && obj[j].status_code < 6
        //     ? (obj[j].type = "status")
        //     : (obj[j].type = "event"),
        // ]);
        obj[j].type = obj[j].status_code >= 0 && obj[j].status_code < 6 ? "status" : "event";
        obj[j].seconds = stringtimetoSeconds(obj[j].time);
        dayly.push(obj[j]);
      }
    }
    data.push(dayly);
  }
  return data;
}
// IN: day index, log index, type of next status ["status", "event", "any"]
// OUT: duration in seconds
function findNextLog(x, y, type) {
  is_any = false;
  //skip other steps in case type in wrong
  if (type != "status" && type != "event" && type != "any") {
    return -1;
  }
  // if any
  if (type == "any") {
    is_any = true;
  }
  //
  is_first_loop = true;
  for (let i = x; i >= 0; i--) {
    for (let j = y; j < current_data[i].length; j++) {
      if ((current_data[i][j].type == type || is_any) && !is_first_loop) {
        return [i, j];
      }
      is_first_loop = false;
      y = 0; // fixing froblem with second for loop
    }
  }
  return null;
}
function findPreviousLog(x, y, type) {
  is_any = false;
  //skip other steps in case type in wrong
  if (type != "status" && type != "event" && type != "any") {
    return -1;
  }
  // if any
  if (type == "any") {
    is_any = true;
  }
  //
  is_first_loop = true;
  for (let i = x; i < current_data.length; i++) {
    for (let j = y; j >= 0; j--) {
      if ((current_data[i][j].type == type || is_any) && !is_first_loop) {
        return [i, j];
      }
      is_first_loop = false;
      y = 0; // fixing froblem with second for loop
    }
  }
  return null;
}
function statusDuration(x, y) {
  next = findNextLog(x, y, "status");

  if (next == null) {
    duration = stringtimetoSeconds(current_time) - current_data[x][y].seconds;
  } else {
    if (next[0] != x) {
      duration = current_data[next[0]][next[1]].seconds + (24 * 60 * 60 - current_data[x][y].seconds);
      if (x - next[0] > 1) {
        duration += (x - next[0] - 1) * (24 * 60 * 60);
      }
    } else {
      duration = current_data[next[0]][next[1]].seconds - current_data[x][y].seconds;
    }
  }
  return duration;
}
function checkErrors() {}
// MAIN
function displayLogs(obj) {
  current_dates = scrapDates(obj);
  current_data = scrapCurrentData(obj);

  console.log("current_data: ", current_data);

  ///////////////////////////////////////////////////////////////////////////

  function makeGraph(i) {
    graph = "";

    left = 0;
    width = 0;

    for (let j = 0; j < current_data[i].length; j++) {
      left = (current_data[i][j].seconds * 100) / (24 * 60 * 60);

      if (current_data[i][j].type == "status") {
        next_status = findNextLog(i, j, "status");
        prew_status = findPreviousLog(i, j, "status");

        // adding first rect:
        if (j == 0) {
          graph += `
          <span class="firstRect" style="left: 0%; width: calc(${(current_data[i][j].seconds * 100) / (24 * 60 * 60)}%);">
            <span class="${prew_status == null ? span_classes[last_day_status_code] : span_classes[current_data[prew_status[0]][prew_status[1]].status_code]}"></span>
          </span>
          `;
        }
        //

        if (next_status == null) {
          width = ((stringtimetoSeconds(current_time) - current_data[i][j].seconds) * 100) / (24 * 60 * 60);
        } else {
          if (next_status[0] != i) {
            width = ((24 * 60 * 60 - current_data[i][j].seconds) * 100) / (24 * 60 * 60);
          } else {
            width = ((current_data[next_status[0]][next_status[1]].seconds - current_data[i][j].seconds) * 100) / (24 * 60 * 60);
          }
        }

        graph += `
        <span class="rect" style="left: calc(${left}%); width: calc(${width}%);">
          <span class="${span_classes[current_data[i][j].status_code]}"></span>
        </span>`;
      } else if (current_data[i][j].type == "event") {
        graph += `
          <span class="event" style="left: ${left}%;"><i class="${event_icons[current_data[i][j].status_code - 6]}"></i></span>
        `;
      }
    }

    return graph;
  }
  function rubbish() {
    graph += `<span class="firstRect" style="left: 0%; width: calc(${(status_information[i][0][1] * 100) / (24 * 60 * 60)}%);">`;
    graph += `<span class="${span_classes[before_class[i]]}"></span>`;
    graph += "</span>";

    for (let j = 0; j < status_information[i].length; j++) {
      start = (status_information[i][j][1] * 100) / (24 * 60 * 60);
      width = (status_information[i][j][2] * 100) / (24 * 60 * 60);

      graph += `<span class="rect" style="left: calc(${start}%); width: calc(${width}%);">`;

      graph += `<span  class="vertical ${vertical_classes[status_information[i][j][0]]}"  style="left: 0; top: calc(${status_information[i][j][3]}%); height: ${status_information[i][j][4]}%"></span>`;
      graph += `<span class="${span_classes[status_information[i][j][0]]}"></span>`;
      graph += "</span>";
    }

    if (status_information[i].length == 0) {
      if (n == 0) {
        graph += `<span class="firstRect" style="left: 0%; width: calc(${(stringtimetoSeconds(current_time) * 100) / (24 * 60 * 60)}%);">`;
      } else {
        graph += `<span class="firstRect" style="left: 0%; width: calc(100%);">`;
      }

      graph += `<span class="${span_classes[before_class[i]]}"></span>`;
      graph += "</span>";
    }
    // adding control-rectangle
    graph += `<div class='controller-rect' style='left: 0; width: 50%;'>
      <div class='control-time time-start'>00:00:00</div>
      <div class='control-time time-duration'>0h 0m 0s</div>
      <div class='control-time time-end'>00:00:00</div>
      <div class='control-left'></div>
      <div class='control-right'></div>
    </div>`;
  }
  /////////////////////////////////////////////////////////////////////

  function makeTable(i) {
    let table = "";

    // adding main table
    for (let j = 0; j < current_data[i].length; j++) {
      table += `<tr>
          <td>${j + 1}</td>
          <td>${statuses[current_data[i][j].status_code]}</td>
          <td>${current_data[i][j].time}</td>
          <td>${current_data[i][j].type == "status" ? secondToStringDurationTime(statusDuration(i, j)) : ""}</td>
          <td>${current_data[i][j].loc_name}</td>
          <td>${current_data[i][j].vehicle_id}</td>
          <td>${current_data[i][j].odometer}</td>
          <td>${current_data[i][j].eng_hours}</td>
          <td>${current_data[i][j].notes}</td>
          <td>${current_data[i][j].document}</td>
          <td>${current_data[i][j].trailer}</td>
          <td class="log-events">
            <i class="fa-solid fa-pen" onclick="edit_event('${i}:${j}')"></i>
            <i class="fa-solid fa-copy" onclick="copy_event('${i}:${j}')"></i>
            <i class="fa-solid fa-trash" onclick="delete_event('${i}:${j}')"></i>
          </td>
        </tr>`;
    }
    table = `<table class='main-table'>
        <thead>
          <tr>
            <td>№</td>
            <td>STATUS</td>
            <td>Time (EST)</td>
            <td>Duration</td>
            <td>Location</td>
            <td>Vehicle</td>
            <td>Odometer</td>
            <td>Engine Hours</td>
            <td>Notes</td>
            <td>Document</td>
            <td>Trailer</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          ${table}
        </tbody>
      </table>`;

    return table;
  }
  // creating child for Div wich have class called ALLUNITS
  let graphics = "";

  for (let i = 0; i < current_data.length; i++) {
    graphics += `
      <div class="graphics">
        <p>${current_dates[i]}</p>
        <div class="graph"><img src="/static/images/graph_day.svg" alt="main" /><div class="statusWrapper">
        ${makeGraph(i)}
        </div>
      </div>
      <div class="control-buttons">
        <button class='showBtn'>Show Logs <i class='fas fa-angle-double-down'></i></button>
        <button class='addBtn' onclick="add_button(${i})">Add Log <i class="fa-solid fa-circle-plus"></i></i></button>
      </div>
      <div class = 'addLogForm'></div>
        ${makeTable(i)}
      </div>`;
  }

  const allUnits = document.getElementById("AllUnits");
  allUnits.innerHTML = graphics;

  ///////////////////////////////////////////////////
}

function getCSRF() {
  arr = document.getElementById("csrf").innerHTML.split("value");
  arr = arr[1].split('"');
  return arr[1];
}

function get(driver) {
  current_driver = driver;
  console.log("DRIVER: ", driver);
  document.getElementById("table").style.display = "none";
  document.getElementById("navbar").style.display = "flex";
  document.getElementById("AllUnits").style.display = "block";

  fetch(current_driver)
    .then((res) => res.json())
    .then((data) => {
      console.log("json data: ", data);
      displayLogs(data);
    });
}

function post(obj) {
  fetch(current_driver, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(obj),
  })
    .catch((error) => console.log("ERROR", error))

    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log("DATA_OK?: ", data);
      get(current_driver);
    });
}

function put_request(obj) {
  fetch(current_driver, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(obj),
  })
    .catch((error) => console.log("ERROR", error))

    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log("UPDATED?: ", data);
      get(current_driver);
    });
}

function delete_request(id) {
  fetch(current_driver, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      id: id,
    }),
  })
    .catch((error) => console.log("ERROR", error))

    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log("DATA_DELETED?: ", data);
      get(current_driver);
    });
}

function activate_button(code) {
  for (let i = 0; i < 6; i++) {
    document.getElementById("statusContainer").children[i].className = "";
    document.getElementById("logContainer").children[i].className = "";
  }

  if (code >= 0 && code < 6) {
    document.getElementById("statusContainer").children[code].className = "active";
  } else if (code >= 6 && code < 12) {
    document.getElementById("logContainer").children[code - 6].className = "active";
  }
}
function edit_event(str) {
  console.log(str);
  arr = [];
  arr = str.split(":");

  add_button(parseInt(arr[0]));

  data_obj = current_data[parseInt(arr[0])][parseInt(arr[1])];

  document.getElementById("time-start").value = data_obj.time;
  document.getElementById("loc-name").value = data_obj.loc_name;
  document.getElementById("lat").value = data_obj.lat;
  document.getElementById("lng").value = data_obj.lng;
  document.getElementById("odom").value = data_obj.odometer;
  document.getElementById("eng-h").value = data_obj.eng_hours;
  document.getElementById("note").value = data_obj.notes;
  document.getElementById("unit-num").value = data_obj.vehicle_id;
  document.getElementById("ship-doc").value = data_obj.document;
  document.getElementById("trail").value = data_obj.trailer;
  current_log_id = data_obj.id;
  post_or_put = false;
  current_status_code = data_obj.status_code;
  activate_button(data_obj.status_code);
}
function copy_event(str) {
  console.log(str);
}
function delete_event(str) {
  arr = [];
  arr = str.split(":");
  delete_request(current_data[parseInt(arr[0])][parseInt(arr[1])].id);
}
function add_button(int) {
  post_or_put = true;
  console.log(int);

  for (let i = 0; i < changeLogForms.length; i++) {
    changeLogForms[i].style.display = "none";
    changeLogForms[i].innerHTML = "";
  }
  changeLogForms[int].style.display = "block";

  content = `
  <div id="statusContainer">
  <button onclick="change_status_apply(0)">OFF <i class="fa-solid fa-power-off"></i></button>
  <button onclick="change_status_apply(1)">SB <i class="fa-solid fa-bed"></i></button>
  <button onclick="change_status_apply(2)">DR <i class="fa-solid fa-road"></i></button>
  <button onclick="change_status_apply(3)">ON <i class="fa-solid fa-briefcase"></i></button>
  <button onclick="change_status_apply(4)">PC <i class="fa-solid fa-road"></i></button>
  <button onclick="change_status_apply(5)">YM <i class="fa-solid fa-truck-ramp-box"></i></button>
</div>
<div id="logContainer">
  <button onclick="change_status_apply(6)">Power On <i class="fa-solid fa-key"></i></button>
  <button onclick="change_status_apply(7)">Power Off <i class="fa-solid fa-key"></i></button>
  <button onclick="change_status_apply(8)">Intermediate <i class="fa-solid fa-map-pin"></i></button>
  <button onclick="change_status_apply(9)">Certification <i class="fa-solid fa-pen-fancy"></i></button>
  <button onclick="change_status_apply(10)">Log In <i class="fa-solid fa-right-to-bracket"></i></button>
  <button onclick="change_status_apply(11)">Log Out <i class="fa-solid fa-right-from-bracket"></i></button>
</div>
<div class="forms">
  <div class="form-item">
    <div class="form-item-title">Date</div>
    <div class="form-item-field">
      <input type="date" / id="date" value="2022-01-01">
    </div>
  </div>
  <div class="form-item">
    <div class="form-item-sub">
      <div class="form-item-title">From</div>
      <div class="form-item-field">
        <input type="time" step="1" id="time-start"/>
      </div>
    </div>
    <div class="form-item-sub">
      <div class="form-item-title">To</div>
      <div class="form-item-field">
        <input type="time" step="1"  id="time-end"/>
      </div>
    </div>
  </div>
  
  <div class="form-item">
    <div class="form-item-title">Location name</div>
    <div class="form-item-field">
      <input id="loc-name"/>
    </div>

    <button>Get Coordinates</button>
  </div>
  <div class="form-item">
    <div class="sub-container">
      <div class="form-item-sub">
        <div class="form-item-title">Lat</div>
        <div class="form-item-field">
          <input id="lat" type="number" />
        </div>
      </div>
      <div class="form-item-sub">
        <div class="form-item-title">Lng</div>
        <div class="form-item-field">
          <input id="lng" type="number" />
        </div>
      </div>
    </div>

    <button>Get location</button>
  </div>
  <div class="form-item">
    <div class="form-item-title">Odometer</div>
    <div class="form-item-field">
      <input type="number" id="odom"/>
    </div>
  </div>
  <div class="form-item">
    <div class="form-item-title">Eng. hours</div>
    <div class="form-item-field">
      <input type="number" id="eng-h" />
    </div>
  </div>
  <div class="form-item">
    <div class="form-item-title">Note</div>
    <div class="form-item-field">
      <input id="note" />
    </div>
  </div>
  <div class="form-item">
    <div class="form-item-title">Truck ID</div>
    <div class="form-item-field">
      <input type="number" id="unit-num" />
    </div>
  </div>
  <div class="form-item">
    <div class="form-item-title">Shipping Doc.</div>
    <div class="form-item-field">
      <input id="ship-doc" />
    </div>
  </div>
  <div class="form-item">
    <div class="form-item-title">Trailer</div>
    <div class="form-item-field">
      <input  id="trail"/>
    </div>
  </div>
</div>
<div class="button-container">
  <button onclick="applyAdd()">Apply</button>
  <button onclick="cancelAdd()">Cancel</button>
</div>
  `;
  changeLogForms[int].innerHTML = content;
  document.getElementById("date").value = current_dates[int];
  activate_button(current_status_code);
}

function change_status_apply(code) {
  current_status_code = code;
  activate_button(code);
}
function applyAdd() {
  addLogObj = {
    status_code: current_status_code,
    date: document.getElementById("date").value,
    time: document.getElementById("time-start").value,
    loc_name: document.getElementById("loc-name").value,
    lat: parseInt(document.getElementById("lat").value),
    lng: parseInt(document.getElementById("lng").value),
    odometer: parseInt(document.getElementById("odom").value),
    eng_hours: parseInt(document.getElementById("eng-h").value),
    notes: document.getElementById("note").value,
    vehicle_id: parseInt(document.getElementById("unit-num").value),
    document: document.getElementById("ship-doc").value,
    trailer: document.getElementById("trail").value,
    driver_id: current_driver,
  };
  console.log("post_or_put", post_or_put);
  if (post_or_put) {
    post(addLogObj);
  } else {
    addLogObj.id = current_log_id;
    put_request(addLogObj);
  }
  console.log("addLogObj", addLogObj);
  //get(current_driver);
  //get()
}
function cancelAdd() {
  for (let i = 0; i < changeLogForms.length; i++) {
    changeLogForms[i].style.display = "none";
    changeLogForms[i].innerHTML = "";
  }
}
//
//
//
//
//
//
//
//
//
const statuses = [
  "Off duty", //0
  "Sleep", //1
  "Driving", //2
  "On duty", //3
  "PC", //4
  "YM", //5
  "Power On", //6
  "Power Off", //7
  "Intermediate", //8
  "Certification", //9
  "Log in", //10
  "Log out", //11
];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const span_classes = ["off", "sleep", "driving", "on", "pc", "ym"];
const vertical_classes = ["vOff", "vSB", "vDR", "vOn", "vOff", "vOn"];
const controller_colors = ["rgba(128, 128, 128, 0.5)", "rgba(217, 177, 0, 0.5)", "rgba(0, 179, 15, 0.5)", "rgba(0, 124, 196, 0.5)", "rgba(128, 128, 128, 0.5)", "rgba(0, 124, 196, 0.5)"];
const event_icons = ["fa-solid fa-key", "fa-solid fa-key", "fa-solid fa-map-pin", "fa-solid fa-pen-fancy", "fa-solid fa-right-to-bracket", "fa-solid fa-right-from-bracket"];
//get(current_driver);

let current_driver = null;
let current_status_code = 0;
let current_dates = [];
let current_log_id = null;
let current_data;
let full_time = new Date();
let current_time = full_time.toTimeString();
let current_date = "2022-03-03";
let last_day_status_code = 1;
let csrftoken = getCSRF();

let post_or_put = false; // true -> POST // false -> PUT
const changeLogForms = document.getElementsByClassName("addLogForm");
