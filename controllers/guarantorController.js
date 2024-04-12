
const Guarantor = require('../models/guarantorModel');
const path = require("path")
const imagesDirectory=path.join(__dirname, "..", "images")

const getAllGuarantor = async (req, res) => {
  try {
   const brokers= await Guarantor.findAll()
    res.status(200).json(brokers);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// function that registor guarantors
const registerGuarantor = async (req, res) => {
  try {
    var image_url
      // accept the user id from the token then store 
      const {
        full_name, address, phone_number, gender
      } = req.body;
    if (req.file) {
      const file = req.file;
     image_url=path.join(imagesDirectory, file.filename)
    }
      const guarantorData = {
        full_name,personal_id:image_url, address, phone_number, gender
      };
  
      const guarantorID = await Guarantor.create(guarantorData);
  
      res.status(201).json({ message: 'Guarantor registered successfully', guarantorID });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
  

 const updateGuarantor = async (req, res) => {
    try {
      const guarantorId = req.params.id;  
      await Guarantor.update(full_name, user_id, personal_id_image, address, phone_number, gender ,{ where: { guarantorId: guarantorId }})

      res.status(200).json({ message: ' Guarantor updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
const deleteGuarantor = async (req, res) => {
    try {
      const guarantorId = req.params.id;
      const guarantor = await Guarantor.findByPk(guarantorId)
      if (guarantor==null) {
        return res.status(404).json({message:"guarantor not found"})
      }
  await Guarantor.destroy()
      res.status(200).json({ message: 'Guarantor deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
  
module.exports={deleteGuarantor, registerGuarantor, updateGuarantor,getAllGuarantor}

