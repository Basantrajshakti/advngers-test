const hexVal = document.querySelector('.hex');

function getBase() {
  const baseColor = document.getElementById('baseColor').value;
  hexVal.innerText = baseColor;
  return baseColor;
}

getBase();

function copyColorToClipboard(color = null) {
  const baseColor = getBase();
  if (color) navigator.clipboard.writeText(color);
  else navigator.clipboard.writeText(baseColor);
}

function generateComplementaryPalette() {
  const baseColor = getBase();
  const complementaryColor = getComplementaryColor(baseColor);
  displayPalette([baseColor, complementaryColor]);
}

function generateAnalogousPalette() {
  const baseColor = getBase();
  const analogousColors = getAnalogousColors(baseColor, 3);
  displayPalette([baseColor, ...analogousColors]);
}

function generateTriadicPalette() {
  const baseColor = getBase();
  const triadicColors = getTriadicColors(baseColor);
  displayPalette([baseColor, ...triadicColors]);
}

function generateSplitComplementaryPalette() {
  const baseColor = getBase();
  const splitComplementaryColors = getSplitComplementaryColors(baseColor);
  displayPalette([baseColor, ...splitComplementaryColors]);
}

function generateMonochromaticPalette() {
  const baseColor = getBase();
  const monochromaticColors = getMonochromaticColors(baseColor, 4);
  displayPalette(monochromaticColors);
}

function generateTetradicPalette() {
  const baseColor = getBase();
  const tetradicColors = getTetradicColors(baseColor);
  displayPalette([baseColor, ...tetradicColors]);
}

function getComplementaryColor(color) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const compR = 255 - r;
  const compG = 255 - g;
  const compB = 255 - b;
  return `rgb(${compR}, ${compG}, ${compB})`;
}

function getAnalogousColors(color, count) {
  const hsl = hexToHSL(color);
  const hueStep = 360 / (count + 1);
  const analogousColors = [];
  for (let i = 1; i <= count; i++) {
    const hue = (hsl.h + hueStep * i) % 360;
    analogousColors.push(hslToHex({ h: hue, s: hsl.s, l: hsl.l }));
  }
  return analogousColors;
}

function getTriadicColors(color) {
  const hsl = hexToHSL(color);
  const triadicHue1 = (hsl.h + 120) % 360;
  const triadicHue2 = (hsl.h + 240) % 360;
  return [
    hslToHex({ h: triadicHue1, s: hsl.s, l: hsl.l }),
    hslToHex({ h: triadicHue2, s: hsl.s, l: hsl.l }),
  ];
}

function getSplitComplementaryColors(color) {
  const hsl = hexToHSL(color);
  const complementaryHue = (hsl.h + 180) % 360;
  const splitCompHue1 = (complementaryHue + 30) % 360;
  const splitCompHue2 = (complementaryHue + 330) % 360;
  return [
    hslToHex({ h: splitCompHue1, s: hsl.s, l: hsl.l }),
    hslToHex({ h: splitCompHue2, s: hsl.s, l: hsl.l }),
  ];
}

function getMonochromaticColors(color, count) {
  const hsl = hexToHSL(color);
  const monochromaticColors = [];
  const lightnessStep = 100 / (count + 1);
  for (let i = 1; i <= count; i++) {
    const lightness = lightnessStep * i;
    monochromaticColors.push(hslToHex({ h: hsl.h, s: hsl.s, l: lightness }));
  }
  return monochromaticColors;
}

function getTetradicColors(color) {
  const hsl = hexToHSL(color);
  const tetradicHue1 = (hsl.h + 90) % 360;
  const tetradicHue2 = (hsl.h + 180) % 360;
  const tetradicHue3 = (hsl.h + 270) % 360;
  return [
    hslToHex({ h: tetradicHue1, s: hsl.s, l: hsl.l }),
    hslToHex({ h: tetradicHue2, s: hsl.s, l: hsl.l }),
    hslToHex({ h: tetradicHue3, s: hsl.s, l: hsl.l }),
  ];
}

function hexToHSL(hexColor) {
  const r = parseInt(hexColor.slice(1, 3), 16) / 255;
  const g = parseInt(hexColor.slice(3, 5), 16) / 255;
  const b = parseInt(hexColor.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(hslColor) {
  const h = hslColor.h / 360;
  const s = hslColor.s / 100;
  const l = hslColor.l / 100;

  if (s === 0) {
    const grayValue = Math.round(l * 255);
    return `#${grayValue.toString(16).padStart(2, '0').repeat(3)}`;
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const rgb = [hueToRGB(p, q, h + 1 / 3), hueToRGB(p, q, h), hueToRGB(p, q, h - 1 / 3)];

  return `rgb(${Math.round(rgb[0] * 255)}, ${Math.round(rgb[1] * 255)}, ${Math.round(
    rgb[2] * 255,
  )})`;
}

function hueToRGB(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function rgbToHex(rgbColor) {
  const rgbValues = rgbColor.match(/\d+/g);

  const componentToHex = (c) => {
    const hex = parseInt(c, 10).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const hexR = componentToHex(rgbValues[0]);
  const hexG = componentToHex(rgbValues[1]);
  const hexB = componentToHex(rgbValues[2]);

  return `#${hexR}${hexG}${hexB}`;
}

function displayPalette(colors) {
  const colorPalette = document.getElementById('colorPalette');
  colorPalette.innerHTML = '';

  colors.forEach((color) => {
    const colorBox = document.createElement('div');
    colorBox.classList.add('color-box');
    colorBox.style.backgroundColor = color;
    colorBox.style.cursor = 'pointer';
    colorBox.onclick = () => {
      copyColorToClipboard(rgbToHex(color));
    };
    colorPalette.appendChild(colorBox);
  });
}

function savePalette() {
  console.log('save');
}
