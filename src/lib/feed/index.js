import {
  auth,
  newPost,
  accessPost,
  deletePost,
  editPost,
  likePost,
  dislikePost,
} from '../firebase';

export default () => {
  const container = document.createElement('div');
  container.id = 'container__feed';

  const template = `
    <header class='homeheader'>
      <img src='./lib/assets/paw.png' alt='logo' class='icons' />
      <img class='icons' src='./lib/assets/signout.png' id='signout' /img>
      
    </header>
    <main class='feed'>
      <section class='feed__new-post'>
        <textarea class='textarea' placeholder='Compartilhe conosco' rows='5' cols='20'></textarea>
        <button class='button post' id='post' >Publicar</button>
      </section>
      <section class='feed__post-list'>
      </section>
    </main>
    <footer class='homefooter'>
    </footer>
    `;

  container.innerHTML = template;

  function exibirPost(post) {
    const postList = container.querySelector('.feed__post-list');
    const templatePost = `
      <section class='post__card' data-postcard='${post.id}' id='${post.id}'>
        <div class='post__card__info'>
          <p id='post-username'>${post.username}</p>
          <p id='post-date'>${post.date}</p>
        </div>
        <div data-text='${post.id}' class='post__card__text'>
          <textarea disabled  class='posted-text' data-posted='${post.id}' id='post-text${post.id}'>${post.post}</textarea>
        </div>
        <div data-buttons='${post.id}' class='post__card__buttons'>
          <div class='likes'>
            <img class='icons-btn' src='./lib/assets/like.png' alt='editar' data-like='${post.id}'id='btn-like' /img> 
            <p class='likes-number'>${post.likes.length}</p>
          </div>
          ${post.userId === auth.currentUser.uid ? `
          <div class='edit-delete'>
          <img class='icons-btn' src='./lib/assets/edit.png' alt='editar' data-edit='${post.id}' id='edit${post.id}' /img>
          <img class='icons-btn' src='./lib/assets/delete.png' alt='editar' data-delete='${post.id}' id='delete${post.id}' /img>
          ` : ''}
          </div>
        </div>
        <div class='hidden' id='save-cancel${post.id}'>
          <button id='save${post.id}'>Salvar</button>
          <button id='cancel${post.id}'>Cancelar</button>
        </div>
      </section>
    `;

    postList.innerHTML += templatePost;

    const deleteButton = container.querySelectorAll('[data-delete]');
    deleteButton.forEach((element) => {
      element.addEventListener('click', (event) => {
        // eslint-disable-next-line no-alert
        if (window.confirm('Tem certeza que deseja deletar essa publicação?')) {
          const postCard = container.querySelector(['data-postcard']);
          deletePost(event.target.dataset.delete);
          if (postCard === event.target.dataset.delete) {
            postCard.remove();
          }
        }
      });
    });

    const editButton = container.querySelectorAll('[data-edit]');
    editButton.forEach((element) => {
      element.addEventListener('click', (event) => {
        const postId = event.target.dataset.edit;
        const divButtons = container.querySelector(`[data-buttons='${postId}']`);
        const divEdit = container.querySelector(`#save-cancel${postId}`);
        const textArea = container.querySelector(`#post-text${postId}`);
        const postedText = container.querySelector(`[data-posted='${postId}']`);
        const saveButton = container.querySelector(`#save${postId}`);
        const cancelButton = container.querySelector(`#cancel${postId}`);

        divEdit.removeAttribute('class');
        divButtons.setAttribute('class', 'hidden');
        textArea.removeAttribute('disabled');

        saveButton.addEventListener('click', () => {
          editPost(postId, postedText.value);
        });

        cancelButton.addEventListener('click', () => {
          divEdit.setAttribute('class', 'hidden');
          divButtons.removeAttribute('class');
          textArea.setAttribute('disabled', true);
        });
      });
    });

    const likeButton = container.querySelectorAll('[data-like]');
    likeButton.forEach((element) => {
      element.addEventListener('click', (event) => {
        if (post.likes.includes(auth.currentUser.uid)) {
          dislikePost(event.target.dataset.like, auth.currentUser.uid);
          post.likes.splice(post.likes.indexOf(auth.currentUser.uid));
        } else {
          likePost(event.target.dataset.like, auth.currentUser.uid);
          post.likes.push(auth.currentUser.uid);
        }
      });
    });
  }

  function clearPost() {
    container.querySelector('.feed__post-list').innerHTML = '';
  }

  accessPost(exibirPost, clearPost);

  const postButton = container.querySelector('#post');
  const textPost = container.querySelector('.textarea');
  postButton.addEventListener('click', () => {
    if (textPost.value !== '') {
      newPost(textPost.value);
      textPost.value = '';
    } else {
      // eslint-disable-next-line no-alert
      window.alert('Por favor, digite o que deseja compartilhar.');
    }
  });

  const singout = container.querySelector('#signout');
  singout.addEventListener('click', () => {
    window.location.hash = '#login';
  });

  return container;
};
