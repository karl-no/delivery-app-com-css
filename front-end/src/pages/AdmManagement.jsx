import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import AdmCreateUser from '../components/AdmCreateUser';
import Context from '../context/Context';
import AdmTable from '../components/AdmTable';
import { deletedUser, getAll } from '../api/user';

export default function AdmManagement() {
  const { lsUserData } = useContext(Context);
  const [users, setUsers] = useState();
  const history = useHistory();
  const removeUser = async (id) => deletedUser(id, lsUserData.token);

  useEffect(() => {
    if (lsUserData.role !== 'administrator') {
      return history.push('/customer/products');
    }
  }, [history, lsUserData.role]);

  useEffect(() => {
    const getAllUsers = async () => {
      const result = await getAll(lsUserData.token);
      setUsers(result);
    };
    getAllUsers();
  }, [lsUserData.token, users]);
  return (
    <div>
      <Header />
      <AdmCreateUser />
      { users && <AdmTable data={ users } removeUser={ removeUser } /> }
    </div>
  );
}
