//сегодняшняя дата
var d = new Date();
//количество дней в каждом месяце
var month_day = [
	31,
	new Date(d.getFullYear(), 2, 0).getDate(),
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31,
];
//названия месяцев
var month_name_day = [
	"Январь",
	"Феваль",
	"Март",
	"Апрель",
	"Май",
	"Июнь",
	"Июль",
	"Август",
	"Сентябрь",
	"Октябь",
	"Ноябрь",
	"Декабрь",
];
//дни недели
var weekday = [
	"Воскресение",
	"Понедельник",
	"Втоник",
	"Среда",
	"Четверг",
	"Пятница",
	"Суббота",
];
var block = document.querySelector('.calendar');
var month = document.createElement("div");
month.className = "month";
var month_title = document.createElement("div");
month_title.className = "month_title";
month_title.innerHTML = month_name_day[d.getMonth()];
month.appendChild(month_title);
block.appendChild(month);
var month_body = document.createElement("div");
month_body.className = "month_body";
month.appendChild(month_body);
var day;
for(var i = 1; i <= month_day[d.getMonth()]; i++){
	day = document.createElement("span");
	day.innerHTML = i;
	month_body.appendChild(day);
}