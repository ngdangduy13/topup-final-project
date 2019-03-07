import React from 'react';
import { Select } from 'antd';
import './LanguagePicker.less';
// import { I18nextProviderProps } from 'react-i18next/src/I18nextProvider';
// import { Dispatch } from 'redux';
// import {
//   AppSettingsState,
//   languageChange,
//   languageChangeFailed,
//   languageChangeSuccess,
// } from '../../redux/app-settings';
// import { AppState } from '../../redux';
// import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
// import _ from 'lodash';
// import { getI18nService } from '../../service-proxies/service.provider';
// import { message, getErrorMessage } from '../../helpers';
// import languages from '../../constants/language.constant';
// import { ProfileState } from '../../redux/profile';

// tslint:disable-next-line:no-empty-interface
interface NestedLanguagePickerProps {
  // dispatch: Dispatch<any>;
  // appSettings: AppSettingsState;
  // profile: ProfileState;
}

class NestedLanguagePicker extends React.Component<
  NestedLanguagePickerProps,
  any
  > {
  componentDidMount (): void {
    // this.onLanguageChange(this.props.profile.language);
  }

  onLanguageChange = async (language: string) => {
    // this.props.dispatch(languageChange());

    // _.delay(async () => {
    //   if (!this.props.i18n.hasResourceBundle(language, 'translation')) {
    //     const i18nService = getI18nService();
    //     const languageData = await i18nService.getLanguage(language);
    //     this.props.i18n.addResourceBundle(
    //       language,
    //       'translation',
    //       languageData.result,
    //     );
    //   }

    //   this.props.i18n.changeLanguage(language, (err, t) => {
    //     if (err) {
    //       message.error(getErrorMessage(err.message));
    //       this.props.dispatch(languageChangeFailed());
    //       return;
    //     }
    //     this.props.dispatch(languageChangeSuccess(language));
    //   });
    //   // tslint:disable-next-line:align
    // }, 200);
  };

  render (): JSX.Element {
    return (
      <div className='language-picker'>
        <Select
          // value={this.props.appSettings.language}
          onSelect={(value: string, option: any) =>
            this.onLanguageChange(value)
          }
        >
          {/* {languages.map(item => (
            <Select.Option value={item.language} key={item.language}>
              <a style={{ display: 'inline-block', minWidth: 100 }}>
                <span style={{ marginRight: 8 }}>
                  <img
                    src={require(`../../images/${item.img}`)}
                    style={{ display: 'inline-block', paddingBottom: 2 }}
                  />
                </span>
                {item.title}
              </a>
            </Select.Option>
          ))} */}
        </Select>
      </div>
    );
  }
}

// const mapStateToProps = (state: AppState) => {
//   return {
//     appSettings: state.appSettings,
//     profile: state.profile,
//   };
// };

const LanguagePicker = NestedLanguagePicker;

export { LanguagePicker };
