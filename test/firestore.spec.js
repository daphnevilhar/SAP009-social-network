import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  addDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';

import { getAuth } from 'firebase/auth';

import {
  accessPost,
  editPost,
  deletePost,
  newPost,
} from '../src/lib/firebase.js';

jest.mock('firebase/firestore');
jest.mock('firebase/auth');

beforeEach(() => {
  jest.clearAllMocks();
});

// Teste acessar post

describe('accessPost', () => {
  it('should be a function', () => {
    expect(typeof accessPost).toBe('function');
  });

  it('deve acessar a publicação criada', async () => {
    orderBy.mockReturnValueOnce({});
    query.mockReturnValueOnce({});
    onSnapshot.mockReturnValueOnce([]);

    const mockCollection = 'collection';
    collection.mockReturnValueOnce(mockCollection);
    await accessPost();
    expect(orderBy).toHaveBeenCalledTimes(1);
    expect(orderBy).toHaveBeenCalledWith('date', 'desc');
    expect(collection).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledWith(undefined, 'posts');
    expect(query).toHaveBeenCalledTimes(1);
    expect(query).toHaveBeenCalledWith(mockCollection, {});
    expect(onSnapshot).toHaveBeenCalledTimes(1);
    expect(onSnapshot).toHaveBeenCalledWith({}, expect.any(Function));
  });
});

// Teste editar

describe('editPost', () => {
  it('should be a function', () => {
    expect(typeof editPost).toBe('function');
  });

  it('deve editar e atualizar a publicação', async () => {
    updateDoc.mockResolvedValue();
    const mockDoc = 'doc';
    doc.mockReturnValueOnce(mockDoc);
    const editarPost = 'editar';
    const salvarPost = 'salvar';
    const atualizarPost = {
      post: salvarPost,
    };
    await editPost(editarPost, salvarPost);

    expect(doc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(undefined, 'posts', editarPost);
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(mockDoc, atualizarPost);
  });
});

// Teste deletar post

describe('deletPost', () => {
  it('deve excluir o post', async () => {
    const mockDoc = 'doc';
    doc.mockReturnValueOnce(mockDoc);
    deleteDoc.mockResolvedValueOnce();
    const postId = 'post-id';
    await deletePost(postId);
    expect(doc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(undefined, 'posts', postId);
    expect(deleteDoc).toHaveBeenCalledTimes(1);
    expect(deleteDoc).toHaveBeenCalledWith(mockDoc);
  });
});

// Teste criar post

describe('newPost', () => {
  it(' should be a function', () => {
    expect(typeof newPost).toBe('function');
  });
  it('deve criar um post e guardar na coleção', async () => {
    addDoc.mockReturnValueOnce({ id: 'id' });
    const mockCollection = 'colletion';
    collection.mockReturnValueOnce(mockCollection);
    const mockAuth = {
      currentUser: {
        displayName: 'username',
        uid: 'uid',
      },
    };
    getAuth.mockReturnValueOnce(mockAuth);
    const dataPost = new Date();
    const textPost = 'text-post';
    const post = {
      userId: mockAuth.currentUser.uid,
      username: mockAuth.currentUser.displayName,
      date: dataPost,
      likes: [],
      post: textPost,
    };

    const createdPost = await newPost(textPost);
    expect(collection).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledWith(undefined, 'posts');
    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(addDoc).toHaveBeenCalledWith(mockCollection, post);
    expect(createdPost).toEqual({ ...post, id: 'id' });
  });
});
