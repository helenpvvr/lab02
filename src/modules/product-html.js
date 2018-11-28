/*display all product*/
let _makeHtml = ({
	id,
	name,
	image_url,
	description,
	price,
	special_price,
}) => {
	let $product = $(`<div class="card col-xs-12 col-sm-4 col-md-4 product-div" data-product-id="${id}">`);
	$product.append($(`<img src="${image_url}" alt="${name}" class="img-fluid product-image">`));
	$product.append($(`<span class="product-title">`).text(name));
	if(special_price != null){
		$product.append($(`<span class="product-old-price">`).text(price));
		$product.append($(`<span class="product-special-price">`).text(special_price));
	}
	else{
		$product.append($(`<span class="product-price">`).text(price));
	}
	$product.append($(`<img src="../image/basket.png" alt="Buy" class="product-buy">`));
	return $product;
};

module.exports = _makeHtml;