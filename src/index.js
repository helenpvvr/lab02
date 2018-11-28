console.log('Hello!');
console.log(`The time is ${new Date()}`);
import './scss/main.scss'
import 'bootstrap';

// from github
require('./modules/hello')('NIT');
var _foo = require('./modules/hello');
_foo('user1');
_foo('user2');

// import 'bootstrap';	// with JS!!
// import 'bootstrap/dist/css/bootstrap.min.css';	// only minified CSS

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

let _makeProduct = require('./modules/product-html');
let _makeCategoryList = require('./modules/category-list-html');
let _makeDetaliProduct = require('./modules/detali-product-html');

/*all products*/
jQuery.ajax({
	url: 'http://nit.tron.net.ua/api/product/list',
	method: 'get',
	dataType: 'json',
	success: function(json){
		console.log('Loaded via AJAX!');
		// console.log(json);
		console.table(json);

		json.forEach(product => $('.product-grid').append(_makeProduct(product)));
		console.log('Added to grid');
		addToBasket();
	},
	error: function(xhr){
		alert("An error occured: " + xhr.status + " " + xhr.statusText);
	},
});

/*all category of products*/
jQuery.ajax({
	url: 'http://nit.tron.net.ua/api/category/list',
	method: 'get',
	dataType: 'json',
	success: function(json){
		console.log('Loaded via AJAX!');
		// console.log(json);
		console.table(json);

		json.forEach(categoryList => $('.categoryList-grid').append(_makeCategoryList(categoryList)));
		console.log('Added to grid');
	},
	error: function(xhr){
		alert("An error occured: " + xhr.status + " " + xhr.statusText);
	},
});

/*to display goods from one category*/
$(document).on('click', '.category', function(){
	var $this = $(this);

	$('.category.active').removeClass('active');
	$this.addClass('active');

	var id = $this.closest('.category').data('category-id');
	console.log(id);
	$('div.product-grid').empty();//очистити блок
	$('div.detail-product-grid').empty();//очистити блок

	var urlstr = '';

	if(id == 'all')
		urlstr = 'http://nit.tron.net.ua/api/product/list';
	else
		urlstr = 'http://nit.tron.net.ua/api/product/list/category/' + id;

	jQuery.ajax({
    	url: urlstr,
    	method: 'get',
    	dataType: 'json',
    	success: function(json){
    		json.forEach(product => $('.product-grid').append(_makeProduct(product)));
    	},
    	error: function(xhr){
    		alert("An error occured: " + xhr.status + " " + xhr.statusText);
    	},
  	});
  
});

/*to display detali informarion about product*/
$(document).on('click', '.product-image', function(){
	var $this = $(this);

	var id = $this.closest('.product-div').data('product-id');
	console.log(id);
	$('div.product-grid').empty();//очистити блок
	$('div.detail-product-grid').empty();//очистити блок

	jQuery.ajax({
    	url: 'http://nit.tron.net.ua/api/product/' + id,
    	method: 'get',
    	dataType: 'json',
    	success: function(json){
    		$('.detail-product-grid').append(_makeDetaliProduct(json));
    	},
    	error: function(xhr){
    		alert("An error occured: " + xhr.status + " " + xhr.statusText);
    	},
  	});
  
});

/*clear basket*/
$(document).on('click', '#clear-basket', function(){
	localStorage.clear();
	var $basketElements = $('div#basket-elements');
	$basketElements.empty();
	let $doempty = $(`<div class="card col-xs-12 col-sm-12 col-md-12 
			product-tobuy-div" data-product-tobuy-id="emptybasket">`);
	$doempty.append($(`<span class="product-tobuy-title">`).text("Empty"));
	$basketElements.append($doempty);
});

