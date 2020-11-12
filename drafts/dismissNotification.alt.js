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