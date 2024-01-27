const express = require("express")
const Category = require("../models/category_model")
const Item = require("../models/item_model")
const mongoose = require("mongoose")
const { body, validationResult } = require("express-validator")
const asyncHandler = require("express-async-handler")

exports.index = asyncHandler(async(req,res,next)=>{
    res.redirect('/catalog/items')
})

exports.item_details = asyncHandler(async (req,res,next)=>{
    const item = await Item.findById(req.params.id).populate("category").exec()

    res.render("item_views/item_details",{title:item.name,item:item})
})

exports.item_list = asyncHandler(async (req,res,next)=>{
    const allItems = await Item.find().sort({name:1}).populate("category").exec()
    res.render("item_views/item_list",{title:"All Items",items:allItems})

})

exports.item_create_get = asyncHandler(async (req,res,next)=>{
    const allCategories = await Category.find().sort({name:1}).exec()

    res.render("item_views/item_form",{title:"Create Item",categories:allCategories})

})

exports.item_create_post = [
    (req,res,next)=>{
        if(!Array.isArray(req.body.category)){
            req.body.category = typeof req.body.category === "undefined" ? [] : [req.body.category]
        }
        next()
    },
    body("name","Item name must contain at least 3 charracters")
    .trim()
    .isLength({min:3})
    .escape(),
    body("description")
    .optional({values:"falsy"})
    .escape(),
    body("price","price must be a whole number bigger than 0")
    .trim()
    .isInt({min:1})
    .escape(),
    body("stock","stock must be a whole number that is at least 0")
    .trim()
    .isInt({min:1})
    .escape(),
    body("category")
    .trim()
    .optional({values:"falsy"})
    .escape(),
    

    asyncHandler(async (req,res,next)=>{
        const errors =  validationResult(req)

        const item = new Item({
            name:req.body.name,
            description:req.body.description,
            price:req.body.price,
            category:req.body.category,
            stock:req.body.stock})

        if(!errors.isEmpty()){
            const allCategories = await Category.find().sort({name:1}).exec()

            for(const category of allCategories){
                if(item.category.includes(category._id)){
                  category.checked = "true"
                }
              }

            res.render("item_views/item_form",{title:"Create Item",categories:allCategories,item:item, errors:errors.array()})
        }else{
            const itemExists = await Item.findOne({name:req.body.name}).collation({locale:"en",strength:2}).exec()
            if(itemExists){
                res.redirect(itemExists.url)
            }else{
            await item.save()
            res.redirect(item.url)
            }
        }
    })
]

exports.item_delete_get = asyncHandler(async (req,res,next)=>{
    const item = await Item.findById(req.params.id).exec()
        
    if (item === null) {
    // No results.
        res.redirect("/catalog/items");
    }

    res.render("item_views/item_delete",{title:`Delete Item: ${item.name}?`,item:item})


})

exports.item_delete_post = asyncHandler(async (req,res,next)=>{
    await Item.findByIdAndDelete(req.body.itemID)
    res.redirect("/catalog/items")

})

exports.item_update_get = asyncHandler(async (req,res,next)=>{
    const [item,allCategories] = await Promise.all([Item.findById(req.params.id),Category.find().sort({name:1}).exec()])



    if(item === null){
        res.redirect("/catalog/items")
    }else{
        for(const category of allCategories){
            if(item.category.includes(category._id)){
              category.checked = "true"
            }
          }
        res.render("item_views/item_form",{title:"Update Item", item:item,categories:allCategories})
    }

})

exports.item_update_post = [
    (req,res,next)=>{
        if(!Array.isArray(req.body.category)){
            req.body.category = typeof req.body.category === "undefined" ? [] : [req.body.category]
        }
        next()
    },
    body("name","Item name must contain at least 3 charracters")
    .trim()
    .isLength({min:3})
    .escape(),
    body("description")
    .optional({values:"falsy"})
    .escape(),
    body("price","price must be a whole number bigger than 0")
    .trim()
    .isInt({min:1})
    .escape(),
    body("stock","stock must be a whole number that is at least 0")
    .trim()
    .isInt({min:1})
    .escape(),
    body("category")
    .trim()
    .optional({values:"falsy"})
    .escape(),
    

    asyncHandler(async (req,res,next)=>{
        const errors =  validationResult(req)

        const item = new Item({
            name:req.body.name,
            description:req.body.description,
            price:req.body.price,
            category:req.body.category,
            stock:req.body.stock,
            _id: req.params.id
        })

        if(!errors.isEmpty()){
            const allCategories = await Category.find().sort({name:1}).exec()

            for(const category of allCategories){
                if(item.category.includes(category._id)){
                  category.checked = "true"
                }
              }

            res.render("item_views/item_form",{title:"Create Item",categories:allCategories,item:item, errors:errors.array()})
        }else{
            await Item.findByIdAndUpdate(req.params.id,item)
            res.redirect(item.url)
        }
    })
]