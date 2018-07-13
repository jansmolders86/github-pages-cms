Github Pages CMS
=============

__A Simple Content Management System on Github Pages, for Github Pages.__ 

![CMS](https://raw.githubusercontent.com/jansmolders86/gh-cms/master/example/cms.gif)

What is this?
=========================

Every once in a while I get asked to create a small simple low-budget website. The client usually has no clue what it takes to build a website let alone host it. I'm talking about the local butcher wanting a website. They often don't want to pay monthly hosting fees and get scared of the notion of seeing any code. So I wanted to host these sites on Github pages, but there is no way to offer a decent CMS experience. Let alone a CMS hosted on github pages itself. So, eventually this idea for a simple CMS was born using the GitHub API. 

How does this work?
-------------

The content is exported as a base64 encoded .bin file but is in fact, a simple JSON file as seen in the [Example](https://github.com/jansmolders86/gh-cms/tree/master/example) folder. 

On the client side you can retrieve the data and assign it to elements using, for example; data attributes. 
This is just an example, you can use whatever you like. 

``` JS
    var url = './assets/json/content.json';
    var $body = $("body");
    $.getJSON(url, function(data) {
      var actual = JSON.parse(decodeURIComponent(escape(window.atob(data))));  //!important: Decode the base64 back to a legible JSON 
      var homepage = actual.en.homepage;
      $body.find("[data-content='header-title']").html(homepage.header.content.title);
    });
```

The "CMS" grabs the JSON, renders the contents using jdorn's, https://github.com/jdorn/json-editor
You can use the Schema JSON file to control the way the CMS is rendering the fields. An example of both the content as well as the corresponding schema, can be found in the [Example](https://github.com/jansmolders86/gh-cms/tree/master/example) folder.

__The CMS Login requires you to use a github token instead of a password to add some security.__

The CMS Frontend is rendered on the fly and saving the content is immediate, refresh the page requires a login again. 

Cool, Cool, but what about SEO?
-------------

The complexity of this "system" is simple enough for the crawlers to "see" the content according to:
https://searchengineland.com/tested-googlebot-crawls-javascript-heres-learned-220157

TODO's
-------------
* Expand functionality (upload images, versioning, etc)