/*to add product to basket*/
$(document).on('click', '.product-buy', function(){
	var $this = $(this);
	var id = $this.closest('.product-div').data('product-id');
	var name = $this.closest('.product-div').children('.product-title').text();
	var price = $this.closest('.product-div').children('.product-price').text();
	var special_price = $this.closest('.product-div').children('.product-special-price').text();

	console.log("This element: ");
	console.log("name: " + name);
	console.log("id: " + id);
	if(price == ""){
		console.log("special price: " + special_price);
		price = special_price;
	}
	else
		console.log("price: " + price);

	var obj = {namee: name, ide: id, pricee: price};
	var myJSON = JSON.stringify(obj);

	upDateLocalStorage(myJSON);
	addToBasket();
});

/*add product to basket*/
function addToBasket(){
	var $basketElements = $('div#basket-elements');
	$basketElements.empty();

	var totalSum = 0;

	for (var i = 0; i < localStorage.length; i++) {
		var arr = JSON.parse(localStorage.key(i));
		var number = localStorage.getItem(localStorage.key(i));

		totalSum += (+arr.pricee)*(+number);

		let $productToBuy = $(`<div class="card col-xs-12 col-sm-12 col-md-12 
			product-tobuy-div" data-product-tobuy-id="${arr.ide}">`);
		$productToBuy.append($(`<span class="product-tobuy-title">`).text(arr.namee));
		$productToBuy.append($(`<span class="product-tobuy-price">`).text(arr.pricee));
		$productToBuy.append($(`<span class="product-tobuy-number">`).text("Number of products: " + number));
		let $productToBuyButtons = $(`<div class="row col-xs-12 col-sm-12 col-md-12 
			product-tobuy-div-buttons">`);
		$productToBuyButtons.append($(`<button class="btn product-tobuy-buttonadd">`).text(" + "));
		$productToBuyButtons.append($(`<button class="btn product-tobuy-buttonremove">`).text(" - "));
		$productToBuyButtons.append($(`<button class="btn product-tobuy-buttonremoveall">`).text(" x "));
		$productToBuy.append($productToBuyButtons);
		$basketElements.append($productToBuy);
	}

	if(totalSum == 0){
		let $doempty = $(`<div class="card col-xs-12 col-sm-12 col-md-12 
			product-tobuy-div" data-product-tobuy-id="emptybasket">`);
		$doempty.append($(`<span class="product-tobuy-title">`).text("Empty"));
		$basketElements.append($doempty);
	}
	else{
		$basketElements.append($(`<span class="product-totalSum-number">`).text("Загальна сума: " + totalSum));
	}
}

/*to increasy the number of products*/
$(document).on('click', '.product-tobuy-buttonadd', function(){
	var $this = $(this);
	var id = $this.closest('.product-tobuy-div').data('product-tobuy-id');
	var name = $this.closest('.product-tobuy-div').children('.product-tobuy-title').text();
	var price = $this.closest('.product-tobuy-div').children('.product-tobuy-price').text();

	var obj = {namee: name, ide: id, pricee: price};
	var myJSON = JSON.stringify(obj);

	var number = localStorage.getItem(myJSON);
	number = +number + 1;
	localStorage.setItem(myJSON, number);
	addToBasket();
});

/*to decreasy the number of goods*/
$(document).on('click', '.product-tobuy-buttonremove', function(){
	var $this = $(this);
	var id = $this.closest('.product-tobuy-div').data('product-tobuy-id');
	var name = $this.closest('.product-tobuy-div').children('.product-tobuy-title').text();
	var price = $this.closest('.product-tobuy-div').children('.product-tobuy-price').text();

	var obj = {namee: name, ide: id, pricee: price};
	var myJSON = JSON.stringify(obj);

	var number = localStorage.getItem(myJSON);
	if(number == 1){
		localStorage.removeItem(myJSON);
	}
	else{
		number = +number - 1;
		localStorage.setItem(myJSON, number);
	}
	addToBasket();
});

