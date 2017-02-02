$('document').ready(function(){

  $('.message').html("");

  $('#text').click(function() {
      var number = $('.number').val();
      var len = number.length;
      if(len === 12 || len === 10) {
        $.ajax({
          type : 'GET',
          url : 'https://o2uzqo7yv2.execute-api.us-east-1.amazonaws.com/test/text_app_link?number=' + number,
          dataType : 'json',
          success : function(data) {
            $('<p> We sent you a text! </p>').insertBefore('.text-me-container');
          },
          error: function(err, data) {
            $('<p> Error sending text. </p>').insertBefore('.text-me-container');
          }
        });
      } else {
        $('.text-me-number').css({
          'border' : 'solid 1px red'
        });
        $('.text-me-number').attr('placeholder', 'Incorrect Format');
      }
  });

  $('.gallery').on('click', '.gallery_image', function(){
    $('.selected_profile').removeClass('selected_profile');
    $('.profile_picture_text').remove();
    $(this).addClass('selected_profile');
    var this_url = $(this).attr('src');
    var urls = [];
    urls.push(this_url);
    $('.gallery_image').each(function(item) {
      var url = $(this).attr('src');
      if (url != this_url) urls.push(url)
    })

    var reqData = {
        images : urls,
        token : $("#token").val()
    }

    $.ajax({
      type : 'POST',
      url : '/influencer/update_profile_picture',
      dataType : 'json',
      data : reqData,
      success : function(data) {
        //console.log("success", data);
        //$('.profile_pic').attr("src", success[0].url);
      },
      error: function(err, data) {
          alert("There was an error");
      }
    });

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
            $('.text-me-container').html('<p> We sent you a text! </p>');
          },
          error: function(err, data) {
            $('.text-me-container').html('<p> There was an error. </p>');
          }
        });
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
        var picture = "https://s3.amazonaws.com/defaultstuff/default.jpg";
        if (status === "success") picture = data.picture;
        requestCreatorAccess(statistics, authResult, picture);
      });
      
  }

  function requestCreatorAccess(statistics, authResult, picture) {
    $('.message').html("Loading...");
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
        if (data.name) {
          $('.post-auth').show();
          $("#paypal_email").trigger('input');
          $("input[type='email']").val(data.paypal_email);
          var html = "";
          for (var i = 0; i < data.images.length; i++) {
            if (i === 0) html += "<img class='selected_profile gallery_image image-" + i + "' src='" + data.images[i] + "'></img>";
            else html += "<img class='gallery_image image-" + i + "' src='" + data.images[i] + "'></img>";
          }
          $('.gallery').html(html);
          $('.tag_line').val(data.tagline);
          if (data.facebook_link != "none") $('#facebook_link').val(data.facebook_link);
          if (data.instagram_link != "none") $('#instagram_link').val(data.instagram_link.replace("https://www.instagram.com/",""));
          if (data.twitter_link != "none") $('#twitter_link').val(data.twitter_link.replace("https://www.twitter.com/",""));
          if (data.youtube_link != "none") $('#youtube_link').val(data.youtube_link.replace("https://www.youtube.com/user/",""));
          $('.message').html("");
          $("#token").attr("value", authResult.access_token);
          $('.hidden').val("Update");
          $('.post-auth-finish').hide();
          $('.signout').show();
        } else {
          $('.gallery').html("<br><img class='gallery_image selected_profile' src='" + picture + "' style='width: 150px; height: auto'/><br><br> ");
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

  function imagesHTML(urls) {
    for (var i = 0; i < urls.length; i++) {
      html += "<img src=" + urls[i] + "></img>";
    }
  }

  $('#additional_info_form').submit(function(e){
    var values = {};

    $.each($(this).serializeArray(), function(i, field) {
        if (field.value === "") field.value = "none";
        values[field.name] = field.value;
    });

    values.token = $('#token').val();
    $('.post-auth').hide();
    $('.message').html("Loading...");
    $.ajax({
      type : 'POST',
      url : '/influencer/add',
      dataType : 'json',
      data : values,
      success : function(data) {
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
      cropRatio: 10/11,
      cropForce: true,
      mimetype:"image/*",
      multiple: true,
      services: ['CONVERT','COMPUTER', 'FACEBOOK', 'INSTAGRAM', 'GOOGLE_DRIVE', 'DROPBOX'],
      conversions: ['crop', 'rotate', 'filter'],
      maxFiles: 3,
      minFiles: 2
    },
    {
      location:"S3"
    },
    function (blobs) {
      var html = "";
      var urls = [];
      for (var i = 0; i < blobs.length; i++) {
        urls.push(blobs[i].url);
        if (i === 0) html += "<img class='gallery_image selected_profile image-" + i + "' src=" + blobs[i].url + "></img>";
        else html += "<img class='gallery_image image-" + i + "' src=" + blobs[i].url + "></img>";
      }
      $('.gallery').html(html);
      var reqData = {
        images : urls,
        token : $("#token").val()
      }
      $.ajax({
        type : 'POST',
        url : '/influencer/update_profile_picture',
        dataType : 'json',
        data : reqData,
        success : function(data) {
          //$('.profile_pic').attr("src", success[0].url);
        },
        error: function(err, data) {
            alert("there was an error");
        }
      });
    },
    function onError(error) {
      //console.log("ERROR", error);
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









