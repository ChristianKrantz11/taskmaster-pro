var LISTS = ["toDo", "inProgress", "inReview", "done"];
var SOON_DAYS = 2;
var tasks = {};

// Accepts "YYYY-MM-DD" (date input) or "MM/DD/YYYY" (older saved tasks)
var parseDate = function(value) {
  if (!value) return null;
  var parts;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    parts = value.split("-");
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
    parts = value.split("/");
    return new Date(parts[2], parts[0] - 1, parts[1]);
  }
  return null;
};

var toInputDate = function(value) {
  var date = parseDate(value);
  if (!date) return "";
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var day = String(date.getDate()).padStart(2, "0");
  return date.getFullYear() + "-" + month + "-" + day;
};

var formatDate = function(value) {
  var date = parseDate(value);
  return date ? date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : value;
};

// Highlight tasks that are overdue or due soon (tasks in Done are never flagged)
var auditTask = function(taskLi, list) {
  taskLi.removeClass("list-group-item-warning list-group-item-danger");
  if (list === "done") return;

  var date = parseDate(taskLi.data("date"));
  if (!date) return;

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var daysLeft = Math.round((date - today) / 86400000);

  if (daysLeft < 0) {
    taskLi.addClass("list-group-item-danger");
  } else if (daysLeft <= SOON_DAYS) {
    taskLi.addClass("list-group-item-warning");
  }
};

var createTask = function(taskText, taskDate, list) {
  var taskLi = $("<li>").addClass("list-group-item task").data("date", taskDate);
  var header = $("<div>").addClass("d-flex justify-content-between align-items-center");
  var dateBadge = $("<span>")
    .addClass("badge badge-primary badge-pill task-date")
    .attr({ tabindex: 0, title: "Click to change the due date" })
    .text(formatDate(taskDate));
  var deleteBtn = $("<button>")
    .attr({ type: "button", "aria-label": "Delete task" })
    .addClass("close delete-task")
    .html("&times;");
  var taskP = $("<p>")
    .addClass("m-1 task-text")
    .attr({ tabindex: 0, title: "Click to edit" })
    .text(taskText);

  header.append(dateBadge, deleteBtn);
  taskLi.append(header, taskP);
  $("#list-" + list).append(taskLi);
  auditTask(taskLi, list);
};

var loadTasks = function() {
  try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || {};
  } catch (e) {
    tasks = {};
  }

  LISTS.forEach(function(list) {
    if (!Array.isArray(tasks[list])) tasks[list] = [];
    $("#list-" + list).empty();
    tasks[list].forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Rebuild the tasks object from what's on the page, then save it
var syncFromPage = function() {
  LISTS.forEach(function(list) {
    tasks[list] = $("#list-" + list).children(".task").map(function() {
      return {
        text: $(this).find(".task-text").text().trim(),
        date: $(this).data("date")
      };
    }).get();
  });
  saveTasks();
};

var listOf = function(element) {
  return $(element).closest(".task-list").data("list");
};

// ---------- add task ----------

$("#task-form-modal").on("show.bs.modal", function() {
  $("#modalTaskDescription, #modalDueDate").val("");
});

$("#task-form-modal").on("shown.bs.modal", function() {
  $("#modalTaskDescription").trigger("focus");
});

$("#task-form").on("submit", function(event) {
  event.preventDefault();
  var taskText = $("#modalTaskDescription").val().trim();
  var taskDate = $("#modalDueDate").val();
  if (!taskText || !taskDate) return;

  createTask(taskText, taskDate, "toDo");
  tasks.toDo.push({ text: taskText, date: taskDate });
  saveTasks();
  $("#task-form-modal").modal("hide");
});

// ---------- edit task text ----------

var startTextEdit = function() {
  var text = $(this).text().trim();
  var textInput = $("<textarea>").addClass("form-control").val(text);
  $(this).replaceWith(textInput);
  textInput.trigger("focus");
};

$(".task-list").on("click", ".task-text", startTextEdit);
$(".task-list").on("keydown", ".task-text", function(event) {
  if (event.key === "Enter") startTextEdit.call(this);
});

$(".task-list").on("blur", "textarea", function() {
  var text = $(this).val().trim();
  if (!text) text = "Untitled task";
  var taskP = $("<p>").addClass("m-1 task-text").attr({ tabindex: 0, title: "Click to edit" }).text(text);
  $(this).replaceWith(taskP);
  syncFromPage();
});

// ---------- edit due date ----------

var startDateEdit = function() {
  var taskLi = $(this).closest(".task");
  var dateInput = $("<input>")
    .attr("type", "date")
    .addClass("form-control form-control-sm task-date-input")
    .val(toInputDate(taskLi.data("date")));
  $(this).replaceWith(dateInput);
  dateInput.trigger("focus");
};

$(".task-list").on("click", ".task-date", startDateEdit);
$(".task-list").on("keydown", ".task-date", function(event) {
  if (event.key === "Enter") startDateEdit.call(this);
});

// Save the new date and swap the input back to a badge. Picking a date fires "change"
// and then "blur" (removing a focused input also blurs it), so only commit once.
var commitDate = function(input) {
  // flag lives on the element itself because replaceWith() clears jQuery data before removing it
  if (input.committed) return;
  input.committed = true;

  var dateInput = $(input);

  var taskLi = dateInput.closest(".task");
  var date = dateInput.val() || taskLi.data("date");
  taskLi.data("date", date);
  var badge = $("<span>")
    .addClass("badge badge-primary badge-pill task-date")
    .attr({ tabindex: 0, title: "Click to change the due date" })
    .text(formatDate(date));
  dateInput.replaceWith(badge);
  auditTask(taskLi, listOf(taskLi));
  syncFromPage();
};

$(".task-list").on("change blur", ".task-date-input", function() {
  commitDate(this);
});

// ---------- delete ----------

$(".task-list").on("click", ".delete-task", function() {
  $(this).closest(".task").remove();
  syncFromPage();
});

$("#remove-tasks").on("click", function() {
  if (!confirm("Delete every task in every column?")) return;
  LISTS.forEach(function(list) {
    tasks[list] = [];
    $("#list-" + list).empty();
  });
  saveTasks();
});

// ---------- drag and drop between columns ----------

$(".task-list").sortable({
  connectWith: ".task-list",
  items: "> .task",
  cancel: "textarea, input, button",
  tolerance: "pointer",
  placeholder: "task-placeholder",
  forcePlaceholderSize: true,
  start: function(event, ui) {
    ui.item.addClass("dragging");
  },
  stop: function(event, ui) {
    ui.item.removeClass("dragging");
    auditTask(ui.item, listOf(ui.item));
    syncFromPage();
  }
});

// Re-check due dates every 30 minutes in case the page stays open overnight
setInterval(function() {
  $(".task").each(function() {
    auditTask($(this), listOf(this));
  });
}, 30 * 60 * 1000);

loadTasks();
