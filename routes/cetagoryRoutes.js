import express  from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddlewares.js";

import { createCategoryController 
    , updateCategoryConroller 
    ,  categoryController 
    ,  singleCategoryController 
    , deleteCategoryController  } 
    from "../controllers/categoryController.js";



const router = express.Router();
// create category
router.post('/create-category',   createCategoryController);

// Update category
router.put('/update-category/:id' ,  updateCategoryConroller);

// Get all categories
router.get('/get-category', categoryController);

// Get single category
router.get('/single-category/:slug', singleCategoryController);

// Delete category
router.delete('/delete-category/:id',  deleteCategoryController);

export default router;