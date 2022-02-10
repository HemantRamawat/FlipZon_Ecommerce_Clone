const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary =   require("cloudinary");
exports.createProduct = catchAsyncErrors(async(req,res,next) => {
    

  let images = [];
  if(typeof req.body.images === "string"){
    images.push(req.body.images);
  }else{
    images = req.body.images;
  }

  const imagesLink = [];
  for(let i=0; i<images.length; i++){
    const result = await cloudinary.v2.uploader.upload(images[i],{
      folder: "products",
    });

    imagesLink.push({
      public_id: result.public_id,
      url: result.secure_url
    })
  }
  req.body.images = imagesLink;
  req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({ 
        success: true,
        product
    })
});
exports.getAllProducts = catchAsyncErrors(async(req,res)=>{
        const resultPerPage = 100;
        const productCount = await Product.countDocuments();
        const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        
        .pagination(resultPerPage)
        
    const products = await apiFeature.query ;
    res.status(200).json({
    success:true,
    products,
    productCount,
    
    resultPerPage
    })
    console.log(products);
});

exports.getAdminProducts = catchAsyncErrors(async(req,res)=>{
 
const products = await Product.find();
res.status(200).json({
success:true,
products,
})
console.log(products);
});


exports.updateProduct = catchAsyncErrors(async(req,res,next)=>{
let product = await Product.findById(req.params.id);
if(!product){
    return res.status(500).json({
        success:false,
        message: 'Product not found'
    })
}
product= await Product.findByIdAndUpdate(req.params.id, req.body,{
    new:true,
    runValidators:true,
    useFindAndModify:true

});

res.status(200).json({
    success:true,
    product
})
});

exports.deleteProduct = catchAsyncErrors(async(req, res, next) =>{
    const product = await Product.findById(req.params.id);
    if(!product) return res.status(500).json({success:false, message: 'Product not found'})
    await product.remove();

    res.status(200).json({success:true, message: 'Product deleted'})
});


exports.getProductDetails =catchAsyncErrors( async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product) return next(new ErrorHander("Product Not Found", 404));

    res.status(200).json({success:true, product})
    console.log(product);
});

// Update Product -- Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    // Images Start Here
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    if (images !== undefined) {
      // Deleting Images From Cloudinary
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }
  
      const imagesLinks = [];
  
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
  
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
  
      req.body.images = imagesLinks;
    }
  
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
      product,
    });
  });
  
  // Delete Product
  
  exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
  
    await product.remove();
  
    res.status(200).json({
      success: true,
      message: "Product Delete Successfully",
    });
  });
  
  // Create New Review or Update the review
  exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { ratings, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      ratings: Number(ratings),
      comment,
    };
  
    const product = await Product.findById(productId);
    
    const isReviewed = product.reviews.find(
      (rev) => {
        (typeof rev.user == "undefined" || rev.user.toString() === req.user._id.toString())
      }
      );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        (typeof rev.user == "undefined" || rev.user.toString() === req.user._id.toString())
          (rev.ratings = ratings), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.ratings;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });
  
  // Get All Reviews of a product
  exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });
  
  // Delete Review
  exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });