const form = document.getElementById("form");
let disappeared = false;
let current_driver;
function modify(e, id) {
  current_driver = id;
  // var this_row = e.parentElement.parentElement;
  // var rows = document.getElementById("tbody").children;
  // console.log(Array.prototype.indexOf.call(rows, this_row));
  document.getElementById("full-name").innerHTML = `<h3>${e.parentElement.parentElement.children[0].innerText} ${e.parentElement.parentElement.children[1].innerText}</h3>`;
  // console.log(e.parentElement.parentElement.children[0].innerText);

  disappeared = false;
  form.style.display = "block";
  form.classList.toggle("active");
}
function archive(id) {
  location.href = "/budget/archive/" + id;
}
function driver_detail(id) {
  location.href = "/budget/driver-detail/" + id;
}
function user_detail(id) {
  location.href = "/budget/user-detail/" + id;
}
function deactivate_driver(id) {
  location.href = "/budget/deactivate-driver/" + id;
}
function activate_driver(id) {
  location.href = "/budget/activate-driver/" + id;
}
function submit() {
  fetch(current_driver, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRF(),
    },
    body: JSON.stringify({
      amount: parseFloat(document.getElementById("input-amount").value),
      budget_type: document.getElementById("budget-type").value,
      bol_number: document.getElementById("bol-number").value,
      pcs_number: document.getElementById("pcs-number").value,
      note: document.getElementById("note").value,
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
      } else {
        document.getElementById("input-amount").value = "";
        document.getElementById("budget-type").value = "D";
        document.getElementById("bol-number").value = "";
        document.getElementById("pcs-number").value = "";
        document.getElementById("note").value = "";
        //
        cancel();
        location.reload();
      }
    });
}
function cancel() {
  form.classList.toggle("inactive");
  disappeared = true;
}
form.onanimationend = () => {
  if (disappeared) {
    form.style.display = "none";
    form.classList = "";
  }
};
function getCSRF() {
  arr = document.getElementById("csrf").innerHTML.split("value");
  arr = arr[1].split('"');
  return arr[1];
}

function search() {
  // Declare variables
  var input, filter, table, tr, td1, td2, i, txtValue;
  var odd = true;
  input = document.getElementById("search-input");
  filter = input.value.toUpperCase();
  table = document.getElementById("tbody");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    tr[i].classList = "";
  }
  for (i = 0; i < tr.length; i++) {
    td1 = tr[i].getElementsByTagName("td")[0];
    td2 = tr[i].getElementsByTagName("td")[1];
    if (td1 || td2) {
      txtValue = td1.innerText + td2.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";

        if (odd) {
          odd = false;
          tr[i].classList.toggle("darker");
        } else {
          odd = true;
        }
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
search();
