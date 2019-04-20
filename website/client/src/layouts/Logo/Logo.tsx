import * as React from 'react';
import './Logo.less';

// tslint:disable-next-line:no-empty-interface
interface LogoProps {}

const Logo = (_props: LogoProps) => {
  return (
    <div className='logo'>
      {/* <Link to='/main'>
        <img src={'../../../../static/images/techkids.png'} alt='Logo' />
      </Link> */}
      {/* <img src={'../../../../static/images/techkids.png'} alt='Logo' /> */}
    </div>
  );
};

export default Logo;
