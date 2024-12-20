import  Mongoose  from "mongoose";
import { Document } from "mongoose";
import { Schema } from "mongoose";

// Lead Interface
export interface ILead extends Document{
    first_name:string;
    last_name:string;
    email:string;
    country_code:number;
    phone: number;
    instagram_user_name:string;
    location:string;
    package_id:string;
    package_name:string;
    no_of_days:number;
    pax:number;
}
 const LeadSchema: Schema<ILead> =new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    country_code: { type: Number, required: true},
    phone:{ type: Number, required: true},
    instagram_user_name:{ type: String, required: true},
    location:{ type: String, required: true},
    package_id:{ type: String, required: true},
    package_name:{ type: String, required: true},
    no_of_days:{ type: Number, required: true},
    // pax:{ type: Number, required: true },
 },{
    timestamps: true, 
  })
const Lead = Mongoose.model<ILead>('Lead', LeadSchema);
 export default Lead;
   

