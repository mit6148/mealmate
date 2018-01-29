//Source: 6.148 Staff

// Source: https://stackoverflow.com/questions/8064691/how-do-i-pass-along-variables-with-xmlhttprequest
function formatParams(params) {
  return Object
    .keys(params)
    .map(function(key) {
      return key+'='+encodeURIComponent(params[key])
    })
    .join('&');
}

// params is given as a JSON
function get(endpoint, params, successCallback, failureCallback) {
  const xhr = new XMLHttpRequest();
  const fullPath = endpoint + '?' + formatParams(params);
  xhr.open('GET', fullPath, true);
  xhr.onload = function(err) {
    if(err) console.log(err);
    console.log('onload', xhr);
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (successCallback) {
          console.log(xhr.responseText);
          successCallback(JSON.parse(xhr.responseText));
        }
      } else {
        if (failureCallback)
        failureCallback(xhr.statusText);
      }
    }
  };
  xhr.onerror = function(err) {
    failureCallback(xhr.statusText);
  }
  xhr.send(null);
}

function post(endpoint, params, successCallback, failureCallback) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', endpoint, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.withCredentials = true;
  xhr.onload = function(err) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (successCallback)
          successCallback(JSON.parse(xhr.responseText));
      } else {
        if (failureCallback)
          failureCallback(xhr.statusText);
      }
    }
  };
  xhr.onerror = function(err) {
    console.log(xhr.statusText);
  };
  xhr.send(JSON.stringify(params));
}

// https://gist.github.com/EtienneR/2f3ab345df502bd3d13e
/* function delete(endpoint, params, successCallback, failureCallback) {
  const xhr = new XMLHttpRequest();
  const fullPath = endpoint + '?' + formatParams(params);
  xhr.open("DELETE", endpoint, true);
  // xhr.setRequestHeader('Content-type', 'application/json');
  // xhr.withCredentials = true;
  xhr.onload = function(err) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (successCallback)
          successCallback(JSON.parse(xhr.responseText));
      } else {
        if (failureCallback)
          failureCallback(xhr.statusText);
      }
    }
  };
  xhr.onerror = function(err) {
    console.log(xhr.statusText);
  };
  xhr.send(null);
} */