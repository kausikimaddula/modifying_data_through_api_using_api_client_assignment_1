const express = require('express');
const mongoose = require('mongoose');
const MenuItem = require('./schema');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.mongodb)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

// Create a new menu item (POST)
app.post('/menu', async (req, res) => {
  try {
    const newMenuItem = new MenuItem(req.body);
    const savedMenuItem = await newMenuItem.save();
    res.status(201).json({ message: 'Menu item created successfully', data: savedMenuItem });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Error creating menu item', error: error.message });
  }
});

// Retrieve all menu items (GET)
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json({ message: 'Data retrieved',  menuItems });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  }
});

// Update a menu item (PUT)
app.put('/menu/:id', async (req, res) => {
  try {
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    if (!updatedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item updated successfully', data: updatedMenuItem });
  } catch (error) {
    res.status(400).json({ message: 'Error updating menu item', error: error.message });
  }
});

// Delete a menu item (DELETE)
app.delete('/menu/:id', async (req, res) => {
  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!deletedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
