const { Thought, User } = require('../models')


const thoughtController = {
  createThought: (req, res) => {
    Thought.create(req.body)
      .then(response => {
        return User.findOneAndUpdate( { _id: req.body.userId }, { $push: { thoughts: response._id } }, { new: true } )
      })
      .then(response => {
        if(!response){
          res.status(404).json({ message: `Thought created but no user exists with this id` })
        }
        res.status(201).json({ message: 'Thought created!' })
      }).catch(err => {
        console.log(err)
        res.status(500).json(err)
      })
  },
  getThoughts: (req, res) => {
    Thought.find()
      .sort({ createdAt: -1 })
      .then(response => res.json(response))
      .catch(err => {
        console.error(err)
        res.status(500).json(err)
      })
  },
  getSingleThought: (req, res) => {
    Thought.findOne({ _id: req.params.thoughtId })
      .then(response => {
        if(!response){
          res.status(404).json({ message: `No thought found for this id` })
        }
        res.json(response)
      }).catch(err => {
        console.error(err)
        res.status(500).json(err)
      })
  },
  updateThought: (req, res) => {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true })
      .then(response => {
        if(!response){
          res.status(404).json({ message: `No thought found for this id` })
        } 
        res.json(response)
      }).catch(err => {
        console.error(err)
        res.status(500).json(err)
      })
  },
  deleteThought: (req, res) => {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then(response => {
        if (!response) {
          res.status(404).json({ message: `No thought found with this id` })
        }
        return User.findOneAndUpdate( { thoughts: req.params.thoughtId }, { $pull: { thoughts: req.params.thoughtId } }, { new: true } )
      })
      .then(response => {
        if(!response){
          res.status(404).json({ message: `Thought created but no user with this id` })
        } 
        res.json({ message: 'Thought deleted!' })
      }).catch(err => {
        console.error(err)
        res.status(500).json(err)
      })
  },
  addReaction: (req, res) => {
    Thought.findOneAndUpdate( { _id: req.params.thoughtId }, { $addToSet: { reactions: req.body } }, { runValidators: true, new: true } )
      .then(response => {
        if(!response){
          res.status(404).json({ message: `No thought found with this id` })
        }
        res.status(201).json(response)
      }).catch(err => {
        console.error(err)
        res.status(500).json(err)
      })
    },
  removeReaction: (req, res) => {
    Thought.findOneAndUpdate( { _id: req.params.thoughtId }, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { runValidators: true, new: true } )
    .then(response => {
      if(!response){
        res.status(404).json({ message: `No thought found with this id` })
      }
      res.json({ message: 'Reaction removed!' })
    }).catch(err => {
      console.error(err)
      res.status(500).json(err)
    })
  }
}

module.exports = thoughtController