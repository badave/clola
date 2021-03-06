var _ = require('underscore');

phoneNumbers = _.range(200, 999);

function Room(name, id, owner) {
  this.name = name; // email of the customer rep
  this.id = id; // uuid
  this.owner = owner; // customer rep logged in
  this.people = [];
  this.peopleLimit = 4;
  this.status = "available";
  this.private = false;
};

Array.prototype.each_slice = function (size, callback){
  for (var i = 0, l = this.length; i < l; i += size){
    callback.call(this, this.slice(i, i + size));
  }
};

Room.prototype.addPerson = function(personPhoneNumber) {
  if (this.status === "available") {
    this.people.push(personPhoneNumber);
  }
};

Room.prototype.removePerson = function(personPhoneNumber) {
  var personIndex = this.people.indexOf(personPhoneNumber);
  this.people.splice(personIndex, 1);
};

Room.getRoomByPhoneNumber = function(phoneNumber, activeRooms) {
  a = [];
  activeRoomsSize = (_.size(activeRooms) || 1);
  console.log("room size: ", activeRoomsSize);
  
  var roomId;
  var roomObject;

  // check for phone number in the active rooms
  // if the number exists already return that room
  _.map(activeRooms, function(room, roomKey) {
    if(_.contains(room.people, phoneNumber)) {
      roomObject = activeRooms[roomKey];
    }
  });
  
  if(roomObject) return roomObject;
  
  phoneNumbers.each_slice((phoneNumbers.length+1)/activeRoomsSize, function(slice) {
    a.push(slice);
  });
  
  var areaCode = parseInt(phoneNumber.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$2"));
  
  for(var i=0; i<a.length; i++) {
    var index = a[i].indexOf(areaCode);
    if (index > -1){
      roomId = [i, index];
    }
  }
  
  return _.values(activeRooms)[roomId[0]];
};

Room.findRoomByName = function(roomName, activeRooms) {
  var roomObject;
  _.map(activeRooms, function(room, roomKey) {
    if(room["name"] === roomName) roomObject = room;
  });
  
  return roomObject;
};

Room.prototype.getPerson = function(personID) {
  var person = null;
  for(var i = 0; i < this.people.length; i++) {
    if(this.people[i].id == personID) {
      person = this.people[i];
      break;
    }
  }
  return person;
};

Room.prototype.isAvailable = function() {
  if (this.available === "available") {
    return true;
  } else {
    return false;
  }
};

Room.prototype.isPrivate = function() {
  if (this.private) {
    return true;
  } else {
    return false;
  }
};

module.exports = Room;