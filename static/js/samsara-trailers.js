var signalAudio = document.getElementById("signalAudio");
function bell(id, icon) {
  if (icon.classList.value == "fa-solid fa-bell-slash") {
    icon.classList.value = "fa-solid fa-bell";
    post(id, true);
  } else {
    icon.classList.value = "fa-solid fa-bell-slash";
    post(id, false);
  }
}
// function lock(id, lock) {
//   if (lock.classList.value == "fa-solid fa-lock-open") {
//     lock.classList.value = "fa-solid fa-lock";
//   } else {
//     lock.classList.value = "fa-solid fa-lock-open";
//   }
// }
function getCSRF() {
  arr = document.getElementById("csrf").innerHTML.split("value");
  arr = arr[1].split('"');
  return arr[1];
}
function update(data) {
  body = "";
  for (let i = 0; i < data.length; i++) {
    body += `
        <tr${data[i].alarm_signal ? " class='danger'" : data[i].speedMilesPerHour != 0 ? " class='light-yellow'" : ""}>
          <td>n</td>
          <td>${data[i].name}</td>
          <td>${data[i].latitude}</td>
          <td>${data[i].longitude}</td>
          <td>${Math.round(data[i].speedMilesPerHour * 100) / 100}</td>
          <td>${data[i].location}</td>
          <td>${Math.round(data[i].timeMs / (1000 * 60 * 60))}</td>
          <td  class="highLited">
            <i class="fa-solid fa-bell${data[i].alarm ? "" : "-slash"}" onclick="bell(${data[i].id}, this)"></i>
          </td>
        </tr>
        `;
    console.log(data[i].alarm_signal);
    if (data[i].alarm_signal) {
      signalAudio.play();
    }
  }
  document.getElementById("tbody").innerHTML = body;
  sortTable();
}
function get() {
  fetch("/samsara/get-trailers/")
    .then((res) => res.json())
    .then((data) => {
      //   console.log("json data: ", data);
      update(data.trailers);
      document.getElementById("num-trucks").innerText = data.num.trucks;
      document.getElementById("num-trailers").innerText = data.num.trailers;
    });
}
get();
setInterval(get, 4000);

function post(id, alarm) {
  fetch("/samsara/get-trailers/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRF(),
    },
    body: JSON.stringify({
      id: id,
      alarm: alarm,
    }),
  })
    .catch((error) => {
      console.log("ERROR", error);
      window.alert(error);
    })

    .then((data) => {
      console.log("DATA_OK?: ", data);
      if (data.status != 200) {
        window.alert("Uncompleted Submit!!!");
      }
    });
}
///
function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("tbody");
  switching = true;
  /*Make a loop that will continue until
    no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    // console.log(table.rows);
    /*Loop through all table rows (except the
      first, which contains table headers):*/
    for (i = 0; i < rows.length - 1; i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
        one from current row and one from the next:*/

      x = rows[i].getElementsByTagName("TD")[1];
      y = rows[i + 1].getElementsByTagName("TD")[1];
      //check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
  for (i = 0; i < rows.length; i++) {
    rows[i].children[0].innerText = i + 1;
  }
  search();
}
function search() {
  // Declare variables
  var input, filter, table, tr, td1, td2, i, txtValue;
  input = document.getElementById("search-input");
  filter = input.value.toUpperCase();
  table = document.getElementById("tbody");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td1 = tr[i].getElementsByTagName("td")[5];
    if (td1) {
      txtValue = td1.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
