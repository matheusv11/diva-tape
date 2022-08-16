// const tintColorLight = '#2f95dc';
const tintColorLight = '#000';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff', // rgb(242, 242, 242)
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    // BUTTON
    button: 'rgba(0, 0, 0, 0.1)',
    // INPUT
    input: 'rgba(0, 0, 0, 0.1)',
    inputText: '#000'
  },
  dark: {
    text: 'rgb(242, 242, 242)',
    background: '#131213', //rgba(19,18,19,255) // EQUALIZADO COM A COR DO TEMA DARK DO NAVIGATION, PODERIA CRIAR UMA CONSTANTE PRA AMBOS TAMBEMS
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    // BUTTON
    button: '#000',
    // INPUT
    input: 'black',
    inputText: 'rgb(242, 242, 242)'

  },
};
