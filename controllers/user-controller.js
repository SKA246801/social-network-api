const { User } = require('../models')

const userController = {
  createUser: (req, res) => {
    User.create(req.body)
      .then(response => res.status(201).json(response))
      .catch(err => {
        console.log(err)
        res.status(500).json(err)
      })
  },
  getUsers: (req, res) => {
    User.find()
      .select('-__v')
      .then(response => res.json(response))
      .catch(err => {
        console.log(err)
        res.status(500).json(err)
      })
    },
  getSingleUser: (req, res) => {
    User.findOne({ _id: req.params.userId })
    .select('-__v')
    .populate('friends')
    .populate('thoughts')
    .then(response => {
      if(!response){
          res.status(404).res.json({ message: 'No user exists with this id' })
      }
      res.json(response)
    }).catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
  },
  updateUser: (req, res) => {
    User.findOneAndUpdate( { _id: req.params.userId }, { $set: req.body }, { runValidators: true, new: true } )
    .then(response => {
      if(!response) {
          res.status(404).json({ message: 'No user exists with this id' })
      }
      res.json(response)
    }).catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
  },
  deleteUser: (req, res) => {
    User.findOneAndDelete({ _id: req.params.userId })
    .then(response => {
      if(!response){
          res.status(404).json({ message: 'No user exists with this id' })
      } 
      res.json(response)
    }).catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
  },
  addFriend: (req, res) => {
    User.findOneAndUpdate( { _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true } )
    .then(response => {
        if(!response){
            res.status(404).json({ message: 'No user exists with this id' })
        }
        res.json(response)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
  },
  removeFriend: (req, res) => {
    User.findOneAndUpdate( { _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true } )
    .then(response => {
        if(!response) {res.status(404).json({ message: 'No user exists with this id' })
    }
    res.json(response)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
  }
}

module.exports = userController