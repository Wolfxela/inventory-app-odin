const express = require("express")
const Item = require("../models/item_model")
const mongoose = require("mongoose")
const { body, validationResult } = require("express-validator")
const asyncHandler = require("express-async-handler")

exports.category_details = asyncHandler(async (req,res,next)=>{
    res.send(`Category details not ready yet`)
})

exports.category_list = asyncHandler(async (req,res,next)=>{
    res.send("category list not ready yet")

})

exports.category_create_get = asyncHandler(async (req,res,next)=>{
    res.send("category create not ready yet")

})

exports.category_create_post = asyncHandler(async (req,res,next)=>{
    res.send("category create post not ready yet")
 
})

exports.category_delete_get = asyncHandler(async (req,res,next)=>{
    res.send("category delete get not ready yet")

})

exports.category_delete_post = asyncHandler(async (req,res,next)=>{
    res.send("category delete post not ready yet")

})

exports.category_update_get = asyncHandler(async (req,res,next)=>{
    res.send("category update get not ready yet")

})

exports.category_update_post = asyncHandler(async (req,res,next)=>{
    res.send("category update post not ready yet")

})