var userLists;
var userLists2;
var groupedList;

var filteredUsers = [];
var amountScrolled = 200;
var amountScrolledNav = 25;
var filteredData;
function LoadUsers() {
  $.ajax({
    type: "GET",
    url:
      "https://randomuser.me/api/?results=50",
    dataType: "json",
    success: function (data) {
      $(function () {
      
        userLists = data.results;
        createList(userLists);
      });
    },
    error: function () {
      alert("some thing goes wrong");
    },
  });
}

function createList(users) {
  var source = $("#userList").html();
  $("#delCard1").html("");
  var template = Handlebars.compile(source);

  $("#delCard1").append(template(users));
}
$(document).ready(function () {
  LoadUsers();

  $('[data-toggle="popover"]').popover({
    placement: "top",
    trigger: "hover",
    background: "#00C1CB",
  });
  $("#search").keyup(function (e) {
    let searchText = $(this).val().toUpperCase();

    let searchArray = searchText.split(" ");

    for (const element of searchArray) {
      if (element != "" ) {
        filteredData = userLists.filter(
          (item) =>
            item.name.first.toUpperCase().includes(element) ||
            item.email.toUpperCase().includes(element) ||
            item.name.last.toUpperCase().includes(element) ||
            item.location.city.toUpperCase().includes(element)
        );
      }
      $.each(filteredData, function (i, request) {
        if (!filteredUsers.includes(request)) {
          filteredUsers.unshift(request);
        }
      });
    }
    createList(filteredUsers);
    filteredUsers.length = 0;
  });

  $("#search").keyup(function () {
    if (this.value == "") {
      filteredUsers.length = 0;
      createList(userLists);
    }
  });

  document.addEventListener("search", function () {
    filteredUsers.length = 0;
    createList(userLists);
  });

  $(window).scroll(function () {
    if ($(window).scrollTop() > amountScrolled) {
      $("button.back-to-top").addClass("show");
    } else {
      $("button.back-to-top").removeClass("show");
    }
  });
  $("button.back-to-top").click(function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      800
    );
    return false;
  });
});


