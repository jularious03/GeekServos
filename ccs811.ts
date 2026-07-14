/**
 * Minimal CCS811 driver for Microsoft MakeCode / BBC micro:bit.
 *
 * The initialization and read sequence follows Adafruit_CCS811:
 * SW reset -> hardware ID check -> application start -> 1 second drive mode.
 *
 * The Robotbit I2C connector is the normal micro:bit I2C bus:
 * SCL = P19, SDA = P20, 3.3 V and GND.
 * nWAKE must be low during I2C communication. Many breakout boards already
 * pull nWAKE low. Otherwise connect nWAKE to GND.
 */

enum CCS811Address {
  //% block="0x5A"
  Address0x5A = 0x5a,
  //% block="0x5B"
  Address0x5B = 0x5b,
}

enum CCS811DriveMode {
  //% block="every second"
  EverySecond = 1,
  //% block="every 10 seconds"
  Every10Seconds = 2,
  //% block="every 60 seconds"
  Every60Seconds = 3,
  //% block="every 250 milliseconds"
  Every250Milliseconds = 4,
}

//% color=#2E8B57 icon="\uf0c2" block="CCS811"
namespace CCS811 {
  const STATUS = 0x00;
  const MEAS_MODE = 0x01;
  const ALG_RESULT_DATA = 0x02;
  const ENV_DATA = 0x05;
  const HW_ID = 0x20;
  const ERROR_ID = 0xe0;
  const APP_START = 0xf4;
  const SW_RESET = 0xff;

  const EXPECTED_HW_ID = 0x81;
  const STATUS_ERROR = 0x01;
  const STATUS_DATA_READY = 0x08;
  const STATUS_FW_MODE = 0x80;

  let i2cAddress = CCS811Address.Address0x5A;
  let started = false;
  let co2Value = 0;
  let tvocValue = 0;
  let errorValue = 0;

  function writeCommand(command: number): void {
    const buffer = pins.createBuffer(1);
    buffer[0] = command;
    pins.i2cWriteBuffer(i2cAddress, buffer, false);
  }

  function writeRegister(register: number, value: number): void {
    const buffer = pins.createBuffer(2);
    buffer[0] = register;
    buffer[1] = value;
    pins.i2cWriteBuffer(i2cAddress, buffer, false);
  }

  function writeRegisterBuffer(register: number, data: Buffer): void {
    const buffer = pins.createBuffer(data.length + 1);
    buffer[0] = register;

    for (let index = 0; index < data.length; index++) {
      buffer[index + 1] = data[index];
    }

    pins.i2cWriteBuffer(i2cAddress, buffer, false);
  }

  function readRegisterBuffer(register: number, length: number): Buffer {
    const command = pins.createBuffer(1);
    command[0] = register;

    // Repeated start: keep control of the bus between register selection
    // and the following read, like Wire.write_then_read on the ESP32.
    pins.i2cWriteBuffer(i2cAddress, command, true);
    return pins.i2cReadBuffer(i2cAddress, length, false);
  }

  function readRegister(register: number): number {
    return readRegisterBuffer(register, 1)[0];
  }

  function softwareReset(): void {
    const resetSequence = pins.createBuffer(4);
    resetSequence[0] = 0x11;
    resetSequence[1] = 0xe5;
    resetSequence[2] = 0x72;
    resetSequence[3] = 0x8a;
    writeRegisterBuffer(SW_RESET, resetSequence);
  }

  /**
   * Initialize the CCS811 and start periodic measurements.
   * Returns false if the hardware ID is not 0x81 or application mode fails.
   */
  //% blockId=ccs811_begin
  //% block="initialize CCS811 at %address"
  //% address.defl=CCS811Address.Address0x5A
  //% weight=100
  export function begin(
    address: CCS811Address = CCS811Address.Address0x5A,
  ): boolean {
    i2cAddress = address;
    started = false;
    co2Value = 0;
    tvocValue = 0;
    errorValue = 0;

    // The sensor needs about 20 ms after power-up before accepting I2C.
    basic.pause(100);

    softwareReset();
    basic.pause(100);

    if (readRegister(HW_ID) != EXPECTED_HW_ID) {
      return false;
    }

    // APP_START is a command without a data byte.
    writeCommand(APP_START);
    basic.pause(100);

    const status = readRegister(STATUS);
    if ((status & STATUS_ERROR) != 0 || (status & STATUS_FW_MODE) == 0) {
      errorValue = readRegister(ERROR_ID);
      return false;
    }

    setDriveMode(CCS811DriveMode.EverySecond);
    started = true;
    return true;
  }

  /** Set how often the CCS811 produces a new measurement. */
  //% blockId=ccs811_set_drive_mode
  //% block="set CCS811 measurement interval to %mode"
  //% weight=90
  export function setDriveMode(mode: CCS811DriveMode): void {
    writeRegister(MEAS_MODE, (mode & 0x07) << 4);
  }

  /** Return true when a new eCO2/TVOC measurement can be read. */
  //% blockId=ccs811_data_available
  //% block="CCS811 data available"
  //% weight=80
  export function dataAvailable(): boolean {
    if (!started) {
      return false;
    }

    return (readRegister(STATUS) & STATUS_DATA_READY) != 0;
  }

  /**
   * Read and cache the newest eCO2 and TVOC measurement.
   * Returns true only when fresh, error-free data was read.
   */
  //% blockId=ccs811_read_data
  //% block="read CCS811 data"
  //% weight=70
  export function readData(): boolean {
    if (!dataAvailable()) {
      return false;
    }

    const data = readRegisterBuffer(ALG_RESULT_DATA, 8);
    co2Value = (data[0] << 8) | data[1];
    tvocValue = (data[2] << 8) | data[3];
    errorValue = data[5];

    return (data[4] & STATUS_ERROR) == 0;
  }

  /** Return the last successfully read equivalent CO2 value in ppm. */
  //% blockId=ccs811_eco2
  //% block="CCS811 eCO2 (ppm)"
  //% weight=60
  export function eCO2(): number {
    return co2Value;
  }

  /** Return the last successfully read total VOC value in ppb. */
  //% blockId=ccs811_tvoc
  //% block="CCS811 TVOC (ppb)"
  //% weight=50
  export function TVOC(): number {
    return tvocValue;
  }

  /** Return the last CCS811 error register value. Zero means no error. */
  //% blockId=ccs811_error
  //% block="CCS811 error code"
  //% advanced=true
  //% weight=30
  export function errorCode(): number {
    return errorValue;
  }

  /** Read the hardware ID. A connected CCS811 returns 0x81 (129). */
  //% blockId=ccs811_hardware_id
  //% block="CCS811 hardware ID"
  //% advanced=true
  //% weight=20
  export function hardwareID(): number {
    return readRegister(HW_ID);
  }

  /**
   * Supply humidity and temperature, for example from a BME280, to improve
   * the CCS811 compensation algorithm.
   */
  //% blockId=ccs811_environmental_data
  //% block="set CCS811 relative humidity %humidity and temperature %temperature °C"
  //% humidity.min=0 humidity.max=100 humidity.defl=50
  //% temperature.min=-25 temperature.max=50 temperature.defl=25
  //% advanced=true
  //% weight=40
  export function setEnvironmentalData(
    humidity: number,
    temperature: number,
  ): void {
    humidity = Math.max(0, Math.min(100, humidity));
    temperature = Math.max(-25, Math.min(100, temperature));

    const humidityValue = Math.round(humidity * 512);
    const temperatureValue = Math.round((temperature + 25) * 512);
    const data = pins.createBuffer(4);

    data[0] = (humidityValue >> 8) & 0xff;
    data[1] = humidityValue & 0xff;
    data[2] = (temperatureValue >> 8) & 0xff;
    data[3] = temperatureValue & 0xff;

    writeRegisterBuffer(ENV_DATA, data);
  }
}
