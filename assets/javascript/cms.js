var sha;
var owner = $('#owner').val();
var token = $('#ghToken').val();
var repo = $('#repo').val();
var path = $('#path').val();
var alert = $('.alert');
var buttonText = "Save Changes";
var hasClicked = false;
var didSubmit = false;

$(function(){
    $('#ghsubmitbtn').on('click', function(e){
        e.preventDefault();

        if(!hasClicked){
            $.ajax({
                url: "https://api.github.com/repos/"+owner+"/"+repo+"/contents/"+path,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "user" + btoa("token:"+token));
                },
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    var jsonFile = data.content;
                    sha = data.sha;
                    var decodedJson = atob(jsonFile);
                    var parsedDecodedJson = JSON.parse(decodedJson);

                    if(parsedDecodedJson){
                        $('#login').hide();
                        alert.addClass('hidden');
                        parseData(parsedDecodedJson);
                    }

                },
                error: function(error){
                    alert.addClass('alert-danger').removeClass('hidden').html('Something went wrong:'+error.responseText);
                }
            });
            hasClicked = true;
        }
    });
});

function parseData(item){
    var resultEl =  $('#results');
    var prefix;
    var languages = Object.keys(item);
    if(languages){
        for (var i = 0; i < languages.length; i++) {
            var langCount = i;
            var landKey = languages[i];

            $.each(item, function (index, locales) {
                if (index === landKey) {
                    resultEl.append('<div class="lang-container lang' + langCount + '"></div>');
                    var langContainer = $(".lang" + langCount);
                    langContainer.append('<div class="lang-content-wrapper"></div>');
                    var contentWrapper = $('.lang-content-wrapper');
                    contentWrapper.append('<h2>'+landKey.toUpperCase() + '</h2>');
                    var pages = locales.pages;
                    if (pages) {
                        var page = Object.keys(pages);
                        contentWrapper.append('<div class="page-wrapper"></div>');
                        var pageWrapper = $('.page-wrapper');
                        pageWrapper.append('<h3>' + page + '</h3>');
                        $.each(pages, function (index, pageData) {
                            var sections = Object.keys(pageData);
                            for (var j = 0; j < sections.length; j++) {
                                var section = sections[j];
                                prefix = landKey + '.pages.' + page + '.' + section;
                                $.each(pageData, function (index, sectionData) {
                                    if (index === section) {
                                        pageWrapper.append('<h4>' + section.toUpperCase() + '</h4>');
                                        var sectionHeaders = Object.keys(sectionData);
                                        for (var k = 0; k < sectionHeaders.length; k++) {
                                            var subSectionHeader = sectionHeaders[k];
                                            pageWrapper.append('<h4>' + sectionHeaders[k].toUpperCase() + '</h4>');
                                            $.each(sectionData, function (index, data) {
                                                if (index === sectionHeaders[k]) {
                                                    traverseDownTree(pageWrapper, prefix+'.'+subSectionHeader, index, data);
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            resultEl.append('<button class="btn btn-lg btn-primary" type="submit">'+buttonText+'</button>');
                        });
                    }
                }
            });

        }
    }


    $('.lang-content-wrapper > h2').on('click', function(){
        $(this).parent().toggleClass('open');
    });
    $('.page-wrapper > h3').on('click', function(){
        $(this).parent().toggleClass('open');
    });

    resultEl.submit( function( e ) {
        e.preventDefault();
        if(!didSubmit){
            var token = $('#ghToken').val();
            var obj = $(this).serializeObject();
            var api = new GithubAPI({token: token});
            var JsonData = JSON.stringify(obj, null, 4);

            api.setRepo(owner, repo);
            api.setBranch('gh-pages');
            setTimeout(function () {
                api.pushFiles(
                    'CMS Update',
                    [
                        {content: JsonData, path: path}
                    ]
                );
            }, 2000);

            didSubmit = true;

        }
    });

}

function traverseDownTree(container, prefix, index, data){
    var uniqueID = Math.floor(Math.random() * 1000000000);
    container.append('<div class="section" id="'+uniqueID+'"></div>');
    var wrapper = $('#'+uniqueID);
    if(typeof data === 'string') {
        wrapper.append('<h4>' + index.toUpperCase() + '</h4>');
        createFields(wrapper, prefix, index, data);
    } else if(typeof data === 'object'){
        $.each(data, function (index, data) {
            if(typeof data === 'string') {
                createFields(wrapper, prefix, index, data);
            } else {
                traverseDownTree(container, prefix+'.'+index, index, data);
            }
        });
    }
}

function createFields(container, rootpath, index, item) {
    var uniqueID = Math.floor(Math.random() * 1000000000);
    if(index === 'description' || index === 'text' || index === 'textarea') {
        container.append('<div class="form-group">\n' +
            '<label for="content'+index+uniqueID+'">'+index+'</label>\n' +
            '<textarea name="'+rootpath+'.'+index+'" id="content'+index+uniqueID+'" class="form-control">'+$( $.parseHTML(item) ).text()+'</textarea>\n' +
            '</div>');
    } else {
        container.append('<div class="form-group">\n' +
            '<label for="content' + index + uniqueID + '">' + index + '</label>\n' +
            '<input name="'+rootpath+'.'+index+'" value="' + $( $.parseHTML(item) ).text() + '" id="content' + index + uniqueID + '" class="form-control" />\n' +
            '</div>');
    }
}

$.fn.serializeObject = function() {
    var o = {}; // final object
    var a = this.serializeArray(); // retrieves an array of all form values as

    $.each(a, function() {
        var ns = this.name.split("."); // split name to get namespace
        AddToTree(o, ns, this.value); // creates a tree structure
                                      // with values in the namespace
    });

    return o;
};

function AddToTree(obj, keys, def) {
    for (var i = 0, length = keys.length; i < length; ++i)
        obj = obj[keys[i]] = i == length - 1 ? def : obj[keys[i]] || {};
};

