var userLists;
var userLists2;
var groupedList;
var levelsData;
var filteredUsers = [];
var amountScrolled = 200;
var amountScrolledNav = 25;
var filteredData;
function LoadUsers() {
  $.ajax({
    type: "GET",
    url:
      "https://imprs.is.mpg.de/websites/imprs-is-international-max-planck-research-school-for-intelligent-systems/pages/people-poc/page_sections/1236.json",
    dataType: "json",
    success: function (data) {
      $(function () {
        //get custom template
        levelsData = data.page_section.section_type.levels;
        createFilterItem(levelsData);
        userLists = data.page_section.section_type.people;
        userLists2 = userLists;
        groupedList = userLists;
        createList(userLists);
      });
    },
    error: function () {
      alert("some thing goes wrong");
    },
  });
}
function createFilterItem(filterItems) {
  var source = $("#levels-filter-item").html();
  $("#levels-filter").html("");
  var template = Handlebars.compile(source);
  $("#levels-filter").html(template(filterItems));
  $("#levels-filter a").first().addClass("active");
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
      if (element != "") {
        filteredData = groupedList.filter(
          (item) =>
            item.full_name.toUpperCase().includes(element) ||
            item.research_area.toUpperCase().includes(element) ||
            item.institute.toUpperCase().includes(element)
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

$(document).on("click", ".filter-group a", function () {
  $("#search").val("");
  $("a").not(this).removeClass("active");
  $(this).toggleClass("active");
  if ($(this).text() === "All") {
    groupedList = userLists;
    createList(userLists);
  } else {
    userLists2 = userLists.filter((item) => item.level === $(this).text());
    groupedList = userLists2;
    createList(userLists2);
  }
});
