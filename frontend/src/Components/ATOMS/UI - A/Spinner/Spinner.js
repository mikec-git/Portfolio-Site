import React from 'react';
import c from './Spinner.module.scss';

const spinner = () => {
  return (
    <div className={c.Spinner__Wrapper}>
      <div className={c.Spinner}>
        <div className={c.Spinner__Circle}>
          <div className={c.Spinner__Circle_inner}></div>
        </div>
        <div className={c.Spinner__Circle}>
          <div className={c.Spinner__Circle_inner}></div>
        </div>
        <div className={c.Spinner__Circle}>
          <div className={c.Spinner__Circle_inner}></div>
        </div>
        <div className={c.Spinner__Circle}>
          <div className={c.Spinner__Circle_inner}></div>
        </div>
        <div className={c.Spinner__Circle}>
          <div className={c.Spinner__Circle_inner}></div>
        </div>
      </div>
    </div>
  );
}
 
export default spinner;