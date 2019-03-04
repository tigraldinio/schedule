//сегодняшняя дата
var i, div, wd;
var d = new Date();
//количество дней в каждом месяце
var month_day = [
	31,
	new Date(d.getFullYear(), 2, 0).getDate(),//количество дней в феврале
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
	"Пн",
	"Вт",
	"Ср",
	"Чт",
	"Пт",
	"Сб",
	"Вс",
];

var block = document.querySelector('.calendar');

for(i = 0; i < 12; i++){
	add_month(block, i);
}

function add_month(block, col){
	var i,
		month = document.createElement("div"),
		month_title = document.createElement("div"),
		month_weekday = document.createElement("div"),
		month_body = document.createElement("div");

	month.className = "month";

	month_title.className = "month_title";
	month_title.innerHTML = month_name_day[col];
	month.appendChild(month_title);

	month_weekday.className = "month_weekday";
	for(i = 0; i < weekday.length; i++){
		div = document.createElement("span");
		div.innerHTML = weekday[i];
		month_weekday.appendChild(div);
	}
	month.appendChild(month_weekday);

	month_body.className = "month_body";
	month.appendChild(month_body);

	wd = new Date(d.getFullYear(), col).getDay()
	if(wd > 0){
		for(i = 1; i < wd; i++){
			div = document.createElement("span");
			month_body.appendChild(div);
		}
	}

	for(i = 1; i <= month_day[col]; i++){
		div = document.createElement("span");
		div.innerHTML = i;
		month_body.appendChild(div);
	}

	block.appendChild(month);
}