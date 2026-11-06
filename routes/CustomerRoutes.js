const express = require("express");
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/CustomerController");
const { protect } = require("../middleware/Auth");
const { validateCustomerCreate, validateCustomerUpdate } = require("../middleware/validate");

const router = express.Router();

router.use(protect); // every customer route requires login

router.route("/").get(getCustomers).post(validateCustomerCreate, createCustomer);
router
  .route("/:id")
  .get(getCustomer)
  .put(validateCustomerUpdate, updateCustomer)
  .delete(deleteCustomer);

module.exports = router;
