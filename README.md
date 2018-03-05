Github Pages CMS
=============

__A Simple content CMS on Github Pages, for Github Pages.__ 

![CMS](https://raw.githubusercontent.com/jansmolders86/gh-cms/master/example/cms.gif)

What is this?
=========================

Every once in a while I get asked to create a small simple low-budget website. The client usually has no clue what it takes to build a website let alone host it. I'm talking about the local butcher wanting a website. They often don't want to pay monthly hosting fees and get scared of the notion of seeing any code. So I wanted to host these sites on Github pages, but there is no way to offer a decent CMS experience. Let alone a CMS hosted on github pages itself. So, eventually this idea for a simple CMS was born using the GitHub API. 

How does this work?
-------------

The content is provide using a simple Schema v4 JSON.

On the client side you can retrieve the data and assign it to elements using data attributes for example. 
This is just an example, you can use whatever you like. 

``` JS
    var url = './assets/json/content.json';
    var $body = $("body");
    $.getJSON(url, function(data) {
      var homepage = data.en.homepage;
      $body.find("[data-content='header-title']").html(homepage.header.content.title);
    });
```

The "CMS" grabs the JSON, renders the contents using jdorn's, https://github.com/jdorn/json-editor

__The CMS Login requires you to use a github token instead of a password to add some security.__


The CMS Frontend is rendered on the fly and saving the content is immediate, refresh the page requires a login again. 

Cool, Cool, but what about SEO?
-------------

The complexity of this "system" if simple enough for the crawlers to "see" the content according to:
https://searchengineland.com/tested-googlebot-crawls-javascript-heres-learned-220157


TODO's
-------------
* Add WYSIWYG editor to textarea's
* Show errors on frontend
* Add security and store token securly 
* Expand functionality (upload images, versioning, etc)
