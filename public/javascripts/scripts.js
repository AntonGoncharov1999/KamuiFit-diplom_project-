/* eslint-disable no-undef */
$(function() {
    // clear
    $('input').on('focus', function() {
      $('p.error').remove();
      $('input').removeClass('error');
    });
  
    // register
    $('.register-button').on('click', function(e) {
      e.preventDefault();
  
      var data = {
        login: $('#register-login').val(),
        password: $('#register-password').val(),
        passwordConfirm: $('#register-password-confirm').val()
      };
  
      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/api/auth/register'
      }).done(function(data) {
        if (!data.ok) {
          $('.register h2').after('<p class="error">' + data.error + '</p>');
          console.log(data.fields);
          if (data.fields) {
            data.fields.forEach(function(item) {
              $('input[name=' + item + ']').addClass('error');
            });
          }
        } else {
          $('.register h2').after('<p class="success">Отлично!</p>');
          $(location).attr('href', '/autorization');
        }
      });
    });
     // login
     $('.login-button').on('click', function(e) {
        e.preventDefault();
    
        var data = {
          login: $('#login-login').val(),
          password: $('#login-password').val()
        };
    
        $.ajax({
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: '/api/auth/login'
        }).done(function(data) {
          if (!data.ok) {
            $('.login h2').after('<p class="error">' + data.error + '</p>');
            console.log(data.fields);
            if (data.fields) {
              data.fields.forEach(function(item) {
                $('input[name=' + item + ']').addClass('error');
              });
            }
          } else {
            $('.login h2').after('<p class="success">Отлично!</p>');
            $(location).attr('href', '/');
          }
        });
     });
     //delete
    /*
    $('.remove').on('click', function(e) {
      e.preventDefault();
  
      var data = {
        id: $('#id').val(),
      };
  
      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/api/auth/news'
      });
    });
    */
  });

  
  /* eslint-enable no-undef */  