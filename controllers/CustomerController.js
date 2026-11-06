const Customer = require("../models/CustomerModel");

const FIELDS = ["name", "email", "phone", "company", "status", "notes"];
const pick = (body) =>
  Object.fromEntries(FIELDS.filter((f) => body[f] !== undefined).map((f) => [f, body[f]]));

// Finds a customer that belongs to the logged-in user, or sends 404
const findOwned = async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, owner: req.user._id });
  if (!customer) {
    res.status(404).json({ success: false, message: "Customer not found" });
  }
  return customer;
};

// GET /api/customers?search=&status=
const getCustomers = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const query = { owner: req.user._id };

    if (status && ["lead", "active", "inactive"].includes(status)) query.status = status;
    if (search) {
      const rx = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [{ name: rx }, { email: rx }, { company: rx }];
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: customers.length, customers });
  } catch (error) {
    next(error);
  }
};

// GET /api/customers/:id
const getCustomer = async (req, res, next) => {
  try {
    const customer = await findOwned(req, res);
    if (customer) res.json({ success: true, customer });
  } catch (error) {
    next(error);
  }
};

// POST /api/customers
const createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create({ ...pick(req.body), owner: req.user._id });
    res.status(201).json({ success: true, customer });
  } catch (error) {
    next(error);
  }
};

// PUT /api/customers/:id
const updateCustomer = async (req, res, next) => {
  try {
    const customer = await findOwned(req, res);
    if (!customer) return;

    customer.set(pick(req.body));
    await customer.save(); // runs schema validators
    res.json({ success: true, customer });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/customers/:id
const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await findOwned(req, res);
    if (!customer) return;

    await customer.deleteOne();
    res.json({ success: true, message: "Customer deleted", id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };
