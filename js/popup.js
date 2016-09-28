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


document.addEventListener("DOMContentLoaded", function(){
	chrome.tabs.getSelected(null, function(tab) {
        var tabUrl = tab.url;

        document.getElementById('site').innerHTML = extractDomain(tab.url);
    });
    //document.getElementById('ciao').innerHTML = "Stringa:"+arr.toString();
    //$("#allow-cookies").on('click',function(){ arr.push("ciao"); });
});

