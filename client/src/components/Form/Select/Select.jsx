import React from 'react';

const Select = ({ name, label, items, error, wrapperClass, selectClass, ...rest }) => {
    let wrapperClassRender = 'form-group';
    let selectClassRender = 'col-sm-10';
    if (wrapperClass) {
        wrapperClassRender = wrapperClass;
    }
    if (selectClass) {
        selectClassRender = selectClass;
    }

    return (
    <div className={`${wrapperClassRender} row`}>
      {label !== '' ? (
        <label htmlFor={name} className="col-sm-2 col-form-label">
          {label}
        </label>
      ) : (
        <div/>
      )}
    <select className={'form-control' + `${selectClassRender}`} id={name} name={name} {...rest} style={{marginLeft: '1rem'}}>
      {items.map(item => (
        <option key={item._id} value={item._id}>
          {item.name}
        </option>
      ))}
    </select>
    {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Select;
