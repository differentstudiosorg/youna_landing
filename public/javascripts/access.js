$('document').ready(function(){

  $('#text').click(function() {
      var number = $('.number').val();
      var len = number.length;
      if(len === 12 || len === 10) {
        $.ajax({
          type : 'GET',
          url : 'https://o2uzqo7yv2.execute-api.us-east-1.amazonaws.com/test/text_app_link?number=' + number,
          dataType : 'json',
          success : function(data) {
            console.log(data);
          },
          error: function(err, data) {
              alert(err);
          }
        });

        $('.text-me-container').html('<p> We sent you a text! </p>');
      } else {
        $('.text-me-number').css({
          'border' : 'solid 1px red'
        });
        $('.text-me-number').attr('placeholder', 'Incorrect Format');
      }
  });


  $('.text-me-number').keypress(function(e) {
    if (e.which === 13) {
      var number = $('.number').val();
      var len = number.length;
      if(len === 12 || len === 10) {
        $.ajax({
          type : 'GET',
          url : 'https://o2uzqo7yv2.execute-api.us-east-1.amazonaws.com/test/text_app_link?number=' + number,
          dataType : 'json',
          success : function(data) {
            console.log(data);
          },
          error: function(err, data) {
              alert(err);
          }
        });

        $('.text-me-container').html('<p> We sent you a text! </p>');
      } else {
        $('.text-me-number').css({
          'border' : 'solid 1px red'
        });
        $('.text-me-number').attr('placeholder', 'Incorrect Format');
      }
    }
  });

  $('.question-bottom').click(function(){
    var answer_url = $('.q-video').attr('answer');
    $('source').attr('src', answer_url);
    $('.q-video').load();
    $('.q-video')[0].play();
    $('.play').css('visibility', 'hidden');
  });

  $('.play').click(function() {
    $('video')[0].play();
    $(this).css('visibility', 'hidden');
  });

  $('.play').on('tap', function() {
    $('video')[0].play();
    $(this).css('visibility', 'hidden');
  });

  $('video').click(function() {
    $('video')[0].pause();
    $('.play').css('visibility', 'visible');
  });

  $('video').on('tap', function() {
    $('video')[0].pause();
    $('.play').css('visibility', 'visible');
  });

  var OAUTH2_CLIENT_ID = '595122249070-lkh50cebfrqgpggt4cffh1bl3lms228l.apps.googleusercontent.com';
  var OAUTH2_SCOPES = [
    'profile', 'email'
  ];

  filepicker.setKey("AcRKiEksQSwCstqSrFPvqz");

  $('.post-auth').hide();
  $('.signout').hide();
  $('.hidden').hide();
  $('.message').html("");
  $('.post-everything-automatic').hide();
  $('.post-everything-manual').hide();
  $('.post-everything-update').hide();
  googleApiClientReady = function() {

    $('.sign-in').on( 'click touchstart', function() {
        gapi.auth.init(function() {
          checkAuth();
       });
    });

  }

  gapi.load("client:auth", googleApiClientReady);

  function checkAuth() {

    gapi.auth.authorize({
      client_id: OAUTH2_CLIENT_ID,
      scope: OAUTH2_SCOPES,
      immediate: false,
      cookie_policy: 'single_host_origin'
    }, handleAuthResult);

  }



  // Handle the result of a gapi.auth.authorize() call.
  function handleAuthResult(authResult) {

    if (authResult && !authResult.error) {

      $('.pre-auth').hide();
      $('.youtube-signin').hide();
      loadProfilePic(authResult);
    } else {

    }

  }

  function loadProfilePic(authResult) {
      var statistics = { "subscriberCount" : "0"};
      var url = 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + authResult.access_token;
      $.get(url, function(data, status){
        console.log(data);
        var picture = "https://s3.amazonaws.com/defaultstuff/default.jpg";
        if (status === "success") picture = data.picture;
        requestCreatorAccess(statistics, authResult, picture);
      });
      
  }

  function requestCreatorAccess(statistics, authResult, picture) {
    $('.message').html("Loading...");
    console.log(authResult);
    var data = {
      token : authResult.access_token, 
      statistics: statistics
    }
    $.ajax({
      type : 'POST',
      url : '/influencer/access',
      dataType : 'json',
      data : data,
      success : function(data) {
        console.log(data);
        if (data.name) {
          $('.post-auth').show();
          $("#paypal_email").trigger('input');
          $("input[type='email']").val(data.paypal_email);
          $("<br><img class = 'profile_pic' src='" + data.profile_url + "' style='width: 150px; height: auto'/><br><br> ").insertBefore(".profile_image");
          $('.tag_line').val(data.tagline);
          $('.message').html("");
          $("#token").attr("value", authResult.access_token);
          $('.hidden').val("Update");
          $('.post-auth-finish').hide();
          $('.signout').show();
        } else {
          $("<br><img class = 'profile_pic' src='" + picture + "' style='width: 150px; height: auto'/><br><br> ").insertBefore(".profile_image");
          $('.hidden').val("Finish");
          $('.message').html("");
          $("#token").attr("value", authResult.access_token)
          $('.post-auth').show();
          $('.post-auth-update').hide();
        }
      },
      error: "value",  function(err, data) {
          alert("ther was an error");
      }
    });

  }
  $('#additional_info_form').submit(function(e){
    var values = {};
    $.each($(this).serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });
    console.log(values);
    values.token = $('#token').val();
    $('.post-auth').hide();
    $('.message').html("Loading...");
    $.ajax({
      type : 'POST',
      url : '/influencer/add',
      dataType : 'json',
      data : values,
      success : function(data) {
        console.log(data);
        if (data.errorMessage) {
            $('.message').html(data.errorMessage);
        } else {
            $('.message').html("");
            $('.post-auth').hide();
            if ($('.hidden').val() === "Update" ) {
              $('.post-everything-update').show();
            } else {
              $(".post-everything-automatic").show();
            }
        }
      },
      error: function(err, data) {
          alert("there was an error");
      }
    });
    e.preventDefault();
  });

  $(".profile_image").click(function(){
    var image_button = this;
    filepicker.pickAndStore(
    {
      mimetype:"image/*",
      multiple: false,
      services: ['COMPUTER', 'FACEBOOK', 'INSTAGRAM', 'GOOGLE_DRIVE', 'DROPBOX']
    },
    {
      location:"S3"
    },
    function onSuccess(success) {
      //$("<br><img src='" + success[0].url + "' style='width: 150px; height: auto'/><br> ").insertAfter(image_button);
      var reqData = {
        profile_url : success[0].url,
        token : $("#token").val()
      }
      console.log(reqData);
      $.ajax({
        type : 'POST',
        url : '/influencer/update_profile_picture',
        dataType : 'json',
        data : reqData,
        success : function(data) {
          console.log(data);
          $('.profile_pic').attr("src", success[0].url);
        },
        error: function(err, data) {
            alert("there was an error");
        }
      });
    },
    function onError(error) {
      alert(error);
    }
  );


  });

  $(".signout").click(function() {
    gapi.auth.setToken(null);
    gapi.auth.signOut();
    $('.pre-auth').show();
    $('.youtube-signin').show();
    $('.post-auth').hide();
    $('.signout').hide();
  });


});









