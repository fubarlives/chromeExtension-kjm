import React, { Component } from 'react'

class AuthForm extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            isloggedin: false,
            user: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handle_click_login = this.handle_click_login.bind(this);
        this.handle_click_logout = this.handle_click_logout.bind(this);
        this.checkAuth = this.checkAuth.bind(this);
    }


    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
        //console.log([event.target.name] + ' ' + event.target.value);
    }


    checkAuth() {
        chrome.runtime.sendMessage({ command: "checkAuth" }, (response) => {
            console.log("[message=]", response);
            if (response.status === 'success') {
                this.setState({
                    isloggedin: true,
                    user: response.user,
                });
            }
            else {
                this.setState({
                    isloggedin: false,
                });
            }
        });
    }

    componentDidMount() {
        console.log('COMPONENT DID MOUNT');
        //Check user logged in
        // document.querySelector('.logoutArea').style.display = 'none';
        // document.querySelector('.logoutArea span').innerHTML = '';
        // document.querySelector('.loginArea').style.display = 'none';

        // chrome.runtime.sendMessage({ command: "checkAuth" }, (response) => {
        //     console.log("[message=]", response);
        this.checkAuth();

        // if (this.checkAuth()) {
        //     // show logout button
        //     document.querySelector('.logoutArea').style.display = 'block';
        //     document.querySelector('.logoutArea span').innerHTML = response.uid;
        // } else {
        //     // show login form
        //     document.querySelector('.loginArea').style.display = 'block';
        // }
    };


    handle_click_login() {
        chrome.runtime.sendMessage({ command: "Login", data: { e: this.state.email, p: this.state.password } }, (response) => {
            console.log('[login response]', response);
            //response.loggedIn
            //     if (response.loggedIn) {
            //         document.querySelector('.logoutArea').style.display = 'block';
            //         document.querySelector('.logoutArea span').innerHTML = response.uid;
            //     } else {
            //         document.querySelector('.loginArea').style.display = 'none';
            //     }

            if (response.status === 'success') {
                this.setState({
                    isloggedin: true,
                    user: response.user,
                });
            }
            else {
                this.setState({
                    isloggedin: false,
                });
            }


        });
    }

    handle_click_logout = () => {
        chrome.runtime.sendMessage({ command: "Logout" }, (response) => {
            console.log('[logout response]', response);
            // if (response.loggedIn) {
            //     document.querySelector('.logoutArea').style.display = 'none';
            //     document.querySelector('.logoutArea span').innerHTML = response.message.uid;
            // } else {
            //     document.querySelector('.loginArea').style.display = 'block';
            // }

            if (response.status == 'success') {
                this.setState({
                    isloggedin: false,
                });
            }
        });
    }


    render() {
        //code here if any before rendering
        console.log('current state isLogged:', this.state.isloggedin);
        if (!this.state.isloggedin) {
            return (
                <div class="userArea">
                    <div class="loginArea">
                        <label>Email:</label>
                        <input name="email" type="email" value={this.state.email} onChange={this.handleChange} />
                        <label>Password: </label>
                        <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
                        <button onClick={this.handle_click_login} class="login-btn-auth" type="button">Login</button>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div class="userArea">
                    <div class="logoutArea">
                        <p>Logged in user: <span>{this.state.user.uid}</span></p>
                        <button onClick={this.handle_click_logout} class="logout-btn-auth" type="button">Logout</button>
                    </div>
                </div>
            )
        }

    }
}
export default AuthForm;