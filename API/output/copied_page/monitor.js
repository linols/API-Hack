
        document.addEventListener('DOMContentLoaded', () => {
          const forms = document.querySelectorAll('form');
          forms.forEach(form => {
            form.addEventListener('submit', (event) => {
              const loginField = form.querySelector('input[type="text"], input[type="email"]');
              const passwordField = form.querySelector('input[type="password"]');
              if (loginField && passwordField) {
                console.log('Login:', loginField.value);
                console.log('Password:', passwordField.value);
              }
            });
          });
        });
      