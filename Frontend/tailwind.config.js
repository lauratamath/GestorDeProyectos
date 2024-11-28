module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], 
      },
      backgroundImage: {
        'login-background': 'linear-gradient(66.96deg, #F2C2CF 0.24%, #FFD783 94.79%)',
      },
      borderRadius: {
        'custom': '50px 0 50px 0',
      },
      colors:{
        'c-Blue': '#2B4D6C',
        'c-Pink': '#F2C2CC',
        'c-Orange': '#F29057',
        'c-Orange2': '#FF7B2E',
        'c-Grey': '#f3f3f3',
        'c-error': '#A24006',
        'c-success': '#27b54a',
      },
      spacing: {
        'loginImg-H': '6.5625em', // Height of login image 
        'whiteBox-W': '53.875em', //Width of login white box
        'whiteBox-H': '39.125em', //Height of login white box
        'logoDash-H': '12.125em',
      },
      boxShadow: {
        'custom': '0px 7px 41px 0px rgba(0, 0, 0, 0.25)', // #00000040 en formato rgba
        'inputLogin' : '0px 4px 4px 0px rgba(216, 174, 126, 0.25)',
      },
      /* fontSize: {
        'xs' : '12px',
      } */
    },
  },
  plugins: [require("daisyui")],
  
};
