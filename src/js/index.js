import $ from "jquery";

import request from "./bestbuy";
import {Carousel} from "./carousel";
import {ProdUtil} from "./produtil";

export default class App {
	constructor(){
		this.baseUrl = 'https://api.bestbuy.com/v1/products';
		this.apiKey = '8ccddf4rtjz5k5btqam84qak';
		this.category = "";
		this.categoryId = "";

		this.categoryEventListen();
		this.productUtilListen();
	}

	productUtilListen () {
		// load event listeners

		let listen = [
			{className: "header", subClass: ".shopping-cart", eventName: "click", functionName: "showCart"},
			{className: ".carousel", subClass: ".add-button", eventName: "click", functionName: "addCartItem"},
			{className: ".modal", subClass: ".update-button", eventName: "click", functionName: "updateCartItem"},
			{className: ".modal", subClass: ".remove-button", eventName: "click", functionName: "removeCartItem"},
			{className: ".modal", subClass: ".cart-quantity", eventName: "keydown", functionName: "validateQuantity"},
			{className: "banner", subClass: "button", eventName: "click", functionName: "shopNow"},
			{className: ".email-signup", subClass: "button", eventName: "click", functionName: "emailSignup"}
		];

		let productUtil = new ProdUtil;

		for (let i = 0; i < listen.length; i++)
		{
			$(listen[i].className).on(listen[i].eventName, listen[i].subClass, (x) => {
				productUtil.x = x;
				productUtil[listen[i].functionName]();
			});
		}
	}

	getUrl () {
		// get url for product category

		switch (this.category) {
			case "CAMERAS":
				this.categoryId = 'abcat0401000';
				break;
			case "TELEVISIONS":
				this.categoryId = 'abcat0101000';
				break;
			case "DESKTOPS":
				this.categoryId = 'abcat0501000';
				break;
			default:
				// LAPTOPS
				this.categoryId = 'abcat0502000';
		}

		let url = `${this.baseUrl}((categoryPath.id=${this.categoryId}))`;

		return url;
	}

	categoryEventListen () {
		// event listener for navigation menu (product categories)

		$(".nav-menu").on("click", ".nav-item", (x) => {
			console.log($(x.target).text());
			this.category = $(x.target).text();

			this.initBBCall();
		});
	}

	initBBCall () {
		// initialize carousel with products

		request({url: this.getUrl(), api: this.apiKey})
			.then(data => {
				let cara = new Carousel(data);
				cara.getProducts();
			})
			.catch(error => {
				console.log("warning Christopher Robins... Error");
				console.log(error);
			});
	}
}

let x = new App;
