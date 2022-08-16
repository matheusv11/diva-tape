/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView, TextInput as DefaultTextInput, TouchableOpacity as DefaultTouchableOpacity } from 'react-native';
import { FontAwesome as DefaultFontAwesome } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type InputProps = ThemeProps & DefaultTextInput['props'];
export type ButtonProps = ThemeProps & DefaultTouchableOpacity['props'];
export type IconProps = ThemeProps & DefaultFontAwesome['props']
export type RadioButtonProps = ThemeProps & { selected: boolean, label: string, style?: DefaultView['props']['style'] }

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Input(props: InputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'input');
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'inputText'); // TODO AUTO, LOGO NÃO HÁ PROPS PRA MUDAR ISSO

  return <DefaultTextInput placeholderTextColor={ color } style={[{ backgroundColor, color }, style]} {...otherProps} />;
}

export function Button(props: ButtonProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'button');

  return <DefaultTouchableOpacity style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Icon(props: IconProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  // <DefaultFontAwesome color={ color } style={[{ marginBottom: -3 }, style]} {...otherProps} />
  return <DefaultFontAwesome style={[{ color }, style]} {...otherProps} />;
}

export function RadioButton(props: RadioButtonProps) {
  const { lightColor, darkColor, selected, style, label } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <DefaultView style={[{ flexDirection: 'row' }, style]}>
      <DefaultView style={{
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {
          selected ? <DefaultView style={{
            height: 12,
            width: 12,
            borderRadius: 6,
            backgroundColor: backgroundColor,
          }}/> : null
        }
      </DefaultView>

      <Text style={{
        fontWeight: 'bold',
        left: 6,
        minWidth: 100,
        maxWidth: 150
      }}> {label} </Text>

    </DefaultView>
  );
}