/*delete product from basket*/
$(document).on('click', '.product-tobuy-buttonremoveall', function(){
	var $this = $(this);
	var id = $this.closest('.product-tobuy-div').data('product-tobuy-id');
	var name = $this.closest('.product-tobuy-div').children('.product-tobuy-title').text();
	var price = $this.closest('.product-tobuy-div').children('.product-tobuy-price').text();

	var obj = {namee: name, ide: id, pricee: price};
	var myJSON = JSON.stringify(obj);

	localStorage.removeItem(myJSON);
	addToBasket();
});

/*to add product to basket*/
$(document).on('click', '.detali-product-buy', function(){
	var $this = $(this);
	var id = $this.closest('.detali-product-div').data('detali-product-id');
	var name = $this.closest('.detali-product-div').find('.detali-product-title').text();
	var price = $this.closest('.detali-product-div').find('.detali-product-price').text();
	var special_price = $this.closest('.detali-product-div').find('.detali-product-special-price').text();

	console.log("This element in detali-info-div: ");
	console.log("name: " + name);
	console.log("id: " + id);
	if(price == ""){
		console.log("special price: " + special_price);
		price = special_price;
	}
	else
		console.log("price: " + price);

	var obj = {namee: name, ide: id, pricee: price};
	var myJSON = JSON.stringify(obj);

	upDateLocalStorage(myJSON);
});

/*update localStorage*/
function upDateLocalStorage(myJSON){
	var number = 1;

	var localSvalue = localStorage.getItem(myJSON);
	if(localSvalue != null){
		number = +localSvalue;
		number++;
	}
	localStorage.setItem(myJSON, number);
	addToBasket();
}

/*to make an order*/
$(document).on('click', '#send-info', function(){
	var $this = $(this);
	var $form = $this.closest('#form-block');

	var name = $("input#usr").val();
	var phone_numb = $("input#phone-numb").val();
	var email = $("input#email").val();

	if(name == ""){
		alert("Введіть ім'я");
		return;
	}
	if(notCorrectPhone(phone_numb)){
		alert("Введіть номер телефону коректно");
		return;
	}
	if(notCorrectEmail(email)){
		alert("Введіть email коректно");
		return;
	}

	if(localStorage.length == 0){
		alert("Ви не обрали ніякого товару");
		return;
	}

	var dataStr = 'token=sKh2BDlsqjNE18EcGpq8&name=' + name + '&phone=' + phone_numb + '&email=' + email;
	for (var i = 0; i < localStorage.length; i++) {
		var myJSON  = localStorage.key(i);
		var obj = JSON.parse(myJSON);
		var id = obj.ide;
		var number = localStorage.getItem(myJSON);
		dataStr += '&products[' + id + ']=' + number;
	}
	console.log(dataStr);

	$.ajax({
    	url: 'https://nit.tron.net.ua/api/order/add',
    	method: 'post',
    	data: dataStr,
    	dataType: 'json',
    	success: function(json){
        	console.log(json);
        	if(json.status != "error"){
        		alert("Замовлення зроблено успішно. Дякуємо за Ваш вибір.");
        		localStorage.clear();
        		addToBasket();
        	}
        	else
        		alert("Сталася помилка! Ви не коректно оформили замовлення");
    	},
    	error: function(xhr){
			alert("An error occured: " + xhr.status + " " + xhr.statusText);
		},
	});
});

/*check if enter not a correct phone number*/
function notCorrectPhone(phone_numb){
	if(phone_numb == ""){
		return true;
	}
	if(phone_numb.length != 13){
		return true;
	}
	if(phone_numb[0] != '+'){
		return true;
	}
	for (var i = 1; i < phone_numb.length; i++) {
		if(isNaN(phone_numb[i]))
			return true;
	}
	return false;
};

/*check if enter not a correct email*/
function notCorrectEmail(email){
	if(email == "")
		return true;
	if(email.length <= 3)
		return true;
	var d = 0;
	for (var i = 1; i < email.length-1; i++) {
		if(email[i] == "@"){
			d = i;
			break;
		}
	}
	if(d == 0)
		return true;
	for (var i = d+1; i < email.length-1; i++) {
		if(email[i] == ".")
			return false;
	}
	return true;
};