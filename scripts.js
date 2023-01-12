class Request {
  api_link = 'https://blog.kata.academy/api/';
  constructor() {
    this.method = 'GET';
  }
  set_method(data) {
    this.method = data;
  }
  async request(path, body, headers = {}) {
    return new Promise(async (res, rej) => {
      try {
        let headers_data = Object.assign(headers, {
          'Content-Type': 'application/json;charset=utf-8',
        });
        let data = await fetch(this.api_link + path, {
          headers: headers_data,
          body: body ? JSON.stringify(body) : null,
          method: this.method,
        });
        let json_data = await data.json();
        data.ok ? res(json_data) : rej(json_data);
      } catch (e) {
        rej(err);
      }
    });
  }
}

class User {
  api_link = 'https://blog.kata.academy/api/';
  constructor() {
    this.method = 'GET';
    this.token = null;
  }
  set_method(data) {
    this.method = data;
  }
  async request(path, body, headers = {}) {
    return new Promise(async (res, rej) => {
      try {
        let headers_data = Object.assign(headers, {
          'Content-Type': 'application/json;charset=utf-8',
        });
        let data = await fetch(this.api_link + path, {
          headers: headers_data,
          body: body ? JSON.stringify(body) : null,
          method: this.method,
        });
        let json_data = await data.json();
        data.ok ? res(json_data) : rej(json_data);
      } catch (e) {
        rej(err);
      }
    });
  }
  sign(username, email, password) {
    return new Promise(async (res, rej) => {
      this.set_method('POST');
      let request_data = await this.request('/users', {
        user: {
          username: username,
          email: email,
          password: password,
        },
      }).catch((err) => {
        rej(err);
      });
      res(request_data);
    });
  }
  login(email, password) {
    return new Promise(async (res, rej) => {
      this.set_method('POST');
      let request_data = await this.request('/users/login', {
        user: {
          email: email,
          password: password,
        },
      }).catch((err) => {
        rej(err);
      });
      res(request_data);
    });
  }
  get() {
    return new Promise(async (res, rej) => {
      this.set_method('GET');
      let request_data = await this.request('/user', null, {
        Authorization: 'Token ' + this.token,
      }).catch((err) => {
        rej(err);
      });
      res(request_data);
    });
  }
  set_token(value) {
    this.token = value;
  }
}

const user = new User();
const sign_form = document.querySelector('#sign');
const sign_button = sign_form.querySelector('button');
const sign_login = sign_form.querySelector('.sign_login');
const sign_email = sign_form.querySelector('.sign_email');
const sign_password = sign_form.querySelector('.sign_password');
const sign_message = sign_form.querySelector('p');
sign_button.addEventListener('click', () => {
  user
    .sign(sign_login.value, sign_email.value, sign_password.value)
    .then((res) => {
      let text = '';
      for (key in res.user) {
        text += `${key}: ${res.user[key]}\n`;
      }
      sign_message.textContent = text;
      user.set_token(res.user.token);
    })
    .catch((err) => {
      let text = '';
      for (key in err.errors) {
        text += `${key}: ${err.errors[key]}\n`;
      }
      sign_message.textContent = text;
    });
});

const login_form = document.querySelector('#login');
const login_button = login_form.querySelector('button');
const login_email = login_form.querySelector('.login_email');
const login_password = login_form.querySelector('.login_password');
const login_message = login_form.querySelector('p');
login_button.addEventListener('click', () => {
  user
    .login(login_email.value, login_password.value)
    .then((res) => {
      let text = '';
      for (key in res.user) {
        text += `${key}: ${res.user[key]}\n`;
      }
      login_message.textContent = text;
      user.set_token(res.user.token);
    })
    .catch((err) => {
      let text = '';
      for (key in err.errors) {
        text += `${key}: ${err.errors[key]}\n`;
      }
      login_message.textContent = text;
    });
});

const get_form = document.querySelector('.get');
const get_button = get_form.querySelector('button');
const get_message = get_form.querySelector('p');

get_button.addEventListener('click', () => {
  user
    .get()
    .then((res) => {
      let text = '';
      for (key in res.user) {
        text += `${key}: ${res.user[key]}\n`;
      }
      get_message.textContent = text;
    })
    .catch((err) => {
      let text = '';
      for (key in err.errors.error) {
        text += `${key}: ${err.errors.error[key]}\n`;
      }
      get_message.textContent = text;
    });
});