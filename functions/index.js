const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });


admin.initializeApp();

/**
 * firebase emulators:start --only functions
 */

exports.addToCart = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        // Check if the request method is POST
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        

        // Destructure the data passed to the function
        const { ticketID } = req.body;  // Changed from req.data to req.body
        console.log('ticketID:', ticketID);

        // Validate input
        if (!ticketID) {
            return res.status(400).send('The function must be called with a valid ticketID.');
        }

        // Reference to the Xmas_Draw collection and the specific ticket
        const ticketRef = admin.firestore().collection('Xmas_Draw').doc(ticketID);

        try {
            // Perform the transaction
            await admin.firestore().runTransaction(async (transaction) => {
                const ticketDoc = await transaction.get(ticketRef);

                if (!ticketDoc.exists) {
                    throw new Error('Ticket not found.');
                }

                if (ticketDoc.data().quantity === 0) {
                    throw new Error('Ticket has already been updated.');
                }

                // Apply updates to the ticket
                transaction.update(ticketRef, {
                    quantity: 0,
                });
            });

            return res.status(200).send({ success: true, message: 'Ticket updated successfully.' });
        } catch (error) {
            console.error('Error updating ticket:', error);
            return res.status(500).send('An error occurred while updating the ticket.');
        }
    });
});
