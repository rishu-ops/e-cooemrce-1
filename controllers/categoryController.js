import cetogaryModels from "../models/cetogaryModels.js";
import slugify from "slugify";

export const createCategoryController = async(req , res) => {
 try {
    const {name} = req.body 
    if(!name ) {
        return  res.status(401).send({message : "name is required"});
    }
    const existingCategory = await cetogaryModels.findOne({name})
    if(existingCategory) { 
        return res.status(200).send({
            success : false ,
            message : "Category already Exist"
        })
    }
    
  const category = await new cetogaryModels({name ,
     slug:slugify(name)}).save()
    res.status(201).send({
        success : true ,
        message : "new category created" ,
        category ,
    })
    
 } catch (error) {
    console.log(error);
    res.status(500).send({
        success : false ,
        error ,
        message : 'Error in category'
    })
 }     
};

export const updateCategoryConroller = async (req, res) => {
    try {
      const { name } = req.body;
      const { id } = req.params;
      
      // If authentication is required, make sure to use the middleware
      // requireSignIn(req, res);
  
      const category = await cetogaryModels.findOneAndUpdate(
        { _id: id },
        { name, slug: slugify(name) },
        { new: true }
      );
  
      res.status(201).send({
        success: true,
        message: "Category updated",
        category,
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while updating category",
      });
    }
  };

export const categoryController = async (req, res) => {
    try {
      const category = await cetogaryModels.find({});
      res.status(200).send({
        success: true,
        message: "All categories list ",
        category
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while getting all category"
      });
    }
  };
   

  export const singleCategoryController = async (req, res) => {
    try {
      const category = await cetogaryModels.findOne({ slug: req.params.slug });
  
      res.status(200).send({
        success: true,
        message: "Category details",
        category
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while getting single category"
      });
    }
  };
  

  export const deleteCategoryController = async (req, res) => {
    try {
      const { id } = req.params;
      await cetogaryModels.findByIdAndDelete(id);
      res.status(200).send({
        success: true,
        message: "Category deleted"
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while deleting single category"
      });
    }
  };
  