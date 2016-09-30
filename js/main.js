/*
 * Cookie Destroyer - Chrome Extension
 * 
 * Author: twyK
 *
 * Homepage: https://github.com/twyyK/Cookie-Destroyer-Chrome
 * 
 */

var tabToUrl = {};
var allTabs = [];
var lastDelCookie = new String();

initWhitelist();

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    tabToUrl[tabId] = tab.url;
    
    if(localStorage.getItem('whitelisted-sites').indexOf(extractDomain(tab.url)) > -1){
      chrome.browserAction.setIcon({ path: "images/v16px.png" });
    } else {
      chrome.browserAction.setIcon({ path: "images/16px.png" });
    }
  });

  chrome.tabs.onHighlighted.addListener(function(tabId) {
    chrome.tabs.getSelected(null, function(tab) {
      if(localStorage.getItem('whitelisted-sites').indexOf(extractDomain(tab.url)) > -1){
        chrome.browserAction.setIcon({ path: "images/v16px.png" });
      } else {
        chrome.browserAction.setIcon({ path: "images/16px.png" });
      }
    })
  });

  chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    getAllTabs();
      setTimeout(function(){
          if(allTabs.indexOf(extractDomain(tabToUrl[tabId])) == -1 && localStorage.getItem('whitelisted-sites').indexOf(extractDomain(tabToUrl[tabId])) == -1){
            chrome.cookies.getAll({domain: extractDomain(tabToUrl[tabId])}, function(cookies) {
                for(var i=0; i < cookies.length; i++) {
                  chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
                  lastDelCookie = "https://" + cookies[i].domain  + cookies[i].path;
                }
              if(!lastDelCookie == null || !lastDelCookie == ""){
                deleteCookieNotification();
              }
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
    if(!lastDelCookie == null || !lastDelCookie == ""){
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

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.getSelected(null, function(tab) {
    if(localStorage.getItem('whitelisted-sites').indexOf(extractDomain(tab.url)) > -1){
      whitelistedSitesDel(extractDomain(tab.url));
      chrome.browserAction.setIcon({ path: "images/16px.png" });
    } else {
      whitelistedSitesAdd(extractDomain(tab.url));
      chrome.browserAction.setIcon({ path: "images/v16px.png" });
    }
  });
});

function getAllTabs(){
  chrome.windows.getAll({populate:true},function(windows){
    windows.forEach(function(window){
      window.tabs.forEach(function(tab){
        allTabs.push(extractDomain(tab.url));
      });
    });
  });
}

function whitelistedSitesAdd(siteUrl){
  var wlSites = [];

  if(!localStorage.getItem('whitelisted-sites')){
    wlSites.push(siteUrl);
    localStorage.setItem('whitelisted-sites', wlSites);
  } else {
    wlSites = localStorage.getItem('whitelisted-sites').toString().split(",");
    wlSites.push(siteUrl);
    localStorage.setItem('whitelisted-sites', wlSites);
  }
}

function whitelistedSitesDel(siteUrl){
  var wlSites = [];

  wlSites = localStorage.getItem('whitelisted-sites').toString().replace(siteUrl,"");
  localStorage.setItem('whitelisted-sites', wlSites);
  wlSites = localStorage.getItem('whitelisted-sites').toString().replace(",,","");
  localStorage.setItem('whitelisted-sites', wlSites);
}

function initWhitelist(){
  var wlSites = [];

  if(!localStorage.getItem('whitelisted-sites')){
    localStorage.setItem('whitelisted-sites', wlSites);
  }
}

function log(msg){
  console.log(msg);
}
