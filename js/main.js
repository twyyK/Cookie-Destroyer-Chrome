/*
 * Cookie Destroyer - Chrome Extension
 * 
 * Author: twyK
 *
 * Homepage: https://github.com/twyyK/Cookie-Destroyer-Chrome
 * 
 */

// TODO: Salvare cookie per siti su scelta dell'utente - IndexedDB

var tabToUrl = {};
var allTabs = [];
var lastDelCookie = new String();

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    tabToUrl[tabId] = tab.url;
  });

  chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    getAllTabs();
      setTimeout(function(){
          if(allTabs.indexOf(extractDomain(tabToUrl[tabId])) <= -1){
            chrome.cookies.getAll({domain: extractDomain(tabToUrl[tabId])}, function(cookies) {
                for(var i=0; i < cookies.length; i++) {
                  chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
                  lastDelCookie = "https://" + cookies[i].domain  + cookies[i].path;
                }
              deleteCookieNotification();
              lastDelCookie = "";
            });
          }
        allTabs = [];
      }, 100);
  });


function extractDomain(url) {
    var domain;

    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }

    domain = domain.split(':')[0];
    domain = domain.replace("www.","");

    return domain;
}

function deleteCookieNotification(){
  if (!Notification) {
    alert('Desktop notifications not available in your browser.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    if(lastDelCookie == null || lastDelCookie == ""){
      var notification = new Notification('Deleted Cookie!', {
        icon: "images/128px.png",
        body: "Successfully deleted a Cookie!",
      });
    } else {
      var notification = new Notification('Deleted Cookie!', {
        icon: "images/128px.png",
        body: "Deleted: "+extractDomain(lastDelCookie),
      });
    }

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

function getAllTabs(){
  chrome.windows.getAll({populate:true},function(windows){
    windows.forEach(function(window){
      window.tabs.forEach(function(tab){
        allTabs.push(extractDomain(tab.url));
      });
    });
  });
}

