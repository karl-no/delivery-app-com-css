import React from 'react';
import PropTypes from 'prop-types';

export default function AdmTable({ data, removeUser }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Descrição</th>
          <th>Quantidade</th>
          <th>Valor Unitário</th>
          <th>Sub-total</th>
        </tr>
      </thead>
      <tbody>
        {data && data.map((user, i) => (
          <tr key={ `${user.name}-${i}` }>
            <td
              data-testid={ `admin_manage__element-user-table-item-number-${i}` }
            >
              { i + 1 }
            </td>
            <td
              data-testid={ `admin_manage__element-user-table-name-${i}` }
            >
              { user.name }
            </td>
            <td
              data-testid={ `admin_manage__element-user-table-email-${i}` }
            >
              { user.email }
            </td>
            <td
              data-testid={ `admin_manage__element-user-table-role-${i}` }
            >
              { user.role }
            </td>
            <td>
              <button
                type="button"
                data-testid={ `admin_manage__element-user-table-remove-${i}` }
                onClick={ () => removeUser(user.id) }
              >
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

AdmTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    map: PropTypes.func,
  })).isRequired,
  removeUser: PropTypes.func.isRequired,
};
