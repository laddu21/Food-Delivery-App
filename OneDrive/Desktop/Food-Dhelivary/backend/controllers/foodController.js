// Import the foodModel from the models directory

import foodModel from "../models/foodModel.js";

// Import fs module for file system operations

import fs from 'fs'

// Function to list all food items

const listFood = async (req, res) => {

    // Try block to handle the operation

    try {

        // Find all food documents in the database

        const foods = await foodModel.find({})

        // Send success response with the data

        res.json({ success: true, data: foods })

        // Catch block for error handling

    } catch (error) {

        // Log the error to the console

        console.log("Error in listFood:", error);

        // Send error response

        res.status(500).json({ success: false, message: "Error" })

    }

}

// Function to add a new food item

const addFood = async (req, res) => {

    // Try block to handle the operation

    try {

        // Get the filename from the uploaded file

        let image_filename = `${req.file.filename}`

        // Create a new food instance with the provided data

        const food = new foodModel({

            name: req.body.name,

            description: req.body.description,

            price: req.body.price,

            category: req.body.category,

            image: image_filename,

        })

        // Save the food item to the database

        await food.save();

        // Send success response

        res.json({ success: true, message: "Food Added" })

        // Catch block for error handling

    } catch (error) {

        // Log the error to the console

        console.log(error);

        // Send error response

        res.json({ success: false, message: "Error" })

    }

}

// Function to remove a food item

const removeFood = async (req, res) => {

    // Try block to handle the operation

    try {

        // Find the food item by ID

        const food = await foodModel.findById(req.body.id);

        // Delete the associated image file

        fs.unlink(`uploads/${food.image}`, () => { })

        // Delete the food item from the database

        await foodModel.findByIdAndDelete(req.body.id)

        // Send success response

        res.json({ success: true, message: "Food Removed" })

        // Catch block for error handling

    } catch (error) {

        // Log the error to the console

        console.log(error);

        // Send error response

        res.json({ success: false, message: "Error" })

    }

}

// Function to search for food using AI

const aiFoodSearch = async (req, res) => {

    // Try block to handle the operation

    try {

        // Extract the query from the request body

        const { query } = req.body;

        // Check if query is provided

        if (!query) {

            // Send error response if query is missing

            return res.status(400).json({ success: false, message: "Query is required" });

        }

        // Generate food items based on the query

        const generatedFoods = generateFoodItems(query);

        // Send success response with the generated data

        res.json({ success: true, data: generatedFoods });

        // Catch block for error handling

    } catch (error) {

        // Log the error to the console

        console.log("Error in aiFoodSearch:", error);

        // Send error response

        res.status(500).json({ success: false, message: "Error generating food suggestions" });

    }

}

// Function to generate food items based on query

