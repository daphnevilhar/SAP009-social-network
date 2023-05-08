import { signUp } from '../firebase.js';

export default () => {
  const container = document.createElement('div');
  container.id = 'container__signup';

  const template = `
  <div class='container__signup__info'>
    <img class='container__signup__info__logo' src='./lib/assets/logo1.png' alt='logo' />
    <h2 class='container__signup__info__subtitle'>Você está mais perto de poder ajudar a causa que acredita.</h2> 
    <h2 class='container__signup__info__subtitle'>Registre-se</h2> 
  </div>
  <form class='container__signup__form'>
    <input type='text' class='container__signup__form__input' id='name' placeholder='Nome' />
    <input type='email' class='container__signup__form__input' id='email' placeholder='Email' />
    <input type='password' class='container__signup__form__input' id='password' placeholder='Senha' />
    <p id='error-message-register'></p>
    <button class='container__signup__form__button' id='signupbutton'>Registrar</button>
    <button class='container__signup__form__button' id='backtologin'>Voltar</button>
  </form>
  `;

  container.innerHTML = template;

  const email = container.querySelector('#email');
  const password = container.querySelector('#password');
  const name = container.querySelector('#name');
  const signUpButton = container.querySelector('#signupbutton');
  const errorMessageRegister = container.querySelector('#error-message-register');

  function register(e) {
    e.preventDefault();
    if (name.value === '' || email.value === '' || password.value === '') {
      errorMessageRegister.innerHTML = 'Por favor, preencha todos os campos';
    } else {
      signUp(email.value, password.value, name.value)
        .then(() => {
          window.location.hash = '#login';
        });
    }
  }

  signUpButton.addEventListener('click', register);

  const returnLogin = container.querySelector('#backtologin');
  returnLogin.addEventListener('click', () => {
    window.location.hash = '#login';
  });

  return container;
};
