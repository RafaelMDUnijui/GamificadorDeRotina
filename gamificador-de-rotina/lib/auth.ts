
type User = {
  name: string;
  email: string;
  password: string;
};

type Session = {
  name: string;
  email: string;
};

function lerJSON<T>(chave: string, padrao: T): T {
  try {
    const valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) as T : padrao;
  } catch {
    return padrao;
  }
}

export const getUsers = (): User[] =>
  lerJSON<User[]>('users', []);

export const saveUser = (user: User): void => {
  const usuarios = getUsers();
  localStorage.setItem('users', JSON.stringify([...usuarios, user]));
};

export const getSession = (): Session | null =>
  lerJSON<Session | null>('session', null);

export const setSession = (user: User): void => {
  localStorage.setItem(
    'session',
    JSON.stringify({ name: user.name, email: user.email })
  );
};

export const logout = (): void => {
  localStorage.removeItem('session');
};
