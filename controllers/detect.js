const { Model } = require("clarifai-nodejs");
require("dotenv").config();

const clarifaiRequestOptions = () => {
  const detectorModel = new Model({
    url: process.env.MODEL_URL,
    authConfig: {
      pat: process.env.PAT,
    },
  });
  return detectorModel;
}

const detectFace = () => async (req, res) => {
  if(!req.body.imageUrl) {
    return res.status(400).json({is_error: true, message: 'No image provided'});
  }
  const detectorModel = clarifaiRequestOptions();

  try {
    const detectorModelPrediction = await detectorModel.predictByUrl({
      url: req.body.imageUrl,
      inputType: "image",
    });
    return res.json({
      is_error: false, 
      message: 'success', 
      result: detectorModelPrediction?.[0]?.data?.regionsList
    })
  }
  catch(error) {
    res.status(404).json({is_error: true, message: error});
  }
}

module.exports = {
  detectFace: detectFace
};
