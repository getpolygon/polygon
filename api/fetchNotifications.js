const router = require("express").Router();

const AccountSchema = require("../models/account");

router.get("/", async (req, res) => {
    // Current Account
    const currentAccount = await AccountSchema.findOne({
        email: req.cookies.email,
        password: req.cookies.password
    });
    // Query parameters
    const dismiss = req.query.dismiss;

    // Function for disimissing a friend requests
    if (dismiss) {
        // Getting the notification ID from the query
        const notification = req.query.notification;
        // Deleting the object
        await currentAccount
            .friends
            .pending
            .pull(notification);
        // Saving the account
        await currentAccount.save()
            .then(doc => {
                res.json(doc)
            })
            .catch(e => console.error(e));
    };
    if (!dismiss) {
        const notifications = [];
        currentAccount.friends.pending.forEach(request => {
            notifications.push(request);
        });
        res.json(notifications);
    };
});

module.exports = router;

// This also can be used for deleting FRs
/* if (dismiss) {
 *    const notification = req.query.notification;
 *    // Current Account
 *    await AccountSchema.findOne({
 *        email: req.cookies.email,
 *        password: req.cookies.password
 *    })
 *        .then(async (doc) => {
 *            let foundRequest = doc.friends.pending.id(notification);
 *            console.log(foundRequest);
 *            doc.friends.pending.pull(foundRequest);
 *            await doc.save()
 *                .then(doc => {
 *                    res.json(doc);
 *                })
 *                .catch(e => console.error(e));
 *        });
 * };
 */