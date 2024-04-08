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


router.get('/', guarantorController.getAllGuarantor);
router.post('/register', validateGuarantorRegistration,upload.single("guarantor_id"), guarantorController.registerGuarantor);
router.put('/:id', validateGuarantorRegistration, guarantorController.updateGuarantor);
router.delete('/:id', guarantorController.deleteGuarantor);

module.exports = router;