import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
import { Comments } from '../imports/api/comments.js';
import './main.html';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';

Template.login.onCreated(function () {
  Session.set("register", false)
});

Template.login.helpers({
  register() {
    return Session.get("register")
  }
});

Template.login.events({
  'click #register'(event) {
    event.preventDefault();
    $(".errmsg").text("");
    Session.set("register", true);
    var email = $("#email").val()
    var pass = $("#password").val();
    var repass = $("#passwordr").val();
    if (email == "" || pass == "" || repass == "") {
      $(".errmsg").text("(*) fields are mandatory")
      return
    }
    if (pass != repass) {
      $(".errmsg").text("Passwords do not match!")
      return
    }
    if (email && pass) {
      Accounts.createUser({
        email: email,
        password: pass
      });
    }
  },
  'click #login'(event) {
    event.preventDefault();
    $(".errmsg").text("");
    Session.set("register", false);
    var email = $("#lemail").val()
    var pass = $("#lpassword").val();
    if (email == "" || pass == "") {
      $(".errmsg").text("(*) fields are mandatory")
      return
    }
    Meteor.loginWithPassword({ email: email }, pass, function (error, success) {
      if (error) {
        $(".errmsg").text(error.reason)
      }
    })
  }
});

Template.DiscussionBoard.helpers({
  comments() {
    return Comments.find({}, { sort: { createdAt: -1 } }).fetch();
  },
  CurrentUser() {
    return Meteor.user().emails[0].address
  },
  upvoted(id) {
    upvotes = Comments.find({ "_id": id}).fetch()[0].upvotes;
    if(upvotes.length > 0){
      for(i=0; i< upvotes.length; i++){
        if(upvotes[i] == Meteor.userId()){
          return true
        }
      }
    }
    return false
  },
  totalUpvotes(id) {
    var comment = Comments.find({ "_id": id }).fetch()[0];
    if(comment.upvotes.length> 0){
      return comment.upvotes.length
    }else{
      return "0"
    }
  },
  postedAt(date){
    return moment(date).fromNow();
  }
});


Template.DiscussionBoard.events({
  'click .postButton'(event) {
    event.preventDefault();
    $(".errmsg").text("")
    var user = Meteor.users.findOne({ "_id": Meteor.userId() });
    if ($("#comment").val() == "") {
      $(".errmsg").text("Type a comment to post")
      return
    }
    var insertObj = {
      "userId": Meteor.userId(),
      "comment": $("#comment").val(),
      "email": user["emails"][0].address,
      "upvotes": [],
      "createdAt": new Date()
    }
    $("#comment").val("");

    //calling a method to insert comment
    Meteor.call("insertComment",insertObj,function(error,success){
      if(error){
        console.log(error);
      }
    })
  },
  'click #logout'(event) {
    event.preventDefault();
    Session.set("register", false)
    Meteor.logout()
  },
  'click .addVote'(){
    Meteor.call("addUpvotes",this._id,Meteor.userId(),function(error,success){
      if(error){
        console.log(error);
      }else{
        console.log("upvote successfull!");
      }
    })
  },
  'click .removeVote'(){
    Meteor.call("removeUpvotes",this._id,Meteor.userId(),function(error,success){
      if(error){
        console.log(error);
      }else{
        console.log("upvote removed successfully");
      }
    })
  }
});