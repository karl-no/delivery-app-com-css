import React, { useContext, useEffect, useState } from 'react';
import { admRegisterNewUser } from '../api/user';
import Context from '../context/Context';

export default function AdmCreateUser() {
  const { lsUserData } = useContext(Context);
  const [userByAdmin, setUserByAdmin] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [hasError, sethasError] = useState(false);
  const [disabled, setDisable] = useState(true);
  const PASSWORD_MIN_LENGTH = 6;
  const NAME_MIN_LENGTH = 12;

  const submitClick = async () => {
    console.log(userByAdmin);
    const result = await admRegisterNewUser(lsUserData.token, userByAdmin);
    if (typeof result === 'string') {
      sethasError(true);
      setError(result);
    } else {
      setUserByAdmin({
        name: '',
        email: '',
        password: '',
        role: 'customer',
      });
    }
  };

  const handleChage = ({ target: { name, value } }) => {
    setUserByAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const validateEntry = () => {
      const emailRegex = /[^@]+@[^@]+\.[^@]+/gi;
      if (emailRegex.test(userByAdmin.email)
      && userByAdmin.password?.length >= PASSWORD_MIN_LENGTH
      && userByAdmin.name?.length >= NAME_MIN_LENGTH) {
        setDisable(false);
      } else {
        setDisable(true);
      }
    };
    validateEntry();
  }, [userByAdmin]);

  return (
    <fieldset>
      <h3>
        Cadastrar novo usuário
      </h3>
      {hasError && (
        <p data-testid="admin_manage__element-invalid-register">{ error }</p>
      )}
      <label htmlFor="nameRegisterByAdmin">
        Nome:
        <input
          data-testid="admin_manage__input-name"
          type="text"
          id="nameRegisterByAdmin"
          name="name"
          value={ userByAdmin.name }
          onChange={ (e) => handleChage(e) }
          required
        />
      </label>
      <label htmlFor="emailRegisterByAdmin">
        Email:
        <input
          data-testid="admin_manage__input-email"
          type="text"
          id="emailRegisterByAdmin"
          name="email"
          value={ userByAdmin.email }
          onChange={ (e) => handleChage(e) }
          required
        />
      </label>
      <label htmlFor="passwordRegisterByAdmin">
        Senha:
        <input
          data-testid="admin_manage__input-password"
          type="password"
          id="passwordRegisterByAdmin"
          name="password"
          value={ userByAdmin.password }
          onChange={ (e) => handleChage(e) }
          required
        />
      </label>
      <label htmlFor="typeRegisterByAdmin">
        Tipo:
        <select
          name="role"
          value={ userByAdmin.role }
          onChange={ (e) => handleChage(e) }
          onFocus={ (e) => handleChage(e) }
          id="typeRegisterByAdmin"
          data-testid="admin_manage__select-role"
        >
          <option value="customer">Cliente</option>
          <option value="seller">P. Vendedora</option>
          <option value="administrator">P. Administradora</option>
        </select>
      </label>
      <button
        data-testid="admin_manage__button-register"
        type="button"
        onClick={ submitClick }
        disabled={ disabled }
      >
        Cadastrar
      </button>
    </fieldset>
  );
}
