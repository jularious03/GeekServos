// test for setcolorEyes
input.onButtonPressed(Button.A, () => {
  MintKoepfchen.setcolorEyes(NeoPixelColors.Blue);
});

// test for setcolorFeeler
input.onButtonPressed(Button.B, () => {
  MintKoepfchen.setcolorFeeler(NeoPixelColors.Green);
});

// test for measureDistance
basic.showString('Distance: ');
const distance = MintKoepfchen.measureDistance(DigitalPin.P1, DigitalPin.P2);
basic.showNumber(distance);

// test for measureSoilMoisture
basic.showString('Soil Moisture: ');
const soilMoisture = MintKoepfchen.measureSoilMoisture(AnalogPin.P0);
basic.showNumber(soilMoisture);

// test for CCS811: the first call waits two minutes for warm-up
basic.showString('W');
const eco2 = MintKoepfchen.measureAirQuality(CCS811Measurement.ECO2);
serial.writeValue('eCO2 ppm', eco2);
basic.showNumber(eco2);
