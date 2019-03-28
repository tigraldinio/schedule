/*Инициализация всех переменных*/
var i,
	div_slider,
	wd,
	d = new Date();//сегодняшняя дата
	today = ((d.getDate() < 10) ? "0" + d.getDate() : d.getDate()) + "." + ((d.getMonth() < 9) ? "0" + (d.getMonth() + 1): (d.getMonth() + 1));


/*Вспомогательные функции*/
var q = function(selector, where){

	if(where instanceof Node){
		return where.querySelectorAll(selector);
	}
	else{
		return document.querySelectorAll(selector);
	}

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
		if(attr.dataset != undefined && attr.dataset.length > 0){
			for(var i = 0; i < attr.dataset.length; i++){
				element.setAttribute("data-"+attr.dataset[i].name, attr.dataset[i].value);
			}
		}
		if(attr.child != undefined && attr.child.length > 0){
			for(var i = 0; i < attr.child.length; i++){
				element.appendChild(attr.child[i]);
			}
		}
	}

	return element;
}

q.add_event = function(node_list, event, func){

	if(node_list instanceof NodeList){
		for(var i = node_list.length - 1; i >= 0; i--){
			node_list[i].addEventListener(event, func);
		}
	}
	else if(node_list instanceof Node){
		node_list.addEventListener(event, func);
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

function popup_close(){
	q('.popup').forEach(function(elem) {
		elem.style.display = 'none';
	});
}

/*Функции для работы с календарём*/
function get_all_month(node){
	for(var i = 0; i < 12; i++){
		node.appendChild(get_month(i));
	}
}

function get_month(col){

	var i,
		m,
		day_count = 1,
		select_date,
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

	wd = new Date(d.getFullYear(), col).getDay();

	if(wd > 0){
		for(i = 1; i < wd; i++, day_count++){
			div = q.create("span");
			month_body.appendChild(div);
		}
	}
	m = "";
	m += (col < 9 ) ?  "0" + (col + 1).toString() : (col + 1).toString();

	for(i = 1; i <= month_day[col]; i++,  day_count++){
		div = q.create(
			"span",
			{
				html: i,
				dataset:[
				{
					name: 'date',
					value: (i < 10) ? m + "0" + (i).toString() : m + (i).toString(),
				},
				{
					name: 'weekday',
					value: day_count,
				}
				]
			});
		
		if(day_count % 6 == 0 || day_count % 7 == 0){
			if(day_count % 7 == 0) day_count = 0;
			div.classList.add('holiday');
		}

		month_body.appendChild(div);

		q.add_event(div, 'click', function(){
			select_date = q('.select_date')[0];
			if(select_date != this){
				if(select_date !== undefined){
					select_date.classList.remove('select_date');
				}
				this.classList.add('select_date');
				q('#add_event input[name="event_date"]')[0].value = this.dataset.date.substr(2, 2) + '.' + this.dataset.date.toString().substr(0, 2);
				events.add_list();
			}
		});
	}

	return month;
}


/*Работа с событиями*/
var events = {};

//инициализация переменных
events.event_list = {},
events.schedule_list = {};

events.select_date = function(){
	var date = q('.select_date')[0];
	if(date  !== undefined){
		return date.dataset.date;
	}
	else{
		return today.substr(3) + today.substr(0, 2);
	}
}
events.select_weekday = function(){
	var date = q('.select_date')[0];
	if(date  !== undefined){
		return date.dataset.weekday;
	}
	else{
		return (parseInt(d.getDay()) == 0) ? 7 : d.getDay();
	}
}
//обновление переменных event_list, schedule_list
events.init = function(){
	
	var m; 
	
	//Обнуляем значения
	events.event_list = {};
	events.schedule_list = {};
	//Обнуляем классы
	q('.event_list,  .schedule_list').forEach(function(elem){
		elem.classList.remove('event_list');
		elem.classList.remove('schedule_list');
	});

	for (var key in localStorage) {
		if(typeof localStorage[key] != 'function' && key != 'length'){
			//события
			if(key.substr(0, 1) == 2){
				
				//Удаляем прошлогодние одноразовые события
				if(key.substr(5, 2) < d.getFullYear().toString().substr(2)){
					localStorage.removeItem(key);
				}
				else{
					m = key.substr(3, 2) + key.substr(1, 2);
					if(events.event_list[m] == undefined){
						events.event_list[m] = [];
					}
					events.event_list[m].push({
						name: localStorage[key],
						key: key,
					});
					q("[data-date='" + m + "']")[0].classList.add('event_list');
				}
			}
			//расписание
			else if(key.substr(0, 1) == 1){
				m = key.substr(5);
				for(var i = 0; i <= m.length; i++){
					if(m[i] == "0"){
						continue;
					}
					if(events.schedule_list[i + 1] == undefined){
						events.schedule_list[i + 1] = [];
					}
					events.schedule_list[i + 1].push({
						name: localStorage[key],
						key: key,
					});
					q("[data-weekday='" + (i + 1) + "']").forEach(function(elem){
						elem.classList.add('schedule_list');
					});
				}

				//console.log(key);
			}
		}
	}

	events.add_list();

}

events.add_list = function(){
	
	var tab_1 = q("#tab_1 > div:first-child")[0],
		tab_2 = q("#tab_2 > div:first-child")[0];

	tab_1.innerHTML = "";
	tab_2.innerHTML = "";

	if(events.schedule_list[events.select_weekday()] !== undefined){
		events.add_list_elements(tab_1, events.schedule_list[events.select_weekday()])
	}

	if(events.event_list[events.select_date()] !== undefined){
		events.add_list_elements(tab_2, events.event_list[events.select_date()])
	}
}

//функция сортиовки
events.sort = function(event_1, event_2) {
	if(event_1.key.substr(0, 1) == 1){
		return event_1.key.substr(1, 2) - event_2.key.substr(1, 2);
	}
	return event_1.key.substr(7, 2) - event_2.key.substr(7, 2);
}

events.add_list_elements = function(node, list){

	list.sort(events.sort);

	var div, remove, time;
	for(var i = 0; i < list.length; i++){
		time = 	q.create('span');
		if(list[i].key.substr(0, 1) == 1){
			time.innerHTML = list[i].key.substr(1, 2) + ":00 - " + list[i].key.substr(3, 2) +":00";
		}
		else{
			time.innerHTML = list[i].key.substr(7, 2) + ":00";
		}

		remove = q.create('span', {class: 'remove', id: list[i].key});
		q.add_event(remove, 'click', function(){
			localStorage.removeItem(this.id);
			events.init();
		});

		div = q.create(
			'div',
			{
				class: "event",
				child: [
					time,
					q.create('span', {html: list[i].name}),
					remove,
				]
			}
		);
		div.appendChild(remove);
		node.appendChild(div);
	}
}

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
	],

	//названия месяцев
	month_name_day = [
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
	],
	//дни недели
	weekday = [
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
 
	/*Стрелки для слайдера*/
	var left = q.create("div", {class: "arrow left", html:"3"});
	q.add_event(left, 'click', function(){
		var next = q(".block_slider .active")[0].previousElementSibling;
		if(next !== null){
			next.nextElementSibling.classList.remove('active');;
			next.classList.add('active');
		}
	});

	var right = q.create("div", {class: "arrow right", html:"4"});
	q.add_event(right, 'click', function(){
		var next = q(".block_slider .active")[0].nextElementSibling;
		if(next !== null){
			next.previousElementSibling.classList.remove('active');;
			next.classList.add('active');
		}
	});

	block[i].appendChild(left);
	block[i].appendChild(right);
}

/*Получаем события и расписания*/
events.init();

/*Добавляем события для всплывающих форм*/

//Добавим дату к форме
q('#add_event input[name="event_date"]')[0].value = today;

q.add_event(q('.popup'), 'click', function(){
	if(event.target == this){
		this.style.display = "none";
	}
});
q.add_event(q('.show_popup'), 'click', function(){
	var popup = q('.popup#'+this.dataset.form)[0];
	if(popup !== undefined){
		popup.style.display = 'flex';
	}
});

q.add_event(q('form'), 'submit', function(){

	event.preventDefault();

	var	i = 0,
		length = this.length,
		data = {};

	for(; i < length; i++){
		
		if(this[i].type.toLowerCase() == 'checkbox' || this[i].type.toLowerCase() == 'radio'){
			if(this[i].checked){
				if(this[i].name.substr(-2) == "[]"){
					var name_var = this[i].name.substr(0, this[i].name.length - 2);
					if(data[name_var] == undefined){
						data[name_var] = [this[i].value,];
					}
					else{
						data[name_var].push(this[i].value);
					}
					
				}
				else{
					data[this[i].name] = this[i].value;
				}
			}
		}
		else{
			if(this[i].name.substr(-2) == "[]"){
				if(data[this[i].name.substr(0, this[i].name.length - 2)] == undefined){
					var name_var = this[i].name.substr(0, this[i].name.length - 2);
					if(data[name_var] == undefined){
						data[name_var] = [this[i].value,];
					}
					else{
						data[name_var].push(this[i].value);
					}
				}
				data[this[i].name.substr(0, this[i].name.length - 2)].push(this[i].value);
			}
			else{
				data[this[i].name] = this[i].value;
			}
		}
		
	}

	if(this.name == 'add_event'){

		if(data.event_name == ""){
			alert("Нет название!");
		}
		else{
			//собираем всё в кучу
			var key = "2";
			key += data.event_date.substr(0, 2);
			key += data.event_date.substr(3);
			key += (data.event_repeat !== undefined) ? "99" : d.toDateString().substr(-2);
			key += data.event_time;
			localStorage.setItem(key, data.event_name);

			popup_close();

			events.init();

			this.reset();

			select_date = q('.select_date')[0];

			if(select_date !== undefined){
				q('#add_event input[name="event_date"]')[0].value = select_date.dataset.date.substr(2, 2) + "." + select_date.dataset.date.substr(0, 2);
			}
			else{
				q('#add_event input[name="event_date"]')[0].value = today;
			}
		}
		
	}
	else if(this.name == 'add_schedule'){
		if(data.event_name == ""){
			alert("Нет название!");
		}
		else if(data.event_time_start >= data.event_time_end){
			alert("Время завершения должно быть позже времени начала!");
		}
		else if(data.event_repeat == undefined){
			alert("Не выбан день недели для расписания!");
		}
		else{
			//собираем всё в кучу
			var key = "1", weekday = 10000000;
			key += data.event_time_start;
			key += data.event_time_end;
			//key += "00000000";
			for(var j = 0; j < data.event_repeat.length; j++){
				weekday += Math.pow(10, (6 - parseInt(data.event_repeat[j])));
			}
			key += weekday.toString().substr(1);
			localStorage.setItem(key, data.event_name);

			popup_close();

			events.init();

			this.reset();
		}
	}

});
/*
+---------------------------------------------------------------------------------------------------+------------------+
|                                     Разбор по-символьно                                           |                  |
+---------------------------------------------------------------------------------------------------+     Пример       |
|     что       |     |  день |  месяц | год  / повтор |   Время нач.  |  Время окон.  | Дни недели |                  |
+----------------------------------------------------------------------------------------------------------------------+
|   расписание  |  1  |       |        |               |      00       |      13       |  0000000   |    10013000011   |
+----------------------------------------------------------------------------------------------------------------------+
|    событие    |  2  |   03  |   29   |  19  /  99    |      00       |               |            |     003291900    |
+----------------------------------------------------------------------------------------------------------------------+
*/