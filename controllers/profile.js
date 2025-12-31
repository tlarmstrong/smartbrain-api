
const getUserProfile = (db) => async (req, res) => {
  const { id } = req.params;

  if(!id) {
    return res.status(400).json({is_error: true, message: 'Missing user id'});
  }

  try {
    const user = await db('users')
                  .join('entries', 'users.id', '=', 'entries.user_id')
                  .select('users.id', 'users.name', 'entries.count')
                  .where({'users.id': id});

    if(user.length) {
      return res.json({is_error: false, user: user[0], message: 'success!'});
    }
    return res.status(400).json({is_error: true, message: 'User not found.'});
  } catch(error) {
    res.status(400).json({is_error: true, message: 'Failed to fetch user.'});
  }
}

module.exports = {
  getUserProfile: getUserProfile
};
