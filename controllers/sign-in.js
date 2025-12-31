
const handleSignIn = (db, bcrypt) => async (req, res) => {
  const {email, password} = req.body;

  if(!email || !password) {
    return res.status(400).json({is_error: true, message: 'Incorrect form submission'});
  }

  const user = await db('login').select('*').where({'login.email': email});

  try {
    bcrypt.compare(password, user[0].hash, async function(err, result) {
      if(result) {
        const validUser = await db('users')
                            .join('entries', 'users.id', '=', 'entries.user_id')
                            .select('users.id', 'users.name', 'entries.count')
                            .where({'users.id': user[0].user_id});

        if(validUser.length) {
          return res.json({is_error: false, user: validUser[0], message: 'success!'});
        }
        return res.status(400).json({is_error: true, message: 'User not found.'});
      }
      return res.status(400).json({is_error: true, message: 'User creds not valid.'});
    });
  } catch(error) {
    return res.status(400).json({is_error: true, message: 'Failed to fetch user.'});
  }
}

module.exports = {
  handleSignIn: handleSignIn
};
