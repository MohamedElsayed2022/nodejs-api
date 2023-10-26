const { body } = require("express-validator")

const validationschema = ()=>{
 return  [
        body("title")
          .notEmpty()
          .withMessage("Price Is Required")
          .isLength({ min: 2 }),
        body("price").notEmpty().withMessage("Price IS Required"),
      ]
}
module.exports = {
    validationschema
}