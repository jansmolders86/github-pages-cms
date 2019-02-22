Github Pages CMS
=============

__A Simple Content Management System on Github Pages, for Github Pages.__ 

![CMS](https://raw.githubusercontent.com/jansmolders86/gh-cms/master/example/cms.gif)

Demo
===================
[Demo](https://jansmolders86.github.io/github-pages-cms/)

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
      $body.find("[data-content='header-title']").html(homepage.header.content.header);
    });
```
[Click here to see a demo implementation](https://github.com/jansmolders86/gh-cms-starter-template/blob/master/assets/javascript/dev/locale.js)

The "CMS" grabs the JSON, renders the contents using jdorn's, https://github.com/jdorn/json-editor

Controlling the way fields are rendered
-------------
You can use a Schema JSON file to control the way the CMS is rendering the fields. 
An example of both the content as well as the corresponding schema, can be found in the [Example](https://github.com/jansmolders86/gh-cms/tree/master/example) folder.

__The CMS Login requires you to use a github token instead of a password to add some security.__

The CMS Frontend is rendered on the fly and saving the content is immediate, refresh the page requires a login again. 

Cool, Cool, but what about SEO?
-------------

The complexity of this "system" is simple enough for the crawlers to "see" the content according to:
https://searchengineland.com/tested-googlebot-crawls-javascript-heres-learned-220157

Fine, I'm curious, let's see this in action!
------------

Demo URL: https://jansmolders86.github.io/gh-cms-starter-template/  (Using the same example data as seen in this repo)
Demo Github: https://github.com/jansmolders86/gh-cms-starter-template 

Getting Started
------------

So it works like this:

1. You have a client, which is just a static website.  Coded they way you want and hosted as a github pages page. Create a full access token in the page's settings on Github.
2. You have a 2 JSON files.

One for the CMS layout based on https://github.com/jdorn/json-editor exampled here: https://github.com/jansmolders86/gh-cms-starter-template/blob/master/assets/json/schema.json

And one JSON matching the Schema with the actual content:
https://github.com/jansmolders86/gh-cms-starter-template/blob/master/assets/json/content.json

1. convert the initial content.json to a base64 Blob and save that as a bin file. you can do that online using a tool like this (this is only the first time) https://www.base64encode.org/
2. Hook a a "middleware" in a way you're most comfortable. basically you just want to do an AJAX call, get the Blob, convert it back to a JSON and substitute or fill html with said content like in this example:
   https://github.com/jansmolders86/gh-cms-starter-template/blob/master/assets/javascript/dev/locale.js
3. run the CMS on a Github pages of your choosing. Once it's up you'll get a login screen.
4. log in using the github email/token and provide the staic path to the blob and the proper branch.
   Once you log in, the CMS will use the Schema and the blob to generate the appropriate fields.

TODO's
-------------
* Expand functionality (upload images, versioning, etc)
