// test for setcolorEyes
input.onButtonPressed(Button.A, () => {
  InnRaum.setcolorEyes(NeoPixelColors.Blue);
});

// test for setcolorFeeler
input.onButtonPressed(Button.B, () => {
  InnRaum.setcolorFeeler(NeoPixelColors.Green);
});

// test for measureDistance
basic.showString('Distance: ');
const distance = InnRaum.measureDistance(DigitalPin.P1, DigitalPin.P2);
basic.showNumber(distance);

// test for measureSoilMoisture
basic.showString('Soil Moisture: ');
const soilMoisture = InnRaum.measureSoilMoisture(AnalogPin.P0);
basic.showNumber(soilMoisture);
