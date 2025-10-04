import React from 'react';

function ListPatients() {

    const items = [
        "Id",
        "Nom",
        "Prenom",
        "Email",
        "Telephone"
    ];
    const message = items.length === 0 ? <p>No user found</p> : null

  return (
    <>
      <h1>Liste des patients</h1>
      {message}
      <ul className="list-group">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <table className='table'>
        <thead>
          <tr>
            {items.map((item) => (
              <th scope='col' key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
            <tr>
                <td></td>
            </tr>
        </tbody>
      </table>
    </>
  );
}

export default ListPatients