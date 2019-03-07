import * as React from 'react';
import './SmallLogo.less';

// tslint:disable-next-line:no-empty-interface
interface SmallLogoProps {}

const SmallLogo = (_props: SmallLogoProps) => {
  return (
    <div className='small-logo'>
      {/* <Link to='/main'>
        <img src={require('../../../images/small-logo.png')} alt='Small Logo' />
      </Link> */}
      <img src={'../../../../static/images/small-logo.png'} alt='Small Logo' />
    </div>
  );
};

export default SmallLogo;
