Tasks =	new Mongo.Collection('tasks');



import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import './main.html';




Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});



Template.task.helpers({
	isOwner(){
		return this.owner === Meteor.userId();
	},
});



Template.task.events({														//for deletion and updation of tasks
  'click .toggle-checked' : function() {
    // Set the checked property to the opposite of its current value
     Meteor.call('tasks.setChecked', this._id, !this.checked);
  },
  'click .delete'  : function() {
    Meteor.call('tasks.remove', this._id);
  },
  'click .toggle-private'() {
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },
});



Template.body.helpers({															//display list of tasks
  tasks() {
  	const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});





Template.body.events({															//add new tasks
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
 
    // Insert a task into the collection
     Meteor.call('tasks.insert', text);
 
    // Clear form
    target.text.value = '';
  },
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});



Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

