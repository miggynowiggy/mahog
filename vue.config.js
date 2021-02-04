module.exports = {
	transpileDependencies: ["vuetify"],
	pwa: {
      name: 'Mahog',
      themeColor: '#C0AD74',
      msTileColor: '#C0AD74',
      iconPath: {
        favicon32: 'img/icons/favicon-32x32.png',
        favicon16: 'img/icons/favicon-16x16.png',
        appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
        msTileImage: 'img/icons/ms-icon-144x144.png'
      },
      manifestOptions: {
        background_color: '#C0AD74'
      }
    },
};
