module.exports = {
  useSSL: false,
  redis: {
    url: '127.0.0.1',
    port: 6379,
    tokenExpire: 5,
  },

  server: {
    port: 3000,
    cookie: {
      encryptkey: 'thisisarandomkey',
      sessionTimeout: 900,
      maxage: 180,
    },
  },

  resultLimit: 999,
};
