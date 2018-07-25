
$(function(){
    $('#ghsubmitbtn').on('click', function(e){
        e.preventDefault();
        var owner = $('#owner').val();
        var token = $('#ghToken').val();
        var repo = $('#repo').val();
        var path = $('#path').val();
        var schema = $('#schema').val();
        var alert = $('.alert');
        var resultsContainer = $('#results');
        var submitButtonText = "Save Changes";
        var resetButtonText = "Reset Changes";
        var hasClicked = false;
        var didSubmit = false;
        var dataStore = {
            data: {},
            schema: {}
        };

        if(!hasClicked){
            $.when(
                $.ajax({
                    url: "https://api.github.com/repos/" + owner + "/" + repo + "/contents/" + path,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "user" + btoa("token:" + token));
                    },
                    type: 'GET',
                    success: function (data) {
                        dataStore.data = data;
                    }, 
                    error: function (err) {
                        alert.addClass('error').removeClass('hidden').html('Something went wrong:', err);
                    } 
                }),
                $.ajax({
                    url: "https://api.github.com/repos/" + owner + "/" + repo + "/contents/" + schema,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "user" + btoa("token:" + token));
                    },
                    type: 'GET',
                    success: function (schema) {
                        dataStore.schema = schema;
                    }, 
                    error: function (err) {
                        alert.addClass('error').removeClass('hidden').html('Something went wrong:', err);
                    }
                })

            ).then(function() {
                var projectData = dataStore.data;
                var jsonFile = projectData.content;
				var schemaData = dataStore.schema;
                hasClicked = true;
                var schemaFile = schemaData.content;
				var decodedJson = decodeURIComponent(escape(window.atob(jsonFile)));
				var parsedDecodedJson = JSON.parse(decodeURIComponent(escape(window.atob(decodedJson))));
				var decodedSchemaJson = JSON.parse(atob(schemaFile));

				hasClicked = true;
                if(parsedDecodedJson){
                    $('#login').hide();
                    alert.addClass('hidden').removeClass('alert');

                    JSONEditor.plugins.sceditor.enable = true;
                    var editor = new JSONEditor(document.getElementById('results'),{
                        ajax: true,
                        disable_edit_json: true,
                        schema: decodedSchemaJson,
                        theme: 'bootstrap3',
                        startval: parsedDecodedJson,
                        iconlib: "bootstrap3"
                    });

                    resultsContainer.append('<button class="submit-btn btn btn-primary">'+submitButtonText+'</button>');
                    resultsContainer.append('<button class="reset-btn btn btn-primary">'+resetButtonText+'</button>');

                    $('.submit-btn').on('click', function( e ) {
                        e.preventDefault();
                        if(!didSubmit){
                            var owner = $('#owner').val();
                            var token = $('#ghToken').val();
                            var repo = $('#repo').val();
                            var path = $('#path').val();
                            var branch = $('#branch').val();
                            var formData = editor.getValue();
                            var encodedJsonData = btoa(unescape(encodeURIComponent(JSON.stringify(formData))));

                            didSubmit = true;
                            $(this).addClass('disabled');

                            var api = new GithubAPI({ token: token});
                            api.setRepo(owner, repo);
                            api.setBranch(branch).then(function () {
                                return api.pushFiles(
                                    'CMS Update',
                                    [
                                        {
                                            content: encodedJsonData,
                                            path: path
                                        }
                                    ]
                                );
                            }).then(function () {
                                console.log('Files committed!');
                                alert.addClass('success').removeClass('hidden').html('Files succesfully submitted to Github.');
                                $('.submit-btn').removeClass('disabled');
                                setTimeout(function(){
                                    alert.addClass('hidden').removeClass('success');
                                },4000);
                                didSubmit = false;
                            }).catch(function(err){
                                alert.addClass('error').removeClass('hidden').html('Something went wrong:', err);
                            });
                        }
                    });

                    $('.reset-btn').on('click', function(e) {
                        e.preventDefault();
                        editor.setValue(parsedDecodedJson);
                    });
                } else {
                    alert.addClass('error').removeClass('hidden').html('Something is wrong with the JSON. Make sure it is valid');
				}
            });
        }
    });
});