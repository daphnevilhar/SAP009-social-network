import { signIn, signInWithGoogle } from '../firebase';

export default () => {
  const container = document.createElement('div');
  container.id = 'container__login';

  const template = `
    <div class='container__login__info'>
      <img class='container__login__info__logo' src='./lib/assets/logo1.png' alt='logo' />
      <p class='container__login__info__subtitle'>Dedicado a apoiadores da causa animal</p> 
    </div>
    <form class='container__login__form'>
      <input type='email' class='container__login__form__input' id='email' placeholder='Email:' />
      <div id='email-error-message'></div>
      <input type='password' class='container__login__form__input' id='password' placeholder='Senha:' />
      <div id='password-error-message'></div>
      <button type='button' class='container__login__form__button' id='loginbutton'>Entrar</button>
      <img id='google-button' src='./lib/assets/googlelogo.png' alt='Logo Google' />
      <button type='button' class='container__login__form__button' id='registerbutton'>Registrar</button>
    </form>
  
    `;

  container.innerHTML = template;

  const email = container.querySelector('#email');
  const password = container.querySelector('#password');
  const errorMessageEmail = container.querySelector('#email-error-message');
  const errorMessagePassword = container.querySelector('#password-error-message');
  const loginButton = container.querySelector('#loginbutton');
  const googleButton = container.querySelector('#google-button');

  const registerButton = container.querySelector('#registerbutton');
  registerButton.addEventListener('click', () => {
    window.location.hash = '#register';
  });

  function login(e) {
    e.preventDefault();

    signIn(email.value, password.value)
      .then(() => {
        window.location.hash = '#feed';
      })

      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          errorMessageEmail.innerHTML = 'Usuário não encontrado';
        } else if (error.code === 'auth/wrong-password') {
          errorMessagePassword.innerHTML = 'Senha incorreta';
        }
      });
  }

  loginButton.addEventListener('click', login);

  function loginWithGoogle(e) {
    e.preventDefault();

    signInWithGoogle()
      .then(() => {
        window.location.hash = '#feed';
      })

      .catch((error) => {
        if (error.code === '') {
          errorMessageEmail.innerHTML = '';
        } else if (error.code === 'auth/wrong-password') {
          errorMessagePassword.innerHTML = 'Senha incorreta';
        }
      });
  }

  googleButton.addEventListener('click', loginWithGoogle);

  return container;
};
