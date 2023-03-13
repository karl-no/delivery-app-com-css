import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { login } from '../api/user';
import Context from '../context/Context';

const SUCESS_STATUS = 200;
const TO_STRING = 16;
const SLICE = -2;

export default function Login() {
  const { setLsUserData } = useContext(Context);
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);

  const validateInputs = () => {
    const emailRegex = /[^@]+@[^@]+\.[^@]+/gi;
    const MIN_LENGTH = 5;
    const isEmailValid = emailRegex.test(email);
    const isNameValid = password.length > MIN_LENGTH;
    return !(isNameValid && isEmailValid);
  };

  // https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window
      .atob(base64).split('')
      .map((c) => `%${(`00${c.charCodeAt(0).toString(TO_STRING)}`)
        .slice(SLICE)}`).join(''));

    return JSON.parse(jsonPayload);
  }

  // Do cliente: /customer/products,
  // Da pessoa vendedora: /seller/orders,
  // Da pessoa administradora: /admin/manage
  const saveOnLocalStorage = (token) => {
    const decoded = parseJwt(token);
    setLsUserData({
      name: decoded.data.name,
      email: decoded.data.email,
      role: decoded.data.role,
      token,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login({ email, password });
    if (result.status === SUCESS_STATUS) {
      setErrorMessage(false);
      saveOnLocalStorage(result.data.token);
    } else {
      setErrorMessage(true);
    }
    const decoded = parseJwt(result.data.token);
    console.log(decoded);
    if (decoded.data.role === 'seller') history.push('/seller/orders');
    if (decoded.data.role === 'customer') history.push('/customer/products');
    if (decoded.data.role === 'administrator') history.push('/admin/manage');
  };

  useEffect(() => {
    const { token } = JSON.parse(localStorage.getItem('user')) || '';
    if (token) history.push('/customer/products');
  }, [history]);

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <h1 className="p-5">NOME DO APLICATIVO</h1>
      <form
        className="bg-[#EAF1EF] mx-auto w-80 pt-4 pr-7 pl-7 pb-6 flex flex-col gap-3
          rounded-sm border-[#B1C2BE] border md:w-96"
        onSubmit={ handleSubmit }
      >
        <div>
          <label className="pl-4" htmlFor="email-input">
            Login
            <input
              type="text"
              data-testid="common_login__input-email"
              id="email-input"
              className="w-full p-2 pl-3 border border-gray-500 rounded drop-shadow-lg"
              placeholder="email@trybeer.com.br"
              name="email"
              value={ email }
              onChange={ ({ target }) => setEmail(target.value) }
            />
          </label>
        </div>
        <div>
          <label className="pl-4" htmlFor="password-input">
            Senha
            <input
              type="password"
              id="password-input"
              className="w-full p-2 pl-3 border border-gray-500 rounded drop-shadow-lg"
              data-testid="common_login__input-password"
              placeholder="***********"
              name="password"
              value={ password }
              onChange={ ({ target }) => setPassword(target.value) }
            />
          </label>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-primary rounded text-white"
          data-testid="common_login__button-login"
          disabled={ validateInputs() }
        >
          LOGIN
        </button>
        <button
          type="button"
          className="w-full p-2 rounded text-primary border-2 border-primary"
          data-testid="common_login__button-register"
          onClick={ () => history.push('/register') }
        >
          Ainda não tenho conta
        </button>
      </form>
      { errorMessage
        ? (
          <span
            className="pt-4"
            data-testid="common_login__element-invalid-email"
          >
            Usuário ou senha inválidos
          </span>
        ) : null}
    </div>
  );
}
