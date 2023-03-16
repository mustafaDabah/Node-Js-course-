
const fs = require('fs');

const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`));

// >>> Users functions
exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    time: req.requestTime,
    results: users.length,
    data: {
      users,
    },
  });
};

exports.createUser = ((req, res) => {
  const newId = users.length - 1;
  const newUser = { id: newId, ...req.body };

  users.push(newUser);

  fs.watchFile(`${__dirname}/dev-data/data/users.json`, JSON.stringify(users), () => {
    res.status(200).json({
      status: 'success',
      data: {
        message: 'success add user',
      },
    });
  });
});

exports.getUser = (req, res) => {
  const { id } = req.params;

  if (id > users.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'invalid id',
    });
  }

  const targetUser = users[+id];

  res.status(200).json({
    targetUser,
  });
};
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  if (id > users.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'invalid id',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

exports.updateUser = (req, res) => {
  const { id } = req.params;

  if (id > users.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: 'Done the update',
  });
};
