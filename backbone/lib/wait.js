function waitFor(test, callback) {
  if(test()) {
    callback();
  } else {
    setTimeout(function() {
      waitFor(test, callback);
    }, 10);
  }
}