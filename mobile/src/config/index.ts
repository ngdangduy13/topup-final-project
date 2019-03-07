import firebaseConfig from './firebase.config';

const defaultConfig = {
    primaryColor: '#0c609d',
    backgroundColor: '#fff',
    dangerColor: '#EA0C41',
    lightBlue: '#86ADE8',
    backgroundColorAnswer: ['#ef0430', '#177fe8', '#f2c40c', '#5cc113'],
    shadownColorAnswer: ['#C70328', '#146DC7', '#C7A10A', '#4DA110'],
    version: '0.0.1',
    quizState: {
        published: 'PUBLISHED',
        draft: 'DRAFT',
        removed: 'REMOVED',
        searched: 'SEARCHED'
    },
    hostUrl: 'https://lumileds.techkids.io',
    imageUrl: '/static/temps/images/'
};

const _config = {
    ...defaultConfig,
    ...firebaseConfig
};

const config = () => _config;

export default config;
