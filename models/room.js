function Room(name, id, owner) {
  this.name = name;
  this.id = id;
  this.owner = owner;
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

Room.prototype.addPerson = function(personID) {
  if (this.status === "available") {
    this.people.push(personID);
  }
};

Room.prototype.removePerson = function(person) {
  var personIndex = -1;
  for(var i = 0; i < this.people.length; i++){
    if(this.people[i].id === person.id){
      playerIndex = i;
      break;
    }
  }
  this.people.remove(personIndex);
};

Room.prototype.getRoomByPhoneNumber = function(phoneNumber) {
  arr = _.range(200, 999);
  a = [];
  arr.each_slice(40, function(slice) {
    a.push(slice);
  });
  
  var areaCode = parseInt(phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1"));
  
  var roomId;
  
  for(var i=0; i<a.length; i++) {
    var index = a[i].indexOf(areaCode);
    if (index > -1){
        roomId = [i, index];
    }
  }
  
  roomId = roomId.toString();
  return "1";
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