/*
 * Cookie Destroyer - Chrome Extension
 * 
 * Author: twyK
 *
 * Homepage: https://github.com/twyyK/Cookie-Destroyer-Chrome
 * 
 */

// TODO: Salvare cookie per siti su scelta dell'utente - IndexedDB
// TODO: Se c'è un'altra tab aperta sul browser con lo stesso sito, non elimina subito i cookie

var tabToUrl = {};
var whitelistedSites = {};
var lastDelCookie = new String();

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    tabToUrl[tabId] = tab.url;
    console.log("Formatted URL: "+extractDomain(tabToUrl[tabId]));
  });

  chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
      console.log(tabToUrl[tabId]);
      console.log("Formatted URL: "+extractDomain(tabToUrl[tabId]));

      chrome.cookies.getAll({domain: extractDomain(tabToUrl[tabId])}, function(cookies) {
        //console.log(tabToUrl[tabId]);
      for(var i=0; i < cookies.length; i++) {
        console.log(cookies[i]);
        console.log("Domain: "+cookies[i].domain);
        console.log("Name: "+cookies[i].name);
        chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
        lastDelCookie = "https://" + cookies[i].domain  + cookies[i].path;
      }
      deleteCookieNotification();
      lastDelCookie = "";
    });
  });


function extractDomain(url) {
    var domain;

    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    domain = domain.split(':')[0];
    
   
    domain = domain.replace("www.","");

    return domain;
}

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.getSelected(null, function(tab) {
        arr.push(extractDomain(tab.url));
    });
});

function deleteCookieNotification(){
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('Deleted Cookie!', {
      icon: 'images/128px.png',
      body: "Deleted: "+extractDomain(lastDelCookie),
    });

    notification.onclick = function () {
      notification.close();      
    };

    notification.onshow = function(){
      setTimeout(function(){
        notification.close();
      }, 3000);
    };
  }
}