const generateFoodItems = (query) => {

    // Convert query to lowercase for matching

    const lowerQuery = query.toLowerCase();

    // Initialize an empty array for foods

    const foods = [];

    // Define food templates object

    const foodTemplates = {

        biriyani: [

            { name: "Chicken Biriyani", desc: "Aromatic basmati rice with tender chicken, spices, and caramelized onions", price: 180, category: "Rice Dishes", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400" },

            { name: "Mutton Biriyani", desc: "Fragrant rice cooked with succulent mutton pieces and rich spices", price: 220, category: "Rice Dishes", image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400" },

            { name: "Vegetable Biriyani", desc: "Mixed vegetables with basmati rice and authentic spices", price: 150, category: "Rice Dishes", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400" },

            { name: "Fish Biriyani", desc: "Fresh fish pieces cooked with rice and coastal spices", price: 200, category: "Rice Dishes", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400" },

            { name: "Paneer Biriyani", desc: "Cottage cheese with rice and flavorful spices", price: 170, category: "Rice Dishes", image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400" },

            { name: "Egg Biriyani", desc: "Boiled eggs with rice and aromatic spices", price: 140, category: "Rice Dishes", image: "https://images.unsplash.com/photo-1551782450-17144efb5723?w=400" }

        ],

        pizza: [

            { name: "Margherita Pizza", desc: "Classic pizza with tomato sauce, mozzarella, and fresh basil", price: 250, category: "Italian", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400" },

            { name: "Pepperoni Pizza", desc: "Spicy pepperoni with cheese and tomato sauce", price: 300, category: "Italian", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400" },

            { name: "Vegetarian Pizza", desc: "Loaded with fresh vegetables and cheese", price: 220, category: "Italian", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400" },

            { name: "BBQ Chicken Pizza", desc: "Grilled chicken with BBQ sauce and cheese", price: 320, category: "Italian", image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400" },

            { name: "Hawaiian Pizza", desc: "Ham and pineapple with cheese", price: 280, category: "Italian", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400" },

            { name: "Four Cheese Pizza", desc: "Blend of four different cheeses", price: 290, category: "Italian", image: "https://images.unsplash.com/photo-1551782450-17144efb5723?w=400" }

        ],

        burger: [

            { name: "Classic Beef Burger", desc: "Juicy beef patty with lettuce, tomato, and special sauce", price: 180, category: "Fast Food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },

            { name: "Chicken Burger", desc: "Crispy chicken patty with mayo and veggies", price: 160, category: "Fast Food", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400" },

            { name: "Veggie Burger", desc: "Plant-based patty with fresh vegetables", price: 140, category: "Fast Food", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400" },

            { name: "Cheese Burger", desc: "Beef patty with melted cheese and toppings", price: 200, category: "Fast Food", image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400" },

            { name: "Bacon Burger", desc: "Beef patty with crispy bacon and cheese", price: 220, category: "Fast Food", image: "https://images.unsplash.com/photo-1551782450-17144efb5723?w=400" },

            { name: "Mushroom Burger", desc: "Beef patty with sautéed mushrooms and cheese", price: 210, category: "Fast Food", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400" }

        ],

        pasta: [

            { name: "Spaghetti Carbonara", desc: "Creamy pasta with bacon, eggs, and parmesan", price: 190, category: "Italian", image: "https://images.unsplash.com/photo-1551892376-c73baef66d00?w=400" },

            { name: "Penne Arrabbiata", desc: "Spicy tomato sauce with penne pasta", price: 170, category: "Italian", image: "https://images.unsplash.com/photo-1551892376-c73baef66d00?w=400" },

            { name: "Fettuccine Alfredo", desc: "Creamy fettuccine with parmesan sauce", price: 200, category: "Italian", image: "https://images.unsplash.com/photo-1551892376-c73baef66d00?w=400" },

            { name: "Pesto Pasta", desc: "Basil pesto with cherry tomatoes and pine nuts", price: 180, category: "Italian", image: "https://images.unsplash.com/photo-1551892376-c73baef66d00?w=400" },

            { name: "Lasagna", desc: "Layered pasta with meat sauce and cheese", price: 220, category: "Italian", image: "https://images.unsplash.com/photo-1551892376-c73baef66d00?w=400" },

            { name: "Mac and Cheese", desc: "Creamy macaroni with cheddar cheese", price: 150, category: "Italian", image: "https://images.unsplash.com/photo-1551892376-c73baef66d00?w=400" }

        ],

        sushi: [

            { name: "California Roll", desc: "Crab, avocado, and cucumber roll", price: 280, category: "Japanese", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400" },

            { name: "Salmon Nigiri", desc: "Fresh salmon over seasoned rice", price: 320, category: "Japanese", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400" },

            { name: "Tuna Sashimi", desc: "Fresh tuna slices", price: 350, category: "Japanese", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400" },

            { name: "Vegetable Tempura Roll", desc: "Tempura vegetables in a roll", price: 240, category: "Japanese", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400" },

            { name: "Dragon Roll", desc: "Eel and avocado roll with special sauce", price: 380, category: "Japanese", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400" },

            { name: "Spicy Tuna Roll", desc: "Spicy tuna with cucumber", price: 300, category: "Japanese", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400" }

        ],

        dosa: [

            { name: "Plain Dosa", desc: "Crispy fermented crepe made from rice and lentil batter", price: 80, category: "South Indian", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400" },

            { name: "Masala Dosa", desc: "Dosa filled with potato masala and served with chutney", price: 120, category: "South Indian", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400" },

            { name: "Onion Dosa", desc: "Dosa topped with crispy onions and spices", price: 100, category: "South Indian", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400" },

            { name: "Paneer Dosa", desc: "Dosa stuffed with spiced paneer filling", price: 140, category: "South Indian", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400" },

            { name: "Chicken Dosa", desc: "Dosa filled with spicy chicken masala", price: 160, category: "South Indian", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400" },

            { name: "Mysore Masala Dosa", desc: "Spicy chutney spread dosa with potato filling", price: 130, category: "South Indian", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400" }

        ],

        default: [

            { name: "Grilled Chicken", desc: "Juicy grilled chicken breast with herbs", price: 200, category: "Main Course", image: "https://images.unsplash.com/photo-1532636875304-0c89119d9b4b?w=400" },

            { name: "Caesar Salad", desc: "Fresh romaine lettuce with caesar dressing", price: 120, category: "Salad", image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400" },

            { name: "Chocolate Cake", desc: "Rich chocolate cake with frosting", price: 100, category: "Dessert", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400" },

            { name: "Fish Tacos", desc: "Grilled fish in corn tortillas", price: 180, category: "Mexican", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400" },

            { name: "Pad Thai", desc: "Thai stir-fried noodles with shrimp", price: 160, category: "Thai", image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400" },

            { name: "Butter Chicken", desc: "Creamy tomato curry with chicken", price: 190, category: "Indian", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400" }

        ]

    };

    // Determine which category to use based on query

    let selectedFoods = [];

    // Check if query includes biriyani

    if (lowerQuery.includes('biriyani') || lowerQuery.includes('biryani')) {

        // Select biriyani foods

        selectedFoods = foodTemplates.biriyani;

        // Check if query includes pizza

    } else if (lowerQuery.includes('pizza')) {

        // Select pizza foods

        selectedFoods = foodTemplates.pizza;

        // Check if query includes burger

    } else if (lowerQuery.includes('burger')) {

        // Select burger foods

        selectedFoods = foodTemplates.burger;

        // Check if query includes pasta

    } else if (lowerQuery.includes('pasta')) {

        // Select pasta foods

        selectedFoods = foodTemplates.pasta;

        // Check if query includes sushi

    } else if (lowerQuery.includes('sushi')) {

        // Select sushi foods

        selectedFoods = foodTemplates.sushi;

        // Check if query includes dosa

    } else if (lowerQuery.includes('dosa')) {

        // Select dosa foods

        selectedFoods = foodTemplates.dosa;

        // Default case

    } else {

        // Select default foods

        selectedFoods = foodTemplates.default;

    }

    // Generate unique IDs and add image placeholders

    return selectedFoods.map((food, index) => ({

        _id: `ai_${Date.now()}_${index}`,

        name: food.name,

        description: food.desc,

        price: food.price,

        category: food.category,

        image: food.image

    }));

};

// Export the functions

export { listFood, addFood, removeFood, aiFoodSearch }