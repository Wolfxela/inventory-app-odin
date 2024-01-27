const express = require("express")
const Item = require("../models/item_model")
const Category = require("../models/category_model")
const mongoose = require("mongoose")
const { body, validationResult } = require("express-validator")
const asyncHandler = require("express-async-handler")

exports.category_details = asyncHandler(async (req,res,next)=>{
    const [category,items] = await Promise.all([Category.findById(req.params.id).exec(), Item.find({category: req.params.id}).populate("category").exec()]) 
    res.render("category_views/category_details",{title: category.name,category:category,items:items})
})

exports.category_list = asyncHandler(async (req,res,next)=>{
    const allCategories = await Category.find().sort({name:1}).exec()
    res.render("category_views/category_list",{title:"Categories",categories: allCategories})

})

exports.category_delete_get = asyncHandler(async (req,res,next)=>{
    const [category,items] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({category: req.params.id}).sort({name:1}).exec()]) 
        
    if (category === null) {
    // No results.
        res.redirect("/catalog/categories");
    }

    res.render("category_views/category_delete",{title:`Delete category: ${category.name}`,category:category,items:items})

})

exports.category_delete_post = asyncHandler(async (req,res,next)=>{
    const [category,items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({category: req.params.id}).sort({name:1}).exec()]) 
        
    if(items.length > 0)
    {
        res.render("category_views/category_delete",{title:`Delete category: ${category.name}`,category:category,items:items})
        
    }else{
        await Category.findByIdAndDelete(req.body.categoryID).exec()
        res.redirect('/catalog/categories')
    }

})

exports.category_create_get = asyncHandler(async (req,res,next)=>{
    res.render("category_views/category_form",{title:"Create Category"})

})

exports.category_create_post = [
    body("name","Category name must contain at least 3 charracters")
    .trim()
    .isLength({min:1})
    .escape(),
    body("description")
    .optional({values:"falsy"})
    .escape(),

    asyncHandler(async (req,res,next)=>{
        const errors =  validationResult(req)
        const category = new Category({name:req.body.name,description:req.body.description})
        if(!errors.isEmpty()){
            res.render("category_views/category_form",{title:"Create Category",category:category, errors:errors.array()})
        }else{
            const categoryExists = await Category.findOne({name:req.body.name}).collation({locale:"en",strength:2}).exec()
            if(categoryExists){
                res.redirect(categoryExists.url)
            }else{
            await category.save()
            res.redirect(category.url)
            }
        }
    })
 ]

exports.category_update_get = asyncHandler(async (req,res,next)=>{

    const category = await Category.findById(req.params.id)

    if(category === null){
        res.redirect("/catalog/categories")
    }else{
        res.render("category_views/category_form",{title:"Update Category",category:category})
    }
})

exports.category_update_post = [
    body("name","Category name must contain at least 3 charracters")
    .trim()
    .isLength({min:1})
    .escape(),
    body("description")
    .optional({values:"falsy"})
    .escape(),

    asyncHandler(async (req,res,next)=>{
        const errors =  validationResult(req)
        const category = new Category({name:req.body.name,description:req.body.description,_id: req.params.id})

        if(!errors.isEmpty()){

            res.render("category_views/category_form",{title:"Create Category",category:category, errors:errors.array()})
        }
        else{
            await Category.findByIdAndUpdate(req.params.id,category)
            res.redirect(category.url)
        }
    })]