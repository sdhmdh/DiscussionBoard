import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
import { Comments } from '../imports/api/comments.js';
import './main.html';

Template.login.onCreated(function(){
  Session.set("register",false)
});

Template.login.helpers({
  register() {
    return Session.get("register")
  }
});
Template.DiscussionBoard.helpers({
  comments(){
    return Comments.find({},{sort: {createdAt: -1}}).fetch();
  }
});

Template.login.events({
  'click #register'(event) {
    event.preventDefault();
    $(".errmsg").text("");
    Session.set("register",true);
    var email = $("#email").val()
    var pass = $("#password").val();
    if(email == "" || pass == ""){
      $(".errmsg").text("(*) fields are mandatory")
      return
    }
    if(email && pass){
      Accounts.createUser({
        email:email,
        password:pass
      });
    }
  },
  'click #login'(event) {
    event.preventDefault();
    $(".errmsg").text("");
    Session.set("register",false);
    var email = $("#lemail").val()
    var pass = $("#lpassword").val();
    if(email == "" || pass == ""){
      $(".errmsg").text("(*) fields are mandatory")
      return
    }
    Meteor.loginWithPassword({email:email},pass, function(error,success){
      if(error){
        $(".errmsg").text(error.reason)
      }
    })
  },
  'click #logout'(event) {
    event.preventDefault();
    Session.set("register",false)
    Meteor.logout()
  },
});

Template.login.events({
  'click .postButton'(event) {
    event.preventDefault();
    $(".errmsg").text("")
    var user = Meteor.users.findOne({"_id":Meteor.userId()});
    if($("#comment").val() == ""){
      $(".errmsg").text("Type a comment to post")
      return
    }
    var insertObj ={
      "userId": Meteor.userId(),
      "comment": $("#comment").val(),
      "email": user["emails"][0].address,
      "createdAt": new Date()
    }
    Comments.insert(insertObj);
    $("#comment").val("");

    //should use methods altering data to be on safe side

    // Meteor.call("insertComment",insertObj,function(error,success){
    //   if(error){
    //     debugger
    //     console.log(error);
    //   }
    // })
  },
});