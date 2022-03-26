
const Product = require("../models/products");
const slugify = require("slugify");

exports.create = async (req, res) => {
    try{
     console.log(req.body);
     req.body.slug = slugify(req.body.title);
     const newProduct = await new Product(req.body).save();
     res.json(newProduct);
    }catch (err) {
      console.log(err);
      res.status(400).send("Create Product failed");
    }
}; 

exports.listAll = async (req, res) => {
  let products = await Product.find({})
  .limit(parseInt(req.params.count))
  .populate("category")
  .sort([["createdAt", "desc"]])
  .exec();
  res.json(products);
}

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Product delete failed");
  }
}

exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })  
  .populate("category")
  .exec();
  res.json(product);
};

exports.update = async (req, res) => {
  try {
    if(req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      {slug: req.params.slug}, 
       req.body, 
       {new: true}
    ).exec();
    res.json(updated);
  } catch (err) {
    console.log('PRODUCT UPDATE ERROR ----> ', err);
    res.status(400).json({
      err: err.message,
    })
  }
}

exports.list = async (req, res) => {
  try {
    const {sort, order, limit} = req.body
    const products = await Product.find({})
    .populate('category')
    .sort([[sort, order]])
    .limit(limit)
    .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
}

// SEARCH / FILTER

const handleQuery = async (req, res, query) => {
  // Text based Search
  const products = await Product.find({ $text: { $search: query }})
  .populate('category', '_id name')
  .exec();

  res.json(products)
} 



const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
     .populate("category", "_id name")
     .exec();
    
    res.json(products);
  }catch (err) {
    console.log(err);
  }
}



exports.searchFilters = async (req, res) => {
    const { query,  category } = req.body;

    if (query) {
      console.log("query", query);
      await handleQuery(req, res, query);
    }


    // categories
    if (category) {
      console.log("category ---> ", category);
      await handleCategory(req, res, category);
    }

  
}