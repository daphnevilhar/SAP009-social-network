import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';

import {
  signUp,
  signIn,
  signInWithGoogle,
} from '../src/lib/firebase.js';

jest.mock('firebase/auth');

beforeEach(() => {
  jest.clearAllMocks();
});

// Teste fazer login com email e senha

describe('signIn', () => {
  it('deve fazer login com email e senha', () => {
    signInWithEmailAndPassword.mockResolvedValue({ dados: {} });

    const email = 'teste@email.com';
    const senha = '123456';

    signIn(email, senha);

    expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(undefined, email, senha);
  });
});

// Teste fazer login com google

describe('signInWithGoogle', () => {
  it('deve fazer login com google', () => {
    signInWithPopup.mockResolvedValue();
    signInWithGoogle();
    expect(signInWithPopup).toHaveBeenCalledTimes(1);
  });
});

// Teste fazer cadastro

describe('signUp', () => {
  it('deve criar uma conta com nome, email e senha', async () => {
    createUserWithEmailAndPassword.mockResolvedValue();
    updateProfile.mockResolvedValue();
    const mockAuth = { currentUser: {} };
    getAuth.mockReturnValue(mockAuth);

    const nome = 'teste';
    const email = 'teste@email.com';
    const senha = '1234560';

    await signUp(email, senha, nome);

    expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, email, senha);
    expect(updateProfile).toHaveBeenCalledWith(mockAuth.currentUser, { displayName: nome });
  });
});
