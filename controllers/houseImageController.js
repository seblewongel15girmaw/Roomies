// const multer = require('multer');
// const mysql = require('mysql2/promise');
// const dbConfig = require('../config/dbConfig');

// const HouseImage = require('../models/houseImageModel');

// // Set up the multer storage for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Specify the directory where the uploaded images will be stored
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     // Generate a unique filename for the uploaded image
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix);
//   }
// });

// // Create a multer instance and specify the storage
// const upload = multer({ storage });

// // Handle the house image upload
// async function uploadHouseImage(req, res) {
//   try {
//     const houseId = req.params.houseId;

//     // Get a connection from the pool
//     const connection = await mysql.createConnection(dbConfig);

//     // Check if the house exists
//     const [rows] = await connection.query('SELECT * FROM houses WHERE id = ?', [houseId]);
//     if (rows.length === 0) {
//       res.status(404).json({ success: false, error: 'House not found' });
//       return;
//     }

//     // Check if there is a file in the request
//     if (!req.file) {
//       res.status(400).json({ success: false, error: 'No file uploaded' });
//       return;
//     }

//     // Save the image details to the database
//     const imageFilename = req.file.filename;
//     await connection.query('INSERT INTO house_images (house_id, image_filename) VALUES (?, ?)', [houseId, imageFilename]);

//     // Release the connection back to the pool
//     connection.release();

//     res.json({ success: true, message: 'Image uploaded successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// }

// // Retrieve all images for a house
// async function getHouseImages(req, res) {
//   try {
//     const houseId = req.params.houseId;

//     // Get a connection from the pool
//     const connection = await mysql.createConnection(dbConfig);

//     // Retrieve the images for the house from the database
//     const [rows] = await connection.query('SELECT * FROM house_images WHERE house_id = ?', [houseId]);

//     // Release the connection back to the pool
//     connection.release();

//     res.json({ success: true, data: rows });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: 'Server Error' });
//   }
// }

// // Delete a house image
// async function deleteHouseImage(req, res) {
//     try {
//       const houseId = req.params.houseId;
//       const imageId = req.params.imageId;
  
//       // Get a connection from the pool
//       const connection = await mysql.createConnection(dbConfig);
  
//       // Check if the house exists
//       const [houseRows] = await connection.query('SELECT * FROM houses WHERE id = ?', [houseId]);
//       if (houseRows.length === 0) {
//         res.status(404).json({ success: false, error: 'House not found' });
//         return;
//       }
  
//       // Check if the image exists for the specified house
//       const [imageRows] = await connection.query('SELECT * FROM house_images WHERE house_id = ? AND id = ?', [houseId, imageId]);
//       if (imageRows.length === 0) {
//         res.status(404).json({ success: false, error: 'Image not found' });
//         return;
//       }
  
//       // Delete the image from the database
//       await connection.query('DELETE FROM house_images WHERE id = ?', [imageId]);
  
//       // Release the connection back to the pool
//       connection.release();
  
//       res.json({ success: true, message: 'Image deleted successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, error: 'Server Error' });
//     }
//   }


//   // Update a house image
// async function updateHouseImage(req, res) {
//     try {
//       const houseId = req.params.houseId;
//       const imageId = req.params.imageId;
  
//       // Get a connection from the pool
//       const connection = await mysql.createConnection(dbConfig);
  
//       // Check if the house exists
//       const [houseRows] = await connection.query('SELECT * FROM houses WHERE id = ?', [houseId]);
//       if (houseRows.length === 0) {
//         res.status(404).json({ success: false, error: 'House not found' });
//         return;
//       }
  
//       // Check if the image exists for the specified house
//       const [imageRows] = await connection.query('SELECT * FROM house_images WHERE house_id = ? AND id = ?', [houseId, imageId]);
//       if (imageRows.length === 0) {
//         res.status(404).json({ success: false, error: 'Image not found' });
//         return;
//       }
  
//       // Check if there is a file in the request
//       if (!req.file) {
//         res.status(400).json({ success: false, error: 'No file uploaded' });
//         return;
//       }
  
//       // Update the image filename in the database
//       const imageFilename = req.file.filename;
//       await connection.query('UPDATE house_images SET image_filename = ? WHERE id = ?', [imageFilename, imageId]);
  
//       // Release the connection back to the pool
//       connection.release();
  
//       res.json({ success: true, message: 'Image updated successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, error: 'Server Error' });
//     }
//   }

// module.exports = { uploadHouseImage, getHouseImages,deleteHouseImage,updateHouseImage };