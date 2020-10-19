const router = require("express").Router();

const AccountSchema = require('../models/account');

// Route to check email when registering (Using it for AJAX requests)
router.post("/", async (req, res) => {
    const inputEmail = await req.body.email;
    await AccountSchema.findOne({ email: inputEmail })
        .then(doc => {
            if (doc == null) {
                res.json({
                    "result": false
                })
                return
            }
            
            if (doc.email == inputEmail) {
                res.json({
                    "result": true
                })
                return
            }

            if (!doc) {
                res.json({
                    "result": err
                })
                return
            }

            else {
                res.json({
                    "result": false
                })
                return
            }
        })
        .catch(e => {
            console.log(e);
        })
})

module.exports = router;
