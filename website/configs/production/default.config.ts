const defaultConfig = {
  app: {
    defaultPageSize: 10,
    maxPageSize: 50,
    pageSizeOptions: [10, 20, 50],
  },
  auth: {
    expiresIn_1day: 60 * 60,
    secret: 'Ba2THViaoHd8Nn7tNNoRfWxrbi4u1oDefkQtdk01FzqY11Pr8dlM7fkkQnZJWKP',
    googleOauth: {},
    facebookOauth: {},
    expiresIn_7days: 604800,
  },
  database: {
    mongoConnectionString: 'mongodb://localhost:27017/lumileds',
    mongoConnectionToken: 'mongoConnectionToken',
  },
  nextjs: {
    apiUrl: 'https://lumileds.techkids.io/api',
    hostUrl: 'https://lumileds.techkids.io/',
    cookieDomain: 'lumileds.techkids.io',
    corsOrigin: /.*\.lumileds.techkids.io$/,
  },
  customMail: {
    user: 'test@techkids.io',
    pass: 'pdbhlyhqghyfslhs',
  },
  deepLink: {
    url: 'lumileds://',
  },
  imageUrl: {
    temp: 'static/temps/images/',
    permanent: 'static/images/',
  },
  automaticMail: {
    user: 'noreply@up-beat.io',
    pass: 'rpzztqjgdnqacanc',
    service: 'yandex',
    host: 'smtp.yandex.com',
    username: 'Up Beat <noreply@up-beat.io>',
  },
  kdcMail: {
    user: 'test@techkids.io',
    pass: 'Techkids@123',
    service: 'gmail',
    host: 'smtp.gmail.com',
    username: 'Techkids <test@techkids.io>',
  },
  email: {
    client_id: '488096010616-0enjab7hhv5gm2vbrghjbl8okjnlardq.apps.googleusercontent.com',
    project_id: 'tactical-gate-224806',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://www.googleapis.com/oauth2/v4/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: 'qythRm_Qyov0OQZ6wo0Aejr4',
    redirect_uris: [
      'urn:ietf:wg:oauth:2.0:oob',
      'http://localhost',
    ],
    access_token: 'ya29.GltrBtDj6uBxOQKFsQ68jMesS3nr-wmqF1SI1gVDEs1Xfj_76kXF6-jucMWveyTIH1uxcv1zQZyc-MhMtItW3b0weeB9KacyTQNClxLfsZJAxvofxnYoPm_2N7YL',
    scope: 'https://mail.google.com/',
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: '1/Pyd6MtLIm3kU0YzH4AWQmGE4VUA7o5RaZp5z5qDivlk',
    mail_address: 'lumileds.send.mail@gmail.com',
    password: 'vuduyanh123',
  },
  roles: {
    admin: 'ADMINISTRATOR',
    quizzMaster: 'QUIZZ_MASTER',
  },
};

export default defaultConfig;
