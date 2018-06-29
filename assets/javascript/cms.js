
$(function(){
    $('#ghsubmitbtn').on('click', function(e){
        e.preventDefault();
        var sha;
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
                    }
                }),
                $.ajax({
                    url: "https://api.github.com/repos/" + owner + "/" + repo + "/contents/" + schema,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "user" + btoa("token:" + token));
                    },
                    type: 'GET',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (schema) {
                        dataStore.schema = schema;
                    }
                })

            ).then(function() {
                var projectData = dataStore.data;
                var jsonFile = projectData.content;
                sha = projectData.sha;
                var decodedJson = atob(jsonFile);

                var parsedDecodedJson = JSON.parse(decodedJson);
                hasClicked = true;

                var schemaData = dataStore.schema;
                var schemaFile = schemaData.content;
                var decodedSchemaJson = atob(schemaFile);
                var parsedDecodedSchemaJson = JSON.parse(decodedSchemaJson);

                if(parsedDecodedJson){
                    $('#login').hide();
                    alert.addClass('hidden');

                    var editor = new JSONEditor(document.getElementById('results'),{
                        ajax: true,
                        disable_edit_json: true,
                        schema: parsedDecodedSchemaJson,
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
                            var JsonData = JSON.stringify(formData);
                            didSubmit = true;
                            $(this).addClass('disabled');

                            var api = new GithubAPI({ token: token});
                            api.setRepo(owner, repo);
                            api.setBranch(branch).then(function () {
                                return api.pushFiles(
                                    'CMS Update',
                                    [
                                        {
                                            content: JsonData,
                                            path: path
                                        }
                                    ]
                                );
                            }).then(function () {
                                console.log('Files committed!', JsonData);
                                $('.submit-btn').removeClass('disabled');
                                didSubmit = false;
                            });
                        }
                    });

                    $('.reset-btn').on('click', function(e) {
                        e.preventDefault();
                        editor.setValue(parsedDecodedJson);
                    });
                }
            });
        }
    });
});
