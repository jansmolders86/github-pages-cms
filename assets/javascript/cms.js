var sha;
var owner = $('#owner').val();
var token = $('#ghToken').val();
var repo = $('#repo').val();
var path = $('#path').val();
var alert = $('.alert');
var resultsContainer = $('#results')
var submitButtonText = "Save Changes";
var resetButtonText = "Reset Changes";
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
                                $(this).addClass('disabled');
                                var token = $('#ghToken').val();
                                var api = new GithubAPI({token: token});
                                var JsonData = editor.getValue();

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

                            setTimeout(function () {
                                $('.submit-btn').removeClass('disabled');
                            },3000);
                        });

                        $('.reset-btn').on('click', function(e) {
                            e.preventDefault();
                            editor.setValue(parsedDecodedJson);
                        });
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