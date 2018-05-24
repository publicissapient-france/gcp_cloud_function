import {injectGlobal} from 'styled-components';

// MaterialIcons
import MaterialIconsTtf from 'material-design-icons/iconfont/MaterialIcons-Regular.ttf';
import MaterialIconsWoff from 'material-design-icons/iconfont/MaterialIcons-Regular.woff';
import MaterialIconsWoff2 from 'material-design-icons/iconfont/MaterialIcons-Regular.woff2';
// Roboto
import RobotoBlack from '../fonts/Roboto-Black.ttf';
import RobotoBlackItalic from '../fonts/Roboto-BlackItalic.ttf';
import RobotoBold from '../fonts/Roboto-Bold.ttf';
import RobotoBoldItalic from '../fonts/Roboto-BoldItalic.ttf';
import RobotoLight from '../fonts/Roboto-Light.ttf';
import RobotoLightItalic from '../fonts/Roboto-LightItalic.ttf';
import RobotoMedium from '../fonts/Roboto-Medium.ttf';
import RobotoMediumItalic from '../fonts/Roboto-MediumItalic.ttf';
import RobotoRegular from '../fonts/Roboto-Regular.ttf';
import RobotoItalic from '../fonts/Roboto-Italic.ttf';

injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    background-color: transparent;
    color: #000;
    font-family: 'Roboto', 'Helvetica Neue',  'Helvetica', 'Arial', sans-serif;
    font-size: 0.875rem;
  }

  body.fontLoaded {
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  }

  input {
    border: none;
  }

  // primary font
  @font-face {
    font-family: 'Roboto';
    src: url('${RobotoBlack}');
    font-weight: 900;
    font-style: normal;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('${RobotoBlackItalic}');
    font-weight: 900;
    font-style: italic;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('${RobotoBold}');
    font-weight: bold;
    font-style: normal;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('${RobotoBoldItalic}');
    font-weight: bold;
    font-style: italic;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('${RobotoItalic}');
    font-weight: normal;
    font-style: italic;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('${RobotoRegular}');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('${RobotoLight}');
    font-weight: 300;
    font-style: normal;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('${RobotoLightItalic}');
    font-weight: 300;
    font-style: italic;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('${RobotoMedium}');
    font-weight: 500;
    font-style: normal;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('${RobotoMediumItalic}');
    font-weight: 500;
    font-style: italic;
  }

  // material
  @font-face {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: url('${MaterialIconsTtf}');
    url('${MaterialIconsWoff2}') format('woff2'),
    url('${MaterialIconsWoff}') format('woff'),
    url('${MaterialIconsTtf}') format('truetype');
  }

  .material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;  /* Preferred icon size */
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: 'liga';
  }

  #app {
    background-color: transparent;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    line-height: 1.5em;
  }
`;
