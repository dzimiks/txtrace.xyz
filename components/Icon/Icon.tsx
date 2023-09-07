import { CSSProperties, MouseEventHandler } from 'react';
import classNames from 'classnames';
import { type IconType } from './Icon.types';
import { iconsMap } from './iconsMap';

import './Icon.scss';

const IconAnimationClassMap = {
  spin: 'Icon--SpinAnimation',
};

type IconProps = {
  icon: IconType;
  animation?: 'spin';
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  style?: CSSProperties;
  id?: string;
};

const Icon = ({ icon, className, animation, style, onClick, id }: IconProps) => {
  if (!icon) {
    return null;
  }

  const IconSVG = iconsMap[icon];

  if (!IconSVG) {
    return null;
  }

  return (
    <i
      className={classNames('Icon', IconAnimationClassMap[animation], className)}
      // eslint-disable-next-line react/forbid-dom-props
      style={style}
      onClick={onClick}
      // eslint-disable-next-line react/forbid-dom-props
      id={id}
    >
      <IconSVG size="1em" />
    </i>
  );
};

export { Icon, type IconType };
