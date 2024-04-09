import express from "express";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  updateProductController,
  productFiltersController ,
  productCountController  , 
  productListController , 
  searchController , 
  realtedProductController ,
  productCategoryController ,
  braintreeToeknController  , 
  braintreePaymentController , 
  
} from "../controllers/productController.js";

import formidable from "express-formidable";

const router = express.Router();

//routes
router.post(
  "/create-product",
  formidable(),
  createProductController
);
//routes
router.put(
  "/update-product/:pid",
  formidable(),
  updateProductController
);

//get products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/product/:pid", deleteProductController);

router.post('/product-filters' , productFiltersController)

router.get('/product-count' , productCountController)

router.get("/product-list/:page", productListController);

router.get("/search/:keyword", searchController);

router.get("/realted-product/:pid/:cid", realtedProductController);

router.get("/product-category/:slug", productCategoryController);

router.get('/braintree/token' , braintreeToeknController)

router.get('/braintree/payment' , braintreePaymentController)

export default router;
