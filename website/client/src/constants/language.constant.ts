interface LanguageInfo {
  language: string;
  img: string;
  title: string;
}

const languages: LanguageInfo[] = [
  {
    language: 'en',
    img: 'us.png',
    title: 'English',
  },
  {
    language: 'vi',
    img: 'vn.png',
    title: 'Vietnamese',
  },
  {
    language: 'cn',
    img: 'cn.png',
    title: 'Chinese',
  },
  {
    language: 'de',
    img: 'de.png',
    title: 'German',
  },
  {
    language: 'kr',
    img: 'kr.png',
    title: 'Korean',
  },
];

export default languages;
