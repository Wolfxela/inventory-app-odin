const express = require("express")
const Category = require("../models/category_model")
const mongoose = require("mongoose")
const { body, validationResult } = require("express-validator")
const asyncHandler = require("express-async-handler")

exports.index = asyncHandler(async(req,res,next)=>{
    res.render("index",{title: "Inventory Management App"})
})

exports.item_details = asyncHandler(async (req,res,next)=>{
    res.send(`item details not ready yet`)
})

exports.item_list = asyncHandler(async (req,res,next)=>{
    res.send("item list not ready yet")

})

exports.item_create_get = asyncHandler(async (req,res,next)=>{
    res.send("item create not ready yet")

})

exports.item_create_post = asyncHandler(async (req,res,next)=>{
    res.send("item create post not ready yet")
 
})

exports.item_delete_get = asyncHandler(async (req,res,next)=>{
    res.send("item delete get not ready yet")

})

exports.item_delete_post = asyncHandler(async (req,res,next)=>{
    res.send("item delete post not ready yet")

})

exports.item_update_get = asyncHandler(async (req,res,next)=>{
    res.send("item update get not ready yet")

})

exports.item_update_post = asyncHandler(async (req,res,next)=>{
    res.send("item update post not ready yet")

})