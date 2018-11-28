/*display all category*/
let _makeHTML = ({
	id,
	name,
	description,
}) => {
	let $categoryList = $(`<li class="list-group-item category" data-category-id="${id}">`).text(name);
	return $categoryList;
};

module.exports = _makeHTML;