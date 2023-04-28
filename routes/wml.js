'use strict';

require('dotenv').config({
  silent: true,
});

const axios = require('axios')
const qs = require('qs')

const express = require('express');
const router = express.Router();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


const API_KEY = process.env.API_KEY
const deploymentURL = process.env.URL

router.post('/', async function(req, res, next) {
  console.log("BODYYYY")
  console.log(req.body)
  let tokenResponse = await getToken(API_KEY)
  

  let values;
  const fields = ["Age", "Experience", "Income", "ZIP Code", "Family", "CCAvg", "Education", "Mortgage", "Securities Account", "CD Account", "Online", "CreditCard"]
  values = [[req.body.age,
  req.body.experience,
  req.body.income,
  req.body.ZIP,
  req.body.family,
  req.body.creditCardAvg,
  req.body.education,
  req.body.mortgage,
  req.body.security,
  req.body.CD,
  req.body.online,
  req.body.creditCard]]

  let payload_json = {"input_data": [{"fields": fields, "values": values}]}
  let payload = JSON.stringify(payload_json);
  // NOTE: manually define and pass the array(s) of values to be scored in the next line

  console.log(payload)
  console.log(tokenResponse.body.token)

	const scoring_url = deploymentURL;

	apiPost(scoring_url, tokenResponse.body.token, payload, function (resp) {
		let parsedPostResponse;
		try {
			parsedPostResponse = JSON.parse(this.responseText);
		} catch (ex) {
			// TODO: handle parsing exception
		}
		console.log("Scoring response");
		console.log(JSON.stringify(parsedPostResponse, null, 2));
    res.status(200).send(parsedPostResponse)
	}, function (error) {
		console.log(error)
    res.status(500).send(error)

	});
});

/*function getToken() {
	const req = new XMLHttpRequest();
	// req.addEventListener("load", loadCallback);
	// req.addEventListener("error", errorCallback);
	req.open("POST", "https://iam.cloud.ibm.com/identity/token");
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.setRequestHeader("Accept", "application/json");
  req.send("grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + API_KEY);
}*/

async function getToken(params) {
  var url = 'https://iam.cloud.ibm.com/identity/token'

  var body = {
    grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
    apikey: params,
  }

  var config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization: 'Basic Yng6Yng=',
    },
  }

  var data = await axios.default
    .post(url, qs.stringify(body), config)
    .then((result) => {
      return result.data
    })
    .catch((err) => {
      return err
    })

  return {
    body: {
      token: data.access_token,
      refresh_token: data.refresh_token,
    },
  }
}

function apiPost(deploymentURL, token, payload, loadCallback, errorCallback){
	const oReq = new XMLHttpRequest();
	oReq.addEventListener("load", loadCallback);
	oReq.addEventListener("error", errorCallback);
	oReq.open("POST", deploymentURL);
	oReq.setRequestHeader("Accept", "application/json");
	oReq.setRequestHeader("Authorization", "Bearer " + token);
	oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	oReq.send(payload);
}

// getToken((err) => console.log(err), function () {
// 	let tokenResponse;
// 	try {
// 		tokenResponse = JSON.parse(this.responseText);
// 	} catch(ex) {
// 		// TODO: handle parsing exception
// 	}
	
//   let values;
//   const fields = ["Age", "Experience", "Income", "ZIP Code", "Family", "CCAvg", "Education", "Mortgage", "Securities Account", "CD Account", "Online", "CreditCard"]
//   values = [[25, 2, 230, 230, 2, 2.5, 2, 0, 1, 0, 1, 2]]

//   let payload_json = {"input_data": [{"fields": fields, "values": values}]}
//   let payload = JSON.stringify(payload_json);
//   // NOTE: manually define and pass the array(s) of values to be scored in the next line

//   console.log(payload)
//   console.log(tokenResponse)

// 	const scoring_url = deploymentURL;

// 	apiPost(scoring_url, tokenResponse.access_token, payload, function (resp) {
// 		let parsedPostResponse;
// 		try {
// 			parsedPostResponse = JSON.parse(this.responseText);
// 		} catch (ex) {
// 			// TODO: handle parsing exception
// 		}
// 		console.log("Scoring response");
// 		console.log(JSON.stringify(parsedPostResponse, null, 2));
// 	}, function (error) {
// 		console.log(error);
// 	});
// });

// /* function classify(req, res) {
//     /*token_response = req.post('https://iam.cloud.ibm.com/identity/token', data={"apikey": apiKey, "grant_type": 'urn:ibm:params:oauth:grant-type:apikey'})
//     console.log(token_response)
//     //mltoken = token_response.json()["access_token"]
    
//     let tokenResponse;
//     try {
//       tokenResponse = JSON.parse(this.responseText);
//     } catch(ex) {
//       // TODO: handle parsing exception
//     }
//     let values;
//     const fields = ["Age", "Experience", "Income", "ZIP Code", "Family", "CCAvg", "Education", "Mortgage", "Securities Account", "CD Account", "Online", "CreditCard"]
//     values = [[25, 2, 230, 230, 2, 2.5, 2, 0, 1, 0, 1, 2]]

//     let payload_json = {"input_data": [{"fields": fields, "values": values}]}
//     let payload = JSON.stringify(payload_json);
//     // NOTE: manually define and pass the array(s) of values to be scored in the next line

//     console.log(payload)
//     console.log(tokenResponse)

//     const scoring_url = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/33cb530c-b638-408c-bed0-1af4041129ed/predictions?version=2023-04-13";
//     apiPost(scoring_url, tokenResponse.access_token, payload, function (resp) {
//       let parsedPostResponse;
//       try {
//         parsedPostResponse = JSON.parse(this.responseText);
//       } catch (ex) {
//         // TODO: handle parsing exception
//       }
//       console.log("Scoring response");
//       console.log(parsedPostResponse);
//     }, function (error) {
//       console.log(error);
//     });

//     apiPost(deploymentURL, tokenResponse, payload, function (resp) {
//       let parsedPostResponse;
//       try {
//         parsedPostResponse = JSON.parse(this.responseText);
//       } catch (ex) {
//         console.log(ex)
//         res.json({errors: [{message: "Cannot parse API token"}]})
//       }
//       console.log("Scoring response");
//       res.json(parsedPostResponse)
//     }, function (error) {
//       console.log(error);
//       res.json({errors: [{message: error}]})
//     });

//     console.log("input data");
//     console.log(payload);
// }*/

module.exports = router;