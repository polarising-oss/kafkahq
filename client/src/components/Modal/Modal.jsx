import React from 'react';

import './styles.scss';

function Modal({ handleClose, show, children }) {
    const showHideClassname = show ? 'modal display-block' : 'modal display-none';

    return (
        <div className={showHideClassname}>
                {children}
        </div>
    );
}

export default Modal;
