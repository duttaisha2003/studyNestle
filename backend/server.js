require('dotenv').config();
const  express= require("express");
const main=require("./database");
const materialRoutes = require("./routes/materialRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminroutes");
const cookieParser = require('cookie-parser')
const app=express();
app.use(express.urlencoded({ extended: true })); 
var cors = require('cors'); 
// app.use(cors({
//     origin:'http://localhost:5173',
//     credentials:true
// }));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://study-nestle-three.vercel.app"
  ],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/", materialRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);




// app.post("/registerMeterial",async(req,res)=>{
//     try{
//         await meterial.create(req.body);
//         res.status(200).json({message:"registerd successfully"});
//     }catch(err)
//     {
//         res.status(500).json({message:"Error"+err});
//     }
// })

// app.get("/getMeterial",async(req,res)=>{
//     try{
//         const result=await meterial.find();
//         res.status(200).json({message:"Data fetched successfully",result});
//     }catch(err)
//     {
//         res.status(500).json({message:"Error"+err});
//     }
// })

// app.patch("/updateMeterial",async(req,res)=>{
//     try{
//         const {id,...update}=req.body;

//        await meterial.findByIdAndUpdate(id,update);
//         res.status(200).json({message:"Updated successfully"});
//     }catch(err)
//     {
//         res.status(500).json({message:"Error"+err});
//     }
// })

// app.delete("/delMeterial/:id",async(req,res)=>{
//     try{
//         const result= await meterial.findByIdAndDelete(req.params.id);
//         res.status(200).json({message:"Deleted successfully",result});
//     }catch(err)
//     {
//         res.status(500).json({message:"Error"+err});
//     }
// })

main()
.then(async()=>{
    console.log("connect to db");
    app.listen(3000,()=>{
    console.log("listening at port 3000");
    })
})
.catch(err =>console.log(err));
