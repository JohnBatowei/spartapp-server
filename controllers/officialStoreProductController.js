const officialStoreModel = require("../models/officialStore");
const deleteUploadImage = require("../deleteImage");
const productModel = require("../models/product");


module.exports.createStoreProduct = async function (req, res) {
  try {
    // Assuming you're handling a single file upload
    const file = req.file;

    // Access other form fields from req.body
    const {
      storeId,
      productName,
      amount,
      discountPercentage,
      discountedAmount,
      discounted,
      quantity,
      quantityLeft,
      productType,
      initialAmount,
      details,
      categoryIdName
    } = req.body;

    // Check if the store with the given storeId exists
    const existingStore = await officialStoreModel.findById(storeId);
    if (!existingStore) {
      return res.status(404).json({ error: "Oops store does not exist" });
    }
    if (!productType || productType === "undefined") {
      return res.status(202).json({ error: "Please select product type" });
    }
    // Process the data as needed and save it to the database
    const productData = {
      storeId,
      storeIdOff : existingStore._id,
      image: file.filename, // Assuming you want to store the filename in the database
      productName,
      amount,
      discountPercentage,
      discountedAmount,
      discounted,
      quantity,
      quantityLeft: quantity,
      productType,
      initialAmount,
      details,
      categoryName: categoryIdName,
      userId : req.admin
    };

    const newProduct = new productModel(productData);
    // Save the data to the database using Mongoose
    const saveProduct = await newProduct.save();
    if (!saveProduct) {
      return res.status(404).json({ error: "Server error saving product" });
    }
    const storeProduct = await officialStoreModel.findOneAndUpdate(
      { _id: storeId },
      { $push: { products: saveProduct._id } },
      { new: true }
      );

    res
      .status(200)
      .json({
        message: `${productName} product has been added to ${storeProduct.name} store`
      });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//read all the product from the specific store
module.exports.getOfficialStoreProducts = async function (req, res) {
  try {
    const storeId = req.params.id;

    // Find the store by ID using the correct model
    const store = await officialStoreModel.findById(storeId).populate('products');

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Include image data for each product
    const productsWithImages = store.products.map((product) => ({
      storeId: product.storeId,
      _id: product._id,
      image: `${req.protocol}://${req.get("host")}/uploads/${product.image}`, // Assuming image is a filename
      productName: product.productName,
      amount: product.amount,
      discountPercentage: product.discountPercentage,
      discountedAmount: product.discounted
        ? product.discountedAmount
        : product.amount, // Set to regular amount if not discounted
      discounted: product.discounted, // Convert Mongoose document to plain object
      quantityLeft: product.quantityLeft,
      productType: product.productType,
      initialAmount: product.initialAmount,
      details: product.details,
      categoryName: product.categoryName,
    }));

    const product = [];
    for (let i = productsWithImages.length - 1; i >= 0; i--) {
      product.push(productsWithImages[i]);
    }
    // console.log(product)
    // Return the products of the store with image data
    res.status(200).json({ products: product || [], storeName: store.name });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// module.exports.updateOfficialStoreProduct = async function (req, res) {
//   try {
//     const {
//       storeId,
//       productName,
//       amount,
//       discountPercentage,
//       discountedAmount,
//       discounted,
//       quantity,
//       productID,
//       productType,
//       details
//     } = req.body;
//     // const file = req.file
//     const incomingQuantity = parseInt(quantity);
//     // console.log(req.body,file)
//     const store = await officialStoreModel.findById(storeId);

//     if (!store) {
//       return res.status(400).json({ message: `Store not found` });
//     }

//     for (const product of store.products) {
//       if (product._id == productID) {
//         const oldQuantityLeft = parseInt(product.quantityLeft); // Store the old quantityLeft
//         const quantityLeftDifference = incomingQuantity - oldQuantityLeft;

//         // Check if the entered quantityLeft is less than the current quantityLeft
//         if (incomingQuantity < oldQuantityLeft) {
//           // console.log('less down')
//           return res
//             .status(202)
//             .json({
//               message:
//                 "New quantity must be greater than the remaining quantity"
//             });
//         }

//         if (discounted != "true") {
//           // If discounted is false, update fields without discount logic
//           product.productName = productName;
//           product.amount = discountedAmount;
//           product.discounted = discounted;
//           product.discountedAmount = 0;
//           product.discountPercentage = discountPercentage;
//           product.quantity =
//             quantityLeftDifference + parseInt(product.quantity);
//           product.quantityLeft = incomingQuantity;
//           product.productType = productType;
//           product.details = details;

//           // Update image if provided
//           if (req.file) {
//             // Delete the previous image if it exists
//             deleteUploadImage(product.image);
//             product.image = req.file.filename;
//           }
//         } else {
//           if (discountPercentage < "1") {
//             return res
//               .status(202)
//               .json({ message: "Discount percentage cannont be less than 1%" });
//           }
//           // If discounted is true, calculate and update fields with discount logic
//           product.productName = productName;
//           product.quantity =
//             quantityLeftDifference + parseInt(product.quantity);
//           product.amount = discountedAmount;
//           product.discounted = discounted;
//           product.quantityLeft = incomingQuantity;
//           product.discountPercentage = discountPercentage;
//           product.productType = productType;
//           product.details = details;
//           const discount =
//             (parseFloat(discountPercentage) / 100) *
//             parseFloat(discountedAmount);
//           product.discountedAmount = parseFloat(discountedAmount) - discount;

//           // Update image if provided
//           if (req.file) {
//             // Delete the previous image if it exists
//             deleteUploadImage(product.image);
//             product.image = req.file.filename;
//           }

//           // Update amount field
//           product.amount = parseFloat(amount);
//         }

//         break;
//       }
//     }

//     // Save the updated store to the database
//     await store.save();

//     return res.status(200).json({ message: `Product updated successfully` });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

module.exports.updateOfficialStoreProduct = async function(req,res){
  try {
    // console.log(req.admin)
        const {
      storeId,
      productName,
      amount,
      discountPercentage,
      discountedAmount,
      discounted,
      quantity,
      productID,
      productType,
      details
    } = req.body;
    const incomingQuantity = parseInt(quantity);
    const product = await productModel.findById(productID);
    
    if (!product) {
            return res.status(400).json({ message: `Product not found` });
        }
    
        const oldQuantityLeft = parseInt(product.quantityLeft); // Store the old quantityLeft
        const quantityLeftDifference = incomingQuantity - oldQuantityLeft;

        // Check if the entered quantityLeft is less than the current quantityLeft
        if (incomingQuantity < oldQuantityLeft) {
          return res
            .status(202)
            .json({
              message:
                "New quantity must be greater than the remaining quantity"
            });
        }

        if (discounted != "true") {
          // If discounted is false, update fields without discount logic
          product.productName = productName;
          product.amount = discountedAmount;
          product.discounted = discounted;
          product.discountedAmount = 0;
          product.discountPercentage = discountPercentage;
          product.quantity =
            quantityLeftDifference + parseInt(product.quantity);
          product.quantityLeft = incomingQuantity;
          product.productType = productType;
          product.details = details;

          // Update image if provided
          if (req.file) {
            // Delete the previous image if it exists
            deleteUploadImage(product.image);
            product.image = req.file.filename;
          }
            // Save the updated store to the database
    await product.save();
    return res.status(200).json({ message: `Product updated successfully` });
        } else {
          if (discountPercentage < "1") {
            return res
              .status(202)
              .json({ message: "Discount percentage cannont be less than 1%" });
          }
          // If discounted is true, calculate and update fields with discount logic
          product.productName = productName;
          product.quantity =
            quantityLeftDifference + parseInt(product.quantity);
          product.amount = discountedAmount;
          product.discounted = discounted;
          product.quantityLeft = incomingQuantity;
          product.discountPercentage = discountPercentage;
          product.productType = productType;
          product.details = details;
          const discount =
            (parseFloat(discountPercentage) / 100) *
            parseFloat(discountedAmount);
          product.discountedAmount = parseFloat(discountedAmount) - discount;

          // Update image if provided
          if (req.file) {
            // Delete the previous image if it exists
            deleteUploadImage(product.image);
            product.image = req.file.filename;
          }

          // Update amount field
          product.amount = parseFloat(amount);
            // Save the updated store to the database
    await product.save();
    return res.status(200).json({ message: `Product updated successfully` });
        }

  } catch (error) {
    console.log(error.message);
//     return res.status(500).json({ message: "Internal Server Error" });
  }
}

// module.exports.deleteOfficialStoreProduct = async function (req, res) {
//   try {
//     const { storeId, productId } = req.params;

//     // Find the store by ID using the correct model
//     const store = await officialStoreModel.findById(storeId);

//     if (!store) {
//       return res.status(404).json({ message: "Store not found" });
//     }

//     // Find the index of the product with the given productId
//     const productIndex = store.products.findIndex(
//       (product) => product._id.toString() === productId
//     );

//     if (productIndex === -1) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Get the image name of the product
//     const imageName = store.products[productIndex].image;

//     // Remove the product from the products array
//     store.products.splice(productIndex, 1);

//     // Save the updated store to the database
//     await store.save();

//     // Delete the associated image
//     deleteUploadImage(imageName);

//     res
//       .status(200)
//       .json({
//         message: "You have successfully removed the product from its store"
//       });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

module.exports.deleteOfficialStoreProduct = async function (req, res) {
  try {
    const { storeId, productId } = req.params;

    // Find the store by ID using the correct model
    const store = await officialStoreModel.findById(storeId);
    const deleteProduct = await productModel.findByIdAndDelete(productId)

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }


    // Find the index of the product with the given productId
    const productIndex = store.products.findIndex(
      (product) => product._id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get the image name of the product
    const imageName = store.products[productIndex].image;

    // Remove the product from the products array
    store.products.splice(productIndex, 1);

    // Save the updated store to the database
    await store.save();

    // Delete the associated image
    deleteUploadImage(deleteProduct.image);

    res
      .status(200)
      .json({
        message: "You have successfully removed the product from its store"
      });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
