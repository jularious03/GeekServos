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

// test for CCS811: the first call waits two minutes for warm-up
basic.showString('W');
const eco2 = InnRaum.measureAirQuality(CCS811Measurement.ECO2);
serial.writeValue('eCO2 ppm', eco2);
basic.showNumber(eco2);
