const express = require("express")
const app = express()
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
const bodyParser = require("body-parser")
const cors = require("cors")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())

app.post("/payment", cors(), async (req, res) => {
	let { amount, id, desc } = req.body
	try {
		const payment = await stripe.paymentIntents.create({
			amount,
			currency: "MXN",
			description: desc,
			payment_method: id,
			confirm: true
		})
		console.log("Payment", payment)

		var request = require('request');
		let resbd = 0;
		request.post(
			'https://gaspetromarapp.grupopetromar.com/gasunionapi.php',
			{ json: { id: 'abonarSaldo', noconsumidor : '3421', importe : amount, disponible : amount, descripcion : desc } },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(body);
				}
				console.log("res:" + response.body);
				resbd = response.body;
				res.json({
					codigo: "1",
					codigobd: resbd,
					message: "Payment successful",
					success: true
				})
			}
		);

		
		//guardar en base de datos ->
		//retornar al inicio / mostrar saldo 
		
	} catch (error) {
		console.log("Error", error)
		res.json({
			codigo: "0",
			message: "Payment failed",
			success: false
		})
	}
})

app.listen(process.env.PORT || 4000, () => {
	console.log("Sever is listening on port 4000")
})
