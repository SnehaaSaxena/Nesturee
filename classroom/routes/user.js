const express=require("express");
const router=express.Router();

// Index-users
router.get("/",(req,res)=>{
    res.send("GET FOR USERS");
});
//Show-users
router.get("/:id",(req,res)=>{
    res.send("GET FOR USER ID")
});
// POST-USERS
router.post("/",(req,res)=>{
    res.send("POST FOR USERS");
});
// DELETE-USERS
router.delete("/:id",(req,res)=>{
    res.send("DELETE FOR USER ID");
});

module.exports=router;