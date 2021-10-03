const express = require('express');
const passport = require("passport");
const router = express.Router();
const userProduct = require("../../../../controllers/api/v1/user_product")
const { getProductId, getCartId } = require("../../../../middleware/checkProduct")


router.param("productId", getProductId)
router.param("cartId", getCartId)


// get products with pagination
router.get("/", passport.authenticate("user", { session: false })
    , userProduct.getProducts
)

// create product
router.post("/:productId/add-to-cart", passport.authenticate("user", { session: false })
    , userProduct.addToCart
)

router.post("/:productId/delete-from-cart", passport.authenticate("user", { session: false })
    , userProduct.deleteFromCart
)
// actionType will be inc or dec
router.put("/:productId/:actionType/cart", passport.authenticate("user", { session: false })
    , userProduct.cartIncOrDec
)

//delete product
// router.put("/:productId/update", passport.authenticate("user", { session: false })
//     , adminProduct.update
// )

// // update product

// router.put("/:productId/update", passport.authenticate("user", { session: false })
//     , adminProduct.updateProduct
// )




module.exports = router;
