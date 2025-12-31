
const handleRegister = (db, bcrypt) => async(req, res) => {
  const { email, name, password } = req.body;

  if(!email || !name || !password) {
    return res.status(400).json({is_error: true, message: 'Incorrect form submission'});
  }

  try {
    let hash = null;
    bcrypt.hash(password, null, null, function(err, hashed) {
      hash = hashed;
    });

    await db.transaction(async (trx) => {
      const user = await trx('users').insert({name: name}, '*');

      const user_id = user[0].id;
      const login = await trx('login').insert({email: email, hash: hash, user_id: user_id});
      const entries = await trx('entries').insert({user_id: user_id}, 'count');

      let user_object = user[0];
      user_object['count'] = entries[0].count;

      return res.json({is_error: false, user: user_object, message: 'success!'});
    });
  } catch (error) {
    // If we get here, that means nothing was successfully inserted
    res.status(400).json({is_error: true, message: 'Failed to register user.'});
  }
}

module.exports = {
  handleRegister: handleRegister
};
