const express = require('express');
const router = express.Router();
const guarantorController = require('../controllers/guarantorController');
const { validateGuarantorRegistration } = require('../middlewares/guarantorValidation');
const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload=multer({storage:storage})

// get all guarantors
router.get('/', guarantorController.getAllGuarantor);

// register guarantors
router.post('/register/:id',upload.single("guarantor_id"), guarantorController.registerGuarantor);

// update guarantors
router.put('/:id', validateGuarantorRegistration, guarantorController.updateGuarantor);
// delete guarantors
router.delete('/:id', guarantorController.deleteGuarantor);

module.exports = router;