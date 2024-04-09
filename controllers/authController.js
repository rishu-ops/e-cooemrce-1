import { comparePassword, hashPassword } from "../helpers/authHelper.js"
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import jwt from 'jsonwebtoken';


export const registerController = async (req , res ) => {
     try {
        const {name , email , password , phone , address , question } = req.body

        if(!name){
        
            return res.send({message : "name is Required"})
        }
        if(!email){
        
            return res.send({message : "email is Required"})
        }
        if(!password){
        
            return res.send({message : "password is Required"})
        }
        if(!phone){
        
            return res.send({message : "name is phone"})
        }
        if(!address){
        
            return res.send({message : "name is address"})
        }
        if(!question){
        
          return res.send({message : "awnser is address"})
      }


        //  checking exiting user 
  
        const user = await userModel.findOne({email})
        if(user) {
             return res.status(200).send({
                 success : false ,
                message : 'already register please login '
             })
        }   

    const hashedpassword = await hashPassword(password)
    const usermodel = await new userModel({name , email , phone ,  address , password : hashedpassword , question}).save() 

     res.status(201).send({
        success : true ,
        messagse : "user registered successfully " ,
        usermodel
     })


     } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false ,
            message : "error in registraton" ,
            error 
        })
        
     }
}
 
// Login controller function
export const loginController = async (req, res) => {
    try {
      // Destructuring email and password from the request body
        console.log("dsfs");
      const { email, password } = req.body;
  
      // Check if email or password is missing
      if (!email || !password) {
        return res.status(404).send({
          success: false,
          message: 'Invalid email and password',
        });
      }
  
      // Find user by email in the database
      const user = await userModel.findOne({ email });
  
      // Check if the user exists
      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'Email is not registered',
        });
      }
  
      // Compare the provided password with the hashed password stored in the database
      const match = await comparePassword(password, user.password);
  
      // Check if the password is invalid
      if (!match) {
        return res.status(404).send({
          success: false,
          message: 'Invalid password',
        });
      }
  
      // Generate a JWT token for the authenticated user
      const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
  
    
      // Send a successful response with user details and the generated token
      res.status(200).send({
        success: true,
        message: 'Login successfully',
        user: {
          _id : user._id ,
          name: user.name,
          email: user.email,
          phone : user.phone ,
          role : user.role , 
          address  : user.address
        },
        token,
      });
  
    } catch (error) {
      // Handle any errors that occur during the authentication process
      console.error(error);
      res.status(500).send({
        success: false,
        message: 'Error in login',
        error,
      });
    }
  };

export const testController = async (req ,res) => {
    res.send("protected rooute")
}

export const forgotPasswordController = async (req , res) => {

    try {
      const {email , question , newpassword} = req.body 
      
      if(!email){
        
        return res.send({message : "email is Required"})
    }

    if(!question){
        
      return res.send({message : "question is Required"})
    }
   
     if(!newpassword){
        
      return res.send({message : "newpassword is Required"})
     }

    //   checking the email 
    const user = await userModel.findOne({email , question })

    if(!user){ 
        return res.status(404).send({
          success : false ,
          messge : "wrong email and password "
        })
    }
    const  hashed = await hashPassword( newpassword );
    await userModel.findByIdAndUpdate(user._id , {password : hashed});
    res.status(200).send({
      success : true ,
      message : "password is reset successfully"
    })
     
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success : false ,
        message : "something went wrong" ,
        error
      })
    }
}


export const  updateProfileController = async (req , res) => {
   try {
     const {  name , email , password , phone , address } = req.body
     const user = await userModel.findById(req.user._id)
       console.log(user); 
      if(password  && password.length < 6 ) {
         return res.json({error : "password is required and should br more than 6 character"})

      }
 
       const hashedPassword = password ?  await hashPassword(password) : undefined
       const updateUser= await userModel.findByIdAndUpdate(req.user._id , {
       name  : name  || user.name ,
       password : hashedPassword || user.password,
       phone : phone || user.phone  ,
       address : address || user.address
       } , {new : true})
       
       res.status(200).send({
        success : true ,
         message : "profile updated",
         updateUser
       })

     
   } catch (error) {
     res.status(500).send({
      success : false ,
      message : "error in updatin profile" ,
      error : error
    })
   }
}

