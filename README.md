# Simple pulse counter

Simple three channel pulse counter using Espruino Pico and SH1106 OLED display.

I developed this for use at work. Glowbuzzer develops software (and hardware) for complex real-time trajectory generation. We also do signal generation for stepper motor drivers, and I needed a way to validate that the correct steps are generated for a three axis cartesian robot - X, Y and Z.

The idea was to use the hardware counters available on the Espruino (STM32F401CD). I found a very useful example for a single channel here: http://www.espruino.com/STM32+Peripherals, and extended this to three channels.

For the display I'm using an SH1106, a very cheap 128x64 mono screen, which can be updated reasonably quickly using software SPI.

For the limited character set ('XYZ' plus 0-9) I used this bitmap font generator, which is a bit fiddly but does the job: http://www.angelcode.com/products/bmfont.

<img src="https://lh3.googleusercontent.com/b3f_fX9SXDC1WkvRYI5_adIGlezd8u8mbum6UB-m0MYSGFnmZYdh34tipWLQSdJTfKjrQqUuv4O7bM7NTIekLadsHk1SjpMb9DuA_XEV1850q4eb00d6FBSzYtV6hj0dglSa-LQ0Y96O4UIg7gOh9Fd6PrOKI3qqVhMvWQRCk4yNFZP1fLjpRCO6bbHBXPVMLM5L5hbvzF4offGM0Mz6AoeDv8QyHtwIhHlMiENSG2-0XmcouscGgf-I5ojj2rLHzLBEYjj2aajP6lILr6jO3xJ6UI9-lTmdqmE5pvwJt9aPRgY3YKt1iGLPxxjIURcuGQHeCJFJlDjX9OGik0UaJ0_QFnWX4XOb9AOjLAAFCw5ujRwvUieKRgrl0HIZixxYDnJlmBMBa9Fp9zirn-4OLiIlA_I8MpwJIhYp2lNRP9SMrPBpE2gnFpQOg9Wz3-a03ISkSH1PgdQAm4128Xo4-_ZL7RkQIXWEMXmxXXj5GQZRfcVq0eLCEtyJ3NDsFcYRyQjqPb4dJWgpDaw6ncDRjRn8MWg_vze9gv4apKglPvszaIm94421M47mRMnPJ-EZuO4vl6LjVbnP3VMndSQMoGdNtZaaas7MXP2C7Q-Zz3t3aIiQ23T6tI0BcTCY7JwHueG-gp71vWpItn-tmXau4vLKRw=w1297-h1289-no" width="200">

<img src="https://lh3.googleusercontent.com/q0qAQwXL4muDUxiYzDHSeRfT7znTfmxWJhNfDCKP7_9SN2sMhbRvz4qbvaLNwDWjd9ZF3aNuD1mq-ZpKHSqpIajalwm0MVq6mGqolXPMsRSBf_mUY4zjPtyiSnwKP4TCt7BX6ki5882mmg1a4yJp2oTQag4XHgL8Khn_tY6mmKk1YsNl6Te9g7uc-oaU5SWa0c0AQQV7_3Lrxlpw-eiBf8PJ8fmxkwL_ytr4ovjO_yzWEvSA0JTp02DYUXv8-SyPf0lCnzQO7ns7aEFgwYxzNACH-b_gveLHlUC6eg-Rl0kBzE7aqjTBSGSYxWnJi6OFMU3do39J8O7EMfjl0msZ8cY7w5Ji7W4QdWqfmAF9O-prPYzZwBDvEnbv1Q8EoIfe3SNaA4y3w2V4oJUt9JEFW06za6TrHjboIrfcNbK_PGC5PNWb1WlWLzZKyYibJDSw6gXT2t3HiMStJSRjVAwz_u9BIAhiMarBgTQFYR4aBi6WT19-7TAEw-U2ymy8tS5qmZjZWfI9iLeFfh2dNFtU3bt_wENlBmuWlYi3DUMnDfSBkSJoBKr7xGS5KOn6VqFt84W1pCGfja5V_A89-Rzkfn_Vg0rpmKzyuwQpvm66F71D9B8MR7yw6_MeqxLKj6N2RBENck0ZEi5jF2AZUFIb_n0euw=w594-h789-no" width="200">

The three pins at the bottom of the board are for X, Y and Z inputs respectively.

The app counts higher than the 16 bit hardware counter by simply tracking the last value read and detecting overflow. This only works if you read the value more frequently than the time taken for it to overflow.

