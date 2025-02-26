const express = require('express');
const mongoose = require('mongoose');
const MenuItem = require('./schema');
const dotenv = require("dotenv");
dotenv.config()
const app = express();
app.use(express.json());
 

mongoose.connect(process.env.mongodb) 
.then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));


app.post('/menu', async (req, res) => {
 
  try {
    const newMenuItem = new MenuItem(req.body);
    const savedMenuItem = await newMenuItem.save();
    res.status(201).json({ message: 'Menu item created successfully', data: savedMenuItem });
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Error creating menu item', error: error.message });
  }
});

app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({});
    res.json({message:"data retrieved",data:menuItems});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));