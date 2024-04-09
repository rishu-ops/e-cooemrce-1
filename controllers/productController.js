import { error, log } from "console";
import productModel from '../models/productModels.js'
import fs from 'fs';
import slugify from "slugify";
import path from "path";
import cetogaryModels  from "../models/cetogaryModels.js";
import braintree from "braintree"; 
import orderModel from "../models/orderModel.js";
import dotenv from 'dotenv'

 dotenv.config()
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey:  process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};
// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

//delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//upate producta
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};


//  filter 

export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};

    if (checked && checked.length > 0) {
      args.category = checked;
    }

    if (radio && radio.length > 0) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }

    const products = await productModel.find(args);

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while filtering products",
    });
  }
};


export const  productCountController = async (req , res ) => {
  try {
     const total = await productModel.find({}).estimatedDocumentCount()
     res.status(200).send({
      success : true ,
       total
     })

     
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while paginating product",
    });
  }
}


export const productListController = async (req, res) => {
  try {
    const perPage = 8;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

export const searchController = async (req, res) => {
  try {
    // Extract the 'keyword' parameter from the request URL
    const { keyword } = req.params;

    // Use Mongoose to search for products matching the keyword in 'name' or 'description'
    const results = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },  // Case-insensitive regex for 'name'
        { description: { $regex: keyword, $options: 'i' } },  // Case-insensitive regex for 'description'
      ],
    }).select('-photo');  // Exclude the 'photo' field from the results

    // Send the search results as the response
    res.send(results);
  } catch (error) {
    // Log the error to the console for debugging purposes
    console.log(error);

    // If there's an error, send a 400 status response with an error message
    res.status(400).send({
      success: false,
      message: 'Error in the search product API',
      error,
    });
  }
};

export const realtedProductController = async (req, res) => {
 try {
  const {pid , cid }= req.params;

  const products = await productModel.find({
      category : cid ,
      _id : {$ne : pid }  
  }).select("-photo").limit(4).populate("category")
  res.status(200).send({
    success : true ,
     products
  })
   
 } catch (error) {
  console.log(error);

  // If there's an error, send a 400 status response with an error message
  res.status(400).send({
    success: false,
    message: 'Error in the realed product API',
    error,
  });
 }
} 

export  const productCategoryController =   async (req, res) => {

  try {
    const category = await cetogaryModels.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }

}

export const braintreeToeknController = async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({});
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const braintreePaymentController = async (req, res) => {
  try {
    const {  nonce , cart } = req.body;
    let total = 0;

    cart.forEach((item) => {
      total += item.price;
    });

    gateway.transaction.sale({
      amount: total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    }, async (error, result) => {
      if (result) {
        const order = new orderModel({
          products: cart,
          payment: result,
          buyer: req.user._id,
        });

        await order.save();

        res.json({ ok: true });
      } else {
        console.error(error);
        res.status(500).send(error);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
