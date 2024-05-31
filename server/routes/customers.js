const router = require("express").Router();
let Customer = require("../models/customer");

router.route("/add").post((req, res) => {
    const { idd, name, address, nic, requestType, want, request } = req.body;

    const newCustomer = new Customer({
        idd,
        name,
        address,
        nic,
        requestType,
        want,
        request,
    });

    newCustomer.save()
        .then(() => {
            res.json("Customer request added");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Failed to add customer request" });
        });
});


router.route("/").get((req, res) => {
    Customer.find()
        .then((customers) => {
            res.json(customers);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Failed to retrieve customers" });
        });
});

router.get("/customers/:nic", async (req, res) => { // Mark the function as async
    try {
        const nic = req.params.nic;
        const customer = await Customer.findOne({ nic: nic }); // Use await here

        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ error: "Customer not found" });
        }
    } catch (error) {
        console.error("Error", error);
        res.status(500).json({ error: 'Error fetching customer data' });
    }
});

router.route("/update/:id").put(async (req, res) => {
    try {
        const userId = req.params.id;
        const { idd, name, address, nic, request } = req.body;

        const updateCustomer = {
            idd,
            name,
            address,
            nic,
            request
        };

        await Customer.findByIdAndUpdate(userId, updateCustomer);
        res.status(200).send({ status: "Updated" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Updating Error", error: err.message });
    }
});


router.route("/delete/:id").delete(async (req, res) => {

    let userId = req.params.id;

    await Customer.findByIdAndDelete(userId).then(() => {
        res.status(200).send({status: "Deleted"});

    }).catch((err) =>{
        console.log(err.message);
        res.status(500).send({status: "Delete Error", error: err.message});
    })
})






module.exports = router;