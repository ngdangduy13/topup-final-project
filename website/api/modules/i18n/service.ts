import { IGetLanguage, IGetLanguageResult } from "./interface";
import en from './languages/en';
import vi from './languages/vi';

const getLanguage = async (query: IGetLanguage): Promise<IGetLanguageResult> => {
    if (!query) {
      throw new Error('Language Not Found');
    } else {
        return { result: query.lng === 'vi' ? vi : en };
    }
  };

  export default { 
      getLanguage
  }

