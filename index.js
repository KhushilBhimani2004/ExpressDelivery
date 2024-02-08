let express = require('express');
let path = require('path');
let app = express();
const fs = require('fs');
let PORT = process.env.PORT || 3000;
const dotenv = require('dotenv');
dotenv.config();
var fetch = require('node-fetch');
let mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('./src/db/conn');
const details_Data = require("./src/models/orderDetails");
const { render } = require('ejs');
const userData = require("./src/models/users");
let user;

// const mod = require("./public/quote");

let staticPath = path.join(__dirname,'public');
// console.log(staticPath);
// Express Specific Code
app.use(express.static(staticPath)); // For serving static files
app.use(express.urlencoded());

// EJS Specific Code
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views')); 

// console.log(__dirname);
app.get('/',async (req,res)=>{
  try {
    if(!user){
      // console.log("Not user");
      res.redirect('/signin');
    }
    else{
      const data = await details_Data.find({user: user});
      res.render('index');

    }
    // if (data[0].user == null) {
    //     res.redirect('/signin');
    // }
    // else{
    // }
    
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
    
})

app.get('/details',(req,res)=>{
    res.render('details.ejs');
    
})
app.get('/pay-online',(req,res)=>{
    res.render('payment.ejs');
    
})

app.get('/agents',async(req,res)=>{
    try {
        const data = await details_Data.find({status: 'pending'});
        
        
        res.render('agent.ejs',{data:data});
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
      }
    
})

app.get('/orderhistory',async(req,res)=>{
    try {
      // console.log(user);
      if (!user) {
        res.redirect('/signin');
      }
      else{
          const data = await details_Data.find({user: user});
            res.render('orderhistory.ejs',{data:data});
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
      }
    
})

app.get('/getCardData/:cardId', async (req, res) => {
    const cardId = req.params.cardId;
  
    try {
      const cardData = await details_Data.findOne({ _id: cardId });
      if (cardData) {
        // Handle the data, perform operations, or render a new view as needed
        res.json({ success: true, data: cardData });
      } else {
        res.status(404).json({ success: false, message: 'Card not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }); 
app.get('/getstatus/:cardId', async (req, res) => {
    const cardId = req.params.cardId;
  
    try {
      const cardData = await details_Data.findOne({ _id: cardId });
      if (cardData) {
        // Handle the data, perform operations, or render a new view as needed
        res.json({ success: true, data: cardData });
      } else {
        res.status(404).json({ success: false, message: 'Card not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }); 

app.post('/success', (req, res) => {
    // Verify the Razorpay signature (for security)
    const { body } = req;
    const signature = req.get('x-razorpay-signature');

    try {
        razorpay.webhooks.verifySignature(body, signature);
        // Handle the success webhook
        console.log('Payment successful:', body);
        sendMsg();
        res.sendStatus(200);
    } catch (error) {
        console.error('Webhook signature verification failed:', error);
        res.sendStatus(500);
    }
});

app.use(express.json());

app.post('/details', async (req, res) => {
    const receivedData = req.body;
    // console.log(user+" in Details");
    let details = {user:user, deliveryType: receivedData.deliveryType, weightSelected: receivedData.weightSelected, pickup_location: receivedData.pickup_location, pickupPerson_Name: receivedData.pickupPerson_Name,pickupPerson_MobNo: receivedData.pickupPerson_MobNo, pickup_address: receivedData.pickup_address, drop_location: receivedData.drop_location, dropPerson_Name: receivedData.dropPerson_Name, dropPerson_MobNo: receivedData.dropPerson_MobNo, drop_address: receivedData.drop_address, selectedItems: [receivedData.selectedItems], payTypeSelected: receivedData.payTypeSelected, status: 'pending'};
    await details_Data.collection.insertOne(details);

    sendMsg(receivedData.pickupPerson_Name, receivedData.pickupPerson_MobNo);
    res.json({ message: 'Data received/transimitted successfully' });
});

app.get('/getMapboxToken', (req, res) => {
  const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN;
  res.json({ accessToken: mapboxAccessToken });
});

app.get('/getRazorpayAPIKey', (req, res) => {
  const RazorpayAPIKey = process.env.CLIENT_SIDE_RazorpayAPIKey;
  res.json({ apikey: RazorpayAPIKey });
});

app.get('/acceptrequest/:UserId', async (req, res) => {
    const cardId = req.params.UserId;
  
    try {
        const data = await details_Data.findOneAndUpdate(
            { _id: cardId },
            { $set: { status: "In Progress" } },
            { new: true } // To return the updated document
          );

          if (!data) {
            return res.status(404).json({ error: 'Document not found' });
          }
      
          res.json({ message: 'Value updated successfully', updatedDocument: data });
      
    } catch (error) {
        
    }
  }); 

app.get('/markCompleted/:UserId', async (req, res) => {
    const cardId = req.params.UserId;
  
    try {
        const data = await details_Data.findOneAndUpdate(
            { _id: cardId },
            { $set: { status: "Completed" } },
            { new: true } // To return the updated document
          );

          if (!data) {
            return res.status(404).json({ error: 'Document not found' });
          }
      
          res.json({ message: 'Value updated successfully', updatedDocument: data });
          
    } catch (error) {
        
    }
  }); 

async function sendMsg(name, Mob_No) {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilio = require('twilio')(accountSid, authToken);
        const date = new Date();

        let day = date.getDate()+1;
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let currentDate = `${day}-${month}-${year}`;

        twilio.messages
        .create({
            from: '+19293234779',
            to: `{+91${Mob_No}}`,
            body: `Hi, ${name}, \n Your Pickup will be initialized before ${currentDate} End of the Day`
        })
        .then(message => console.log(message.sid));
    } catch (error) {
        console.log('Cant Send SMS');
    }
    
  }


app.get('/signup',(req,res)=>{
    res.render('signup.ejs',{data: null});
})
app.post('/signup',async(req,res)=>{
    
    try {
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        let confirm_pass = req.body.confirm_pass;

        let user = {name: name,email: email,password: password,confirm_pass: confirm_pass};
        let user_present = await userData.findOne({email: email});
        if(user_present){
            res.render('signup.ejs',{data: "User Already Exists"});
        }
        else{
            await userData.collection.insertOne(user);
            res.redirect('/signin');
        }

    } catch (error) {
        console.error("cant post...");
    }
    
})

app.get('/getlocation', async (req, res) => {
  const apiKey = process.env.opencage_APIKEY;
  const endpoint = process.env.ENDPOINTS;

  try {
    const place1 = req.query.place1;
    const place2 = req.query.place2;
    
    const response1 = await fetch(`${endpoint}?q=${encodeURIComponent(place1)}&key=${apiKey}`);
    if (!response1.ok) {
      throw new Error('Error fetching coordinates for place1');
    }
    const data1 = await response1.json();
    coords1 = data1.results[0].geometry;
    
    const response2 = await fetch(`${endpoint}?q=${encodeURIComponent(place2)}&key=${apiKey}`);
    if (!response2.ok) {
      throw new Error('Error fetching coordinates for place2');
    }
    const data2 = await response2.json();
    coords2 = data2.results[0].geometry;

    res.json( { coords1, coords2 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/signin',(req,res)=>{
    res.render('signin.ejs',{data:null});
})
app.post('/signin',async(req,res)=>{
    // const userData = require("./src/models/users");
    try {
        let email = req.body.email;
        let password = req.body.password;

        let email_exists = await userData.findOne(({email:email}));
        let user_present = await userData.findOne({email: email,password:password});
        
        if(user_present){
            user = email;
            res.redirect('/');
            
        }
        else if (email_exists) {
            res.render('signin.ejs',{data: "Email Id or Password might be wrong"});
        }
        else{
            res.render('signin.ejs',{data: "User doesnot Exists"});
        }
    } catch (error) {
        console.error("cant post...");
    }
})

// code used to 
app.listen(PORT,()=>{
    console.log(`Port Working on localhost:${PORT}...`);
})