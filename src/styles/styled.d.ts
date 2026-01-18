import 'styled-components';
import { lightTheme } from './themes/light';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof lightTheme.colors;
    shadows: typeof lightTheme.shadows;
    spacing: typeof lightTheme.spacing;
    borderRadius: typeof lightTheme.borderRadius;
  }
}