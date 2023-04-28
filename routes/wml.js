'use strict';

require('dotenv').config({
  silent: true,
});

const express = require('express');
const router = express.Router();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const apiKey = process.env.API_KEY
const deploymentURL = process.env.URL

router.post('/', function(req, res, next) {
  classify(req, res);
});

function classify(req, res) {
    token_response = req.post('https://iam.cloud.ibm.com/identity/token', data={"apikey": API_KEY, "grant_type": 'urn:ibm:params:oauth:grant-type:apikey'})
    console.log(token_response)
    //mltoken = token_response.json()["access_token"]

    let values;
    const fields = ["Age", "Experience", "Income", "ZIP Code", "Family", "CCAvg", "Education", "Mortgage", "Securities Account", "CD Account", "Online", "CreditCard"]
    values = [[25, 2, 230, 230, 2, 2.5, 2, 0, 1, 0, 1, 2]]

    let payload_json = {"input_data": [{"fields": fields, "values": values}]}
    let payload = JSON.stringify(payload_json);


    apiPost(deploymentURL, tokenResponse.access_token, payload, function (resp) {
      let parsedPostResponse;
      try {
        parsedPostResponse = JSON.parse(this.responseText);
      } catch (ex) {
        console.log(ex)
        res.json({errors: [{message: "Cannot parse API token"}]})
      }
      console.log("Scoring response");
      res.json(parsedPostResponse)
    }, function (error) {
      console.log(error);
      res.json({errors: [{message: error}]})
    });

    console.log("input data");
    console.log(payload);
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

module.exports = router;