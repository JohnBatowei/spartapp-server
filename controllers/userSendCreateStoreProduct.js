const productModel = require("../models/product");



module.exports.sendAllCreateStoreProduct = async function(req, res) {
  try {
    const products = await productModel.find().populate({
      path: 'storeId',
      select: '-products'
    }).populate({
      path: 'storeIdOff',
      select: '-products -storeDesign -storeDescriptionName'
    }).lean();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Products not found" });
    }

    const productsWithImages = [];
    const officialProductsWithImages = [];
    const regular = [];
    const random = [];
    const spartAppBestPrices = [];
    const flashSales = [];
    const topDealsOneWay = [];

    for (const productObj of products) {
      const store = productObj.storeId;
      const store2 = productObj.storeIdOff;
      if (store) {
        const productWithImage = {
          categoryName: productObj.categoryName,
          storeId: store._id,
          productId: productObj._id,
          image: `${req.protocol}://${req.get("host")}/uploads/${productObj.image}`,
          productName: productObj.productName,
          amount: productObj.amount,
          discountPercentage: productObj.discountPercentage,
          discountedAmount: productObj.discounted ? productObj.discountedAmount : productObj.amount,
          discounted: productObj.discounted,
          quantityLeft: productObj.quantityLeft,
          productType: productObj.productType,
          storeDesign: store.storeDesign, 
          storeDescriptionName: store.storeDescriptionName, 
          details: productObj.details
        };

        productsWithImages.push(productWithImage);
   
      }

      if (store2) {
        const OffProductWithImage = {
          categoryName: productObj.categoryName,
          storeId: store2._id,
          productId: productObj._id,
          image: `${req.protocol}://${req.get("host")}/uploads/${productObj.image}`,
          productName: productObj.productName,
          amount: productObj.amount,
          discountPercentage: productObj.discountPercentage,
          discountedAmount: productObj.discounted ? productObj.discountedAmount : productObj.amount,
          discounted: productObj.discounted,
          quantityLeft: productObj.quantityLeft,
          productType: productObj.productType,
          details: productObj.details
        };
        officialProductsWithImages.push(OffProductWithImage);
      }
    }

  

    for(const i of productsWithImages){
      switch (i.storeDesign) {
        case "regular":
          regular.push(i);
          break;
        case "random":
          random.push(i);
          break;
        case "spartAppBestPrices":
          spartAppBestPrices.push(i);
          break;
        case "flashSales":
          flashSales.push(i);
          break;
        case "topDealsOneWay":
          topDealsOneWay.push(i);
          break;
        default:
          break;
      }
    }

    // console.log(officialProductsWithImages)
    // console.log( productsWithImages )


    res.status(200).json({
      products: productsWithImages || [],
      officialProducts: officialProductsWithImages || [],
      regular: regular || [],
      random: random || [],
      spartAppBestPrices: spartAppBestPrices || [],
      flashSales: flashSales || [],
      topDealsOneWay: topDealsOneWay || []
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

