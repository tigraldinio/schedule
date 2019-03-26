var q = function(selector){

	return document.querySelectorAll(selector);

}

q.create = function(node, attr){

	var element = document.createElement(node);

	if(typeof attr == 'object'){
		if(attr.name != undefined){
			element.name = attr.name;
		}
		if(attr.id != undefined){
			element.id = attr.id;
		}
		if(attr.type != undefined){
			element.type = attr.type;
		}
		if(attr.class != undefined){
			element.className = attr.class;
		}
		if(attr.html != undefined){
			element.innerHTML = attr.html;
		}
		if(attr.child != undefined && attr.child.length > 0){
			for(var i = 0; i < attr.child.length; i++){
				element.appendChild(attr.child[i]);
			}
		}
	}

	return element;
}
q.slider_next = function(){
	var next = q(".block_slider .active")[0].nextElementSibling;
	if(next !== null){
		next.previousElementSibling.classList.remove('active');;
		next.classList.add('active');
	}
}
q.slider_back = function(){
	var prev = q(".block_slider .active")[0].previousElementSibling;
	if(prev !== null){
		prev.nextElementSibling.classList.remove('active');;
		prev.classList.add('active');
	}
}

/*
q.cookie = function(){
	return document.cookie;
}
q.cookie.get = function(name){
	var match = document.cookie.match(new RegExp(name + "=([^;]+)"));
	return (match !== null) ? match[1] : false;
}
q.cookie.set = function(name, val){
	var date = new Date;
	date.setDate(d.getDate() + parseInt((a.length > 0) ? 366 : -1));
	document.cookie = "name=; path=/; expires=" + date.toUTCString();

}
q.cookie.del = function(name){
	if(q.cookie_get(name) !== false){
		q.cookie_set(name, '');
	}
}
*/

var i,
	div_slider,
	wd,
	d = new Date();//сегодняшняя дата

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

var block = q('.calendar');

for(i = 0; i < block.length; i++){
	
	div_slider = q.create("div", {class: "block_slider"});

	get_all_month(div_slider);

	block[i].appendChild(div_slider);
 
	var left = q.create("div", {class: "arrow left", html:"3"});
	left.addEventListener('click', q.slider_back, false);

	block[i].appendChild(left);

	var right = q.create("div", {class: "arrow right", html:"4"});
	right.addEventListener('click', q.slider_next, false);

	block[i].appendChild(right);
}

function get_all_month(node){
	for(var i = 0; i < 12; i++){
		node.appendChild(get_month(i));
	}
}

function get_month(col){

	var i,
		month_title = q.create("div", {class: "month_title", html: month_name_day[col]}),
		month_weekday = q.create("div", {class: "month_weekday"}),
		month_body = q.create("div", {class: "month_body"}),
		month = q.create(
			"label",
			{
				class: (col == d.getMonth()) ? "month active" : "month",
				child: [
					month_title,
					month_weekday,
					month_body,
				],
			}
		);

	for(i = 0; i < weekday.length; i++){
		div = q.create("span", {html: weekday[i]});
		month_weekday.appendChild(div);
	}

	wd = new Date(d.getFullYear(), col).getDay()
	if(wd > 0){
		for(i = 1; i < wd; i++){
			div = q.create("span");
			month_body.appendChild(div);
		}
	}

	for(i = 1; i <= month_day[col]; i++){
		div = q.create("span", {html: i});
		month_body.appendChild(div);
	}

	return month;
}