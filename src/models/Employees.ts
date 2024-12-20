import  Mongoose  from "mongoose";
import { Document } from "mongoose";
import { Schema } from "mongoose";

// Lead Interface
export interface IEmployee extends Document{
    first_name:string;
    last_name:string;
    email:string;
    password:string;
   
}
 const EmployeeSchema: Schema<IEmployee> =new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
 },{
    timestamps: true, 
  })
 const Employee = Mongoose.model<IEmployee>('Employee', EmployeeSchema);
 export default Employee;
   

