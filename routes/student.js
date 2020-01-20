const express = require('express');
const router = express.Router();
const {filter} = require('rxjs/operator');
const upload = require('multer');
const multer = upload({dest:"./public/images"});
const data = [
	{id: 1, name: "Asaad Saad", course: "CS572", picture: "1570286884.jpg", grade: 95},
	{id: 2, name: "Bat-Oshikh Baatar", course: "CS572", picture: "1570286884.jpg", grade: 100},
	{id: 3, name: "Davaabayar Battogtokh", course: "CS572", picture: "1570286884.jpg", grade: 100},
	{id: 4, name: "John", course: "CS454", picture: "1570286884.jpg", grade: 88}
];
/* GET students listing or get by student */
router.get('/', function (req, res, next) {
	const {id} = req.query;
	let selected;
	if (id) selected = data.filter(v => {
		if (v.id === parseInt(id)) return v;
	});
	else selected = data;
	res.status(200).send(selected);
});
/* POST create student. */
router.post('/', multer.single('picture'),function (req, res, next) {
	const {picture} = req;
	const {id, name, course, grade} = req.body;
	if (id && name && course && grade && picture) {
		const newData = Object.assign({}, data).push({id: id, name: name, course: course, grade: grade, picture:picture});
		res.status(200).send(newData);
	} else return next("Data error");
});

/* DELETE user */
router.delete('/', function (req, res, next) {
	const {id} = req.query;
	let deleted = {}, selected;
	if (id) selected = data.filter(v => {
		if (v.id === parseInt(id)) return v;
		else deleted = v;
	});
	if(deleted.isEmpty()) return next("Student Not Found");
	else res.status(200).send(selected);
});
module.exports = router;
