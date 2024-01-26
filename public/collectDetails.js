let deliverNow = document.getElementById('deliverNow');
let ScheduleNow = document.getElementById('ScheduleNow');


deliverNow.addEventListener('click', () => {
  jsonFile.deliveryType = 'Instant';
  console.log(jsonFile);
});

ScheduleNow.addEventListener('click', () => {
  jsonFile.deliveryType = 'Schedule';
  console.log(jsonFile);
});



let jsonFile = {}

async function getSelectedWeight() {
  jsonFile.weightSelected = document.querySelector('input[name="weight"]:checked').value;
  jsonFile.pickup_location = pickup_location.value;
  jsonFile.pickupPerson_Name = pickupPerson_Name.value;
  jsonFile.pickupPerson_MobNo = pickupPerson_MobNo.value;
  jsonFile.pickup_address = pickup_address.value;

  jsonFile.drop_location = drop_location.value;
  jsonFile.dropPerson_Name = dropPerson_Name.value;
  jsonFile.dropPerson_MobNo = dropPerson_MobNo.value;
  jsonFile.drop_address = drop_address.value;
  if (jsonFile.deliveryType == 'Schedule') {
    jsonFile.pickup_date = pickup_date.value;
    jsonFile.pickup_time = pickup_time.value;
  }



  const checkboxes = document.querySelectorAll('.items-checkbox input[type="checkbox"]');
  jsonFile.selectedItems = [];

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      jsonFile.selectedItems.push(checkbox.id);
    }
  });
  jsonFile.payTypeSelected = document.querySelector('input[name="payType"]:checked').value;

  try {
    const response = await fetch('/details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonFile),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

async function confirm_order() {
  // const apiKey = 'rzp_test_YjKIBGXhhVNCmf';
  let apiKey;
  fetch('/getRazorpayAPIKey')
    .then(response => response.json())
    .then(data => {
      // Use the received access token for Mapbox
      apiKey = data.apikey;
      // Amount is in paise (100 paise = 1 INR)
      // const amount = 10*100; // Example: ₹10.00
      const amount = (document.getElementById('results').textContent.match(/\d+/g)[0]) * 100; // Example: ₹10.00

      const options = {
        key: apiKey,
        amount: amount,
        name: 'Express Delivery',
        description: 'Fastest and Trusted Delivery',
        handler: function (response) {
          // Handle the success response here
          console.log(response);
          alert('Payment successful!');
        },
        prefill: {
          name: 'Chinmay Mhatre',
          email: 'chinmay@example.com',
          contact: '9123456780'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    })
    .catch(error => console.error('Error fetching Razorpay token:', error));


}