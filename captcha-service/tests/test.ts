import { ValidCaptchaResponse, VerifyJWTResponse, VerifyCaptchaValidResponse } from "../src"

/*jshint node:true, esversion: 6 */

var service = require('../src/')
var jwt = require('jsonwebtoken')
var crypto = require('crypto')
var open = require('opn')
var path = require('path').basename(__dirname)

var resourceID = crypto.randomBytes(64).toString('hex')

// Disable this by default
// service.getCaptcha({})
// .then(function (t2) {
// 	// Fail because no nonce passed in.
// 	if (t2 && !t2.valid) {
// 		console.log("unit test success.")
// 	} else {
// 		console.log("unit test failed.")
// 		process.exit(1)
// 	}
// })

service.getCaptcha({ nonce: resourceID })
	.then(function (c: ValidCaptchaResponse) {
		if (!c.captcha) {
			console.log("Captcha was not generated.")
			process.exit(1)
		}
		if (!c.validation) {
			console.log("Encrypted answer not found.")
			process.exit(1)
		}

		// Success on normal case
		if (c.captcha) {
			console.log("unit test success.")
		} else {
			console.log("unit test failed.")
			process.exit(1)
		}
    var payload = { nonce: resourceID, validation: c.validation };
    service.getAudio(payload)
      .then((res : any) => {
        console.log('audio success ', res.audio);
      })
      .catch((e : Error) => {
        console.log('error', e);
      })
		// var fs = require('fs')
		// fs.writeFileSync(__dirname + "/test.html", c.captcha)

		// var os = require('os')
		// if (os.platform() === 'win32') {
		// 	open("file:///" + __dirname + "\\" + "test.html")
		// } else {
		// 	open(__dirname + "/" + "test.html")
		// }

		// const readline = require('readline')

		// const rl = readline.createInterface({
		// 	input: process.stdin,
		// 	output: process.stdout
		// })

		// rl.question('What is the answer to the captcha?', (answer: string) => {
		// 	rl.close()

		// 	var payload = { nonce: resourceID, validation: c.validation, answer: answer }
		// 	// console.log("payload:", payload)
		// 	service.verifyCaptcha(payload)
		// 		.then(function (signedJWT: VerifyCaptchaValidResponse) {
		// 			if (signedJWT && signedJWT.valid === false) {
		// 				console.log("Captcha answer was wrong.")
		// 				process.exit(1)
		// 			}
		// 			// console.log("JWT:", signedJWT)

		// 			var verified = service.verifyJWT(signedJWT.jwt, resourceID)
		// 				.then(function (verified: VerifyJWTResponse) {
		// 					if (verified && verified.valid === true) {
		// 						console.log("Client Verified!")
		// 						process.exit()
		// 					} else {
		// 						console.log("Client Failed.")
		// 						process.exit(1)
		// 					}
		// 				})
		// 		})
		// })
	})
