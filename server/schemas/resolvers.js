const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      console.log(context)
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('books');

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    }
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return {token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      console.log(email, password)
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, {input}, context) => {
      console.log('hitts')
      console.log(context.user)
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input} },
          { new: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
//     addReaction: async (parent, { thoughtId, reactionBody }, context) => {
//       if (context.user) {
//         const updatedThought = await Thought.findOneAndUpdate(
//           { _id: thoughtId },
//           { $push: { reactions: { reactionBody, username: context.user.username } } },
//           { new: true, runValidators: true }
//         );

//         return updatedThought;
//       }

//       throw new AuthenticationError('You need to be logged in!');
//     },
//     addFriend: async (parent, { friendId }, context) => {
//       if (context.user) {
//         const updatedUser = await User.findOneAndUpdate(
//           { _id: context.user._id },
//           { $addToSet: { friends: friendId } },
//           { new: true }
//         ).populate('friends');

//         return updatedUser;
//       }

//       throw new AuthenticationError('You need to be logged in!');
//     }
  }
};

module.exports = resolvers;
