const express = require('express');
const router = express.Router();
const guarantorController = require('../controllers/guarantorController');

const multer = require("multer")
const authenticate = require('../middlewares/auth');


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
// router.get('/', guarantorController.getAllGuarantor);
router.get('/', authenticate,(req, res, next) => {
  if (req.role === 'admin') {
    guarantorController.getAllGuarantor(req, res, next);
  } else {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
});

// register guarantors
// router.post('/register/:id',upload.single("guarantor_id"), guarantorController.registerGuarantor);
router.post('/register/:id', authenticate,upload.single("guarantor_id"),(req, res, next) => {
    // console.log('Role in route handler:', req.role);
    if (req.role === 'user') {
        guarantorController.registerGuarantor(req, res, next);
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  });

// update guarantors
// router.put('/:id', validateGuarantorRegistration, guarantorController.updateGuarantor);
router.put('/:id', authenticate,(req, res, next) => {
    // console.log('Role in route handler:', req.role);
    if (req.role === 'user') {
        guarantorController.updateGuarantor(req, res, next);
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  });

// delete guarantors
// router.delete('/:id', guarantorController.deleteGuarantor);
router.delete('/:id', authenticate,(req, res, next) => {
    // console.log('Role in route handler:', req.role);
    if (req.role === 'user') {
        guarantorController.deleteGuarantor(req, res, next);
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  });

module.exports = router;