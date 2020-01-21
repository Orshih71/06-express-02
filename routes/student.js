const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "/../public/images/"));
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + ".jpg");
	}
});
const upload = multer({
	storage: storage,
	fileFilter: function (req, file, cb) {
		if (path.extname(file.originalname) !== '.jpg') {
			return cb('File extension is wrong');
		}
		cb(null, true);
	},
	limits: {
		fileSize: 3 * 1024 * 1024
	}
});

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
	res.status(200).json(selected);
});
/* POST create student. */
const validation = () => {
	return (req, res, next) => {
		if (req.method === "POST") {
			const {id, name, course, grade} = req.body;
			console.log(req);
			if (id && name && course && grade) return next();
			else return next("Data error");
		}
	}
};
router.post('/', upload.single('picture'), validation(), function (req, res, next) {
	//handling image
	const {file} = req;
	if (!file) return next("No image");
	//handling data
	const {id, name, course, grade} = req.body;
	data.push({id: id, name: name, course: course, grade: grade, picture: file.filename});
	res.status(200).json(data);
});

/* DELETE user */
router.delete('/:id', function (req, res, next) {
	const {id} = req.params;
	let deleted = {}, selected;
	if (id) selected = data.filter(v => {
		if (v.id !== parseInt(id)) return v;
		else deleted = v;
	});
	if (deleted.length === 0) return next("Student Not Found");
	else res.status(200).json(selected);
});
module.exports = router;
