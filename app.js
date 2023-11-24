require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// Middleware setup
app.use(express.json());
app.use(cors());

// Checkout API endpoint
app.post("/api/create-checkout-session", async (req, res) => {
    try {
        const dataArray = req.body;
        const product = [dataArray]
        const exchangeRate = 75;

        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: product.map((product) => ({
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: product.plane,
                        
                    },
                    unit_amount: parseFloat(product.price.replace('$', '')) * exchangeRate * 100,
                    
                },
                quantity: 1,
                
            })),
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(7000, () => {
    console.log("Server started on port 7000.");
});
