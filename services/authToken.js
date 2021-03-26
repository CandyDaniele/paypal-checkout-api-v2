import fetch from 'node-fetch';
import base64 from 'base-64';
import dotenv from 'dotenv';

dotenv.config();

const handleToken = async(cookieToken,cookieExpires) => {
  if(Date.now() > cookieExpires || typeof(cookieExpires) == 'undefined'){
    console.log("gerar novo token");
    const EXPIRATION_THRESHOLD_TOKEN = 500;
    const endpoint = 'https://api.sandbox.paypal.com/v1/oauth2/token';
    const urlencode = new URLSearchParams();
    urlencode.append("grant_type", "client_credentials")
  

    const request = await fetch(endpoint, {
    method: 'POST',
    headers: {
    Accept: 'application/json',
    "Accept-Language": "en_US",
    "Authorization":"Basic "+base64.encode(process.env.PAYPAL_CLIENT_ID+":"+process.env.PAYPAL_CLIENT_SECRET)
    },
    body: urlencode
    })
    const response = await request.json();

    let expires = Date.now() + (response.expires_in * 1000) - EXPIRATION_THRESHOLD_TOKEN;
    let accessToken = response.access_token;

    return({accessToken, expires});
  }else {
    console.log("token validado");
    return({accessToken: cookieToken, expires: cookieExpires});
  }
};

export default {handleToken};