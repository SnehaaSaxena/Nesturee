const express=require("express");
const router=express.Router();

// Index-users
router.get("/",(req,res)=>{
    res.send("GET FOR POST");
});
//Show-users
router.get("/:id",(req,res)=>{
    res.send("GET FOR POST ID")
});
// POST-USERS
router.post("/",(req,res)=>{
    res.send("POST FOR posts");
});
// DELETE-USERS
router.delete("/:id",(req,res)=>{
    res.send("DELETE FOR post ID");
});

module.exports=router;