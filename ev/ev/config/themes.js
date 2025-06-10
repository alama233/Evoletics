const colors = {
    white: '#fff',
    black: '#000',
    gray: 'rgba(0, 0, 0, .5)',
    lightWhite: 'rgba(255, 255, 255, .5)',
    blueTintColor: '#0281ff',
    lightPink: '#F7B5CD'
  };
  
  const fonts = {
    ultraLightFont: 'Geist-Ultralight',
    thinFont: 'Geist-Thin',
    regularFont: 'Geist-Regular',
    lightFont: 'Geist-Light',
    mediumFont: 'Geist-Medium',
    semiBoldFont: 'Geist-SemiBold',
    boldFont: 'Geist-Bold',
    blackFont: 'Geist-Black',
    ultraBlackFont: 'Geist-Ultrablack',
  };
  
  export const lightTheme = {
    ...fonts,
    name: 'Light',
    label: 'light',
    textColor: colors.black,
    secondaryTextColor: colors.white,
    mutedForegroundColor: colors.gray,
    backgroundColor: colors.white,
    placeholderTextColor: colors.gray,
    secondaryBackgroundColor: colors.black,
    borderColor: 'rgba(0, 0, 0, .15)',
    tintColor: '#0281ff',
    tintTextColor: colors.white,
    tabBarActiveTintColor: colors.black,
    tabBarInactiveTintColor: colors.gray,
  };
  
  export const darkTheme = {
    ...fonts,
    name: 'Dark',
    label: 'dark',
    textColor: colors.white,
    secondaryTextColor: colors.black,
    mutedForegroundColor: colors.lightWhite,
    backgroundColor: colors.black,
    placeholderTextColor: colors.lightWhite,
    secondaryBackgroundColor: colors.white,
    borderColor: 'rgba(255, 255, 255, .2)',
    tintColor: '#0281ff',
    tintTextColor: colors.white,
    tabBarActiveTintColor: colors.blueTintColor,
    tabBarInactiveTintColor: colors.lightWhite,
  };
  
  export const hackerNews = {
    ...lightTheme,
    name: 'Hacker News',
    label: 'hackerNews',
    backgroundColor: '#e4e4e4',
    tintColor: '#ed702d',
  };
  
  export const miami = {
    ...darkTheme,
    name: 'Miami',
    label: 'miami',
    backgroundColor: '#231F20',
    tintColor: colors.lightPink,
    tintTextColor: '#231F20',
    tabBarActiveTintColor: colors.lightPink
  };
  
  export const vercel = {
    ...darkTheme,
    name: 'Vercel',
    label: 'vercel',
    backgroundColor: colors.black,
    tintColor: '#171717',
    tintTextColor: colors.white,
    tabBarActiveTintColor: colors.white,
    secondaryTextColor: colors.white,
  };
  
  export const christmas = {
    ...lightTheme,
    name: 'Christmas',
    label: 'christmas',
    tintColor: '#ff0000',
    textColor: '#378b29',
    tabBarActiveTintColor: '#378b29',
    tabBarInactiveTintColor: '#ff0000',
    placeholderTextColor: '#378b29',
  }; 