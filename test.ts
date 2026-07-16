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
const eco2 = MintKoepfchen.measureAirQuality(CCS811Measurement.ECO2);
serial.writeValue('eCO2 ppm', eco2);
basic.showNumber(eco2);

// test for DS18B20
const temp = MintKoepfchen.readWaterTemperature(1);
basic.showNumber(temp);

// test for line tracker sensor
basic.forever(() => {
  if (MintKoepfchen.readLineTracker(DigitalPin.P1) == 0) {
    basic.showIcon(IconNames.Yes);
  } else {
    basic.showIcon(IconNames.No);
  }
});
