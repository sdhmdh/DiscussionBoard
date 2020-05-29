import { Mongo } from 'meteor/mongo';
 
export const Comments = new Mongo.Collection('Comments');

Meteor.methods({
    "insertComment"(obj){
      Comments.insert(obj);
    },
    "addUpvotes"(id,userId){
        Comments.update(
            { _id: id },
            { $push: { upvotes:  userId} }
         )
    },
    "removeUpvotes"(id,userId){
        Comments.update(
            { _id: id },
            { $pull: { upvotes:  userId} }
         )
    }
  })