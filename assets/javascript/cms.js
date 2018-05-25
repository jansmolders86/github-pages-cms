
$(function(){
    $('#ghsubmitbtn').on('click', function(e){
        e.preventDefault();
        var sha;
        var owner = $('#owner').val();
        var token = $('#ghToken').val();
        var repo = $('#repo').val();
        var path = $('#path').val();
        var branch = $('#branch').val();
        var alert = $('.alert');
        var resultsContainer = $('#results');
        var submitButtonText = "Save Changes";
        var resetButtonText = "Reset Changes";
        var hasClicked = false;
        var didSubmit = false;

        if(!hasClicked){
            $.ajax({
                url: "https://api.github.com/repos/"+owner+"/"+repo+"/contents/"+path,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "user" + btoa("token:"+token));
                },
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    var jsonFile = data.content;
                    sha = data.sha;
                    var decodedJson = atob(jsonFile);
                    var parsedDecodedJson = JSON.parse(decodedJson);
                    hasClicked = true;
                    if(parsedDecodedJson){
                        $('#login').hide();
                        alert.addClass('hidden');
                        //parseData(parsedDecodedJson);

                        JSONEditor.defaults.editors.object.options.collapsed = true;
                        var editor = new JSONEditor(document.getElementById('results'),{
                            ajax: true,
                            disable_edit_json: true,
                            schema: {
                                $ref: parsedDecodedJson
                            },
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
                                var JsonData = JSON.stringify(formData, null, 4);
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
                                    console.log('Files committed!');
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

                },
                error: function(error){
                    alert.addClass('alert-danger').removeClass('hidden').html('Something went wrong:'+error.responseText);
                    hasClicked = false;
                }
            });

        }
    });
});
