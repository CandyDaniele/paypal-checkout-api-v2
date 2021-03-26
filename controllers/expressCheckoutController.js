import fetch from 'node-fetch';
import authToken from '../services/authToken.js';

const createPayment = async (req, res) => {

  var accessToken = req.session.token;
  var tokenExpires = req.session.tokenExpires;

  const token = await authToken.handleToken(accessToken, tokenExpires);

  if(accessToken != token.accessToken){
    req.session.token = token.accessToken;
    req.session.tokenExpires = token.expires;
  }

  let {total, subtotal, shipping, first_name, last_name , line1, city, state, phone, postal_code, country_code, email} = req.body;

  first_name = first_name == "" ? "Daniele": first_name;
  last_name = last_name == "" ? "Lucas": last_name;
  line1 = line1 == "" ? "605 W Capitol Expy": line1;
  city = city == "" ? "San Jose": city;
  state = state == "" ? "CA" : state;
  phone = phone == "" ? "15907587332" : phone;
  postal_code = postal_code == "" ? "95136" : postal_code;
  country_code = country_code == "" ? "US" : country_code;
  email = email == "" ? "danlucas@gmail.com": email;

  const conteudo = {
    intent: 'CAPTURE',
    application_context: {
      brand_name: "Test Store",
      locale: "en-US",
      shipping_preference: "SET_PROVIDED_ADDRESS",
      return_url: "https://example.com/return",
      cancel_url: "https://example.com/cancel"
    },  
    purchase_units: [
      {
        reference_id: Math.floor(Math.random() * 1000).toString(),
        soft_descriptor: "Test Store",
        amount: {
          currency_code: "USD",
          value: total,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: subtotal
            },
            shipping: {
              currency_code: "USD",
              value: shipping
           }
          }
        },
        items:[
          {
            name: "Handbag",
            description: "Red Handbag",
            quantity: "1",
            sku: "productx",
            unit_amount: {
              currency_code: "USD",
              value: subtotal
            },
          }
        ],
        description: "This is the payment transaction description.",
        shipping: {
          method: "United States Postal Service",
          address: {
            address_line_1: line1,
            admin_area_2: city,
            admin_area_1: state,
            postal_code: postal_code,
            country_code: country_code
          }
        }
      }
    ], 
    payer: {
      name: {
        given_name: first_name,
        surname: last_name,
      },
      email_address: email,
      phone: {
        phone_number: {
          national_number: phone,
        },
      },
    },   
  }

  const endpoint = 'https://api.sandbox.paypal.com/v2/checkout/orders';

  let objHeader = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token.accessToken,
  }

  const request = fetch(endpoint, {
    method: 'POST',
    headers: objHeader,
    body: JSON.stringify(conteudo)
  }).then((response) => {
    response.json().then((data) => {
      res.send(data);
    })
  }).catch((err) => {
    console.log(err)
  })
  
};

const executePayment = async (req, res) => {

  var accessToken = req.session.token;
  var tokenExpires = req.session.tokenExpires;


  const token = await authToken.handleToken(accessToken, tokenExpires);

  if(accessToken != token.accessToken){
    req.session.token = token.accessToken;
    req.session.tokenExpires = token.expires;
  }

  let {orderID} = req.body;

  const endpoint = 'https://api.sandbox.paypal.com/v2/checkout/orders/'+orderID+'/capture';

  let objHeader = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token.accessToken,
  }

  const request = fetch(endpoint, {
    method: 'POST',
    headers: objHeader
  }).then((response) => {
    response.json().then((data) => {
      res.send(data);
    })
  }).catch((err) => {
    console.log(err)
  })

};


export default { createPayment, executePayment};