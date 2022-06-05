// function getNewPageID() {
//   fetch("/telesam/get-new-id/")
//     .then((res) => res.json())
//     .then((data) => {
//       console.log("json data: ", data);
//     });
// }
// getNewPageID();
// function bell(id, icon) {
//     if (icon.classList.value == "fa-solid fa-bell-slash") {
//       icon.classList.value = "fa-solid fa-bell";
//       post(id, true);
//     } else {
//       icon.classList.value = "fa-solid fa-bell-slash";
//       post(id, false);
//     }
//   }
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
        <tr>
          <td>${data[i].time}</td>
          <td>${data[i].text}</td>
          <td class = 'highLited'><a href='https://t.me/c/${data[i].channel_id}/${data[i].message_id}' target="_blank"><i class="fa-solid fa-arrow-right"></i></a></td>
        </tr>
      `;
      // console.log(data[i]);
    }
    document.getElementById("tbody").innerHTML = body;
    // sortTable();
  }
  function get() {
    fetch("/get-data/")
      .then((res) => res.json())
      .then((data) => {
        console.log("json data: ", data.length);
        update(data);
        // document.getElementById("num-trucks").innerText = data.num.trucks;
        // document.getElementById("num-trailers").innerText = data.num.trailers;
      });
  }
  get();
  setInterval(get, 30000);
  
  function post(id, alarm) {
    fetch("/samsara/get-data/", {
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
      td1 = tr[i].getElementsByTagName("td")[6];
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
  