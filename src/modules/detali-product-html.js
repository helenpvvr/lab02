/*display detali information about product*/
let _makeHtml = ({
	id,
	name,
	image_url,
	description,
	price,
	special_price,
}) => {
	let $detali_product = $(`<div class="row col-xs-12 col-sm-12 col-md-12 detali-product-div" data-detali-product-id="${id}">`);
	let $detali_image = $(`<div class="col-xs-12 col-sm-6 col-md-6 detali-image-div">`);
	let $detali_info = $(`<div class="col-xs-12 col-sm-6 col-md-6 detali-info-div">`);

	$detali_image.append($(`<img src="${image_url}" alt="${name}" class="img-fluid detali-product-image">`));
	$detali_info.append($(`<span class="detali-product-title">`).text(name));
	if(special_price != null){
		$detali_info.append($(`<span class="detali-product-old-price">`).text(price));
		$detali_info.append($(`<span class="detali-product-special-price">`).text(special_price));
	}
	else{
		$detali_info.append($(`<span class="detali-product-price">`).text(price));
	}
	$detali_info.append($(`<span class="detali-product-description">`).text(description));
	$detali_info.append($(`<img src="../image/basket.png" alt="Buy" class="detali-product-buy">`));

	$detali_product.append($detali_image);
	$detali_product.append($detali_info);

	return $detali_product;
};

module.exports = _makeHtml;