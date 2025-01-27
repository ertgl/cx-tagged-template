import LOGO_URL from "../../assets/logo.svg";

import { cmx } from "./Logo.cmx";
import { LOGO_DEFAULT_ALT } from "./Logo.constants";

/**
 * @typedef { (
 *   & React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
 *   & { reverse?: boolean }
 * ) } LogoProps
 */

/**
 * @param {LogoProps} props
 * @returns {React.JSX.Element}
 */
export function Logo(
  props,
)
{
  const {
    alt = LOGO_DEFAULT_ALT,
    className = "",
    reverse = false,
    src = LOGO_URL,
    ...rest
  } = props;

  return (
    <img
      alt={alt}
      className={cmx`
        logo
        logo--reversed invert-1 ${reverse}
        ${className}
      `}
      src={src}
      {...rest}
    />
  );
}
