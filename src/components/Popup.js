import React from 'react';
//import HorizontalCarousel from './HorizontalCarousel.js';
import AuthForm from './AuthForm';


function Popup() {
    chrome.runtime.sendMessage("Hello from the popup!");

    return (
        <div style={styles.main}>
            <h1>Chrome Ext - Popup</h1>
            <AuthForm />
        </div>
    )
}

const styles = {
    main: {
        width: '400px',
        height: '800px'
    }
}

export default Popup;