// basic.forever( () => programm());

// function programm () {
//     InnRaum.showMessage();
//     InnRaum.waitMs(1000);
// }

InnRaum.setcolorEyes(NeoPixelColors.Black);


input.onButtonPressed(Button.A, () => {
    InnRaum.setcolorEyes(NeoPixelColors.Blue);
});

input.onButtonPressed(Button.B, () => {
    InnRaum.setcolorFeeler(NeoPixelColors.Green);
});