
const addImage = (db) => async (req, res) => {
  const { id } = req.body;

  if(!id) {
    return res.status(400).json({is_error: true, message: 'No image to play with'});
  }
  
  try {
    const updated = await db('entries').where({user_id: id}).increment('count', 1).returning('count');
    return res.json({is_error: false, count: updated[0].count, message: 'success!'});
  } catch(error) {
    res.status(404).json({is_error: true, message: error});
  }
}

module.exports = {
  addImage: addImage
};
