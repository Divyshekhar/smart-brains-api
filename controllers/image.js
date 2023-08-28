
const Clarifai = require('clarifai');



const handleApicall = (req,res) => {

  console.log(req.body)
    const PAT = 'e39790bf861a456a902dfa28a3ea2ff5';
    const USER_ID = 'clarifai';
    const APP_ID = 'main';
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    const IMAGE_URL = req.body.imageurl;

    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      "inputs": [
        {
          "data": {
            "image": {
              "url": IMAGE_URL
            }
          }
        }
      ]
    });
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
      },
      body: raw
    };
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.json()) // Extract JSON data from response
    .then(data => {
      console.log('this is data', data);
      res.json(data);
    })
    .catch(err => res.status(404).json('unable to get response'));
}






const handleImage = (db, bcrypt,res,req) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(404).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApicall
}