# Simple pulse counter

Simple three channel pulse counter using Espruino Pico and SH1106 OLED display.

I developed this for use at work. Glowbuzzer develops software (and hardware) for complex real-time trajectory generation. We also do signal generation for stepper motor drivers, and I needed a way to validate that the correct steps are generated for a three axis cartesian robot - X, Y and Z.

The idea was to use the hardware counters available on the Espruino (STM32F401CD). I found a very useful example for a single channel here: http://www.espruino.com/STM32+Peripherals, and extended this to three channels.

For the display I'm using an SH1106, a very cheap 128x64 mono screen, which can be updated reasonably quickly using software SPI.

For the limited character set ('XYZ' plus 0-9) I used this bitmap font generator, which is a bit fiddly but does the job: http://www.angelcode.com/products/bmfont. Then I used the handy Espruino bitmap converter to turn each character into Javascript: https://www.espruino.com/Image+Converter.

<img src="https://github.com/jugglingcats/pulse-counter/blob/master/pulse-counter-pic.jpg?raw=true" width="200">

<img src="https://github.com/jugglingcats/pulse-counter/blob/master/pulse-counter_bb.png?raw=true" width="200">

The three pins at the bottom of the board are for X, Y and Z inputs respectively.

The app counts higher than the 16 bit hardware counter by simply tracking the last value read and detecting overflow. This only works if you read the value more frequently than the time taken for it to overflow.

