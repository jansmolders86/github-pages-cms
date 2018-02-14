Github Pages CMS
=============

__A Simple content CMS on Github Pages, for Github Pages__ 

[![CMS](assets/exmaple/cms.gif)

What is this?
=========================

Every once in a while I get asked to create a small simple low-budget website. The client usually has no clue what it takes to build a website let alone host it. I'm talking about the local butcher wanting a website. They often don't want to pay monthly hosting fees and get scared of the notion of seeing any code. So I wanted to host these sites on Github pages, but there is no way to offer a decent CMS experience. Let alone a CMS hosted on github pages itself. So, eventually this idea for a simple CMS was born using the GitHub API. 

How does this work?
-------------

The content is provide using a simple JSON like you see below. 

```json
{
  "en": {
    "pages": {
      "homepage": {
        "header": {
          "content": {
            "title": "Header Title",
            "description": "Long text rendered in a textarea due to key."
          }
        },
        "content": {
          "section": {
            "title": "This is a section title",
            "images": {
              "src": "assets/images/1.png",
              "alt": "Toshiba"
            }
          }
        },
        "footer": {
          "content": {
            "title": "Footer Title"
          }
        }
      }
    }
  }
}
```

On the client side you can retrieve the data and assign it to elements using data attributes for example. 
This is just an exmaple, you can use whatever you like. 

``` JS
    var url = './assets/json/content.json';
    var $body = $("body");
    $.getJSON(url, function(data) {
      var homepage = data.en.homepage;
      $body.find("[data-content='header-title']").html(homepage.header.content.title);
    });
```

The "CMS" grabs the JSON, renders the contents in Input fields and Textarea's. 
If a field requires a Textarea, use "description", "text", "textarea" as it's key.

You can use whatever prop names you want but currently Array's aren't working yet. so you can do:

```json
    "pages": {
      "cool-page-title": {
        "something-unique": {
```

The CMS Frontend is rendered on the fly and saving the content is immediate, refresh the page requires a login again. 


TODO's
-------------
* Get Array's to work
* Add security and store token securly 
* Clean up the code (kinda hacky now) 
* Expand functionality (upload images, versioning, etc)
