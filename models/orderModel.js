import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  
     products : [{
        type : mongoose.ObjectId , 
        ref : "Products"
     } , 

    ] , 

    payment : {} ,
    buyer : {
        type : String ,
        ref : 'users',         
    } ,
    status : {
         type : String ,
         default : 'Not Process' ,
         enum : ['Not Process' , 'Processing' , 'Shipping' , 'deliverd' , 'cancel'] ,
    } ,
} ,
 {timestamps : true}
);

export default mongoose.model("Order", orderSchema);
