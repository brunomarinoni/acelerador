//criar jogo e desenhar ator
/// <reference path="node_modules/excalibur/dist/excalibur.d.ts" />
/// <reference path="node_modules/excalibur/dist/Events.d.ts" />
var game = new ex.Engine({
    width: 800,
    height: 600
});
var textura = new ex.Texture("/Textures/tijolo.png");
var loader = new ex.Loader([textura]);
game.start(loader).then(function () {
    var meuArtista = new ex.Actor(400, 300, 271, 186);
    meuArtista.color = ex.Color.Cyan;
    meuArtista.addDrawing(textura);
    game.add(meuArtista);
    meuArtista.vel.x = 1;
    meuArtista.vel.y = 1;
    meuArtista.on('pointerenter', function () {
        console.log('mouse entrou!');
        if ((Math.floor(Math.random() * 10)) % 2) {
            this.vel.x = -2 * meuArtista.vel.x;
        }
        else {
            this.vel.y = -2 * meuArtista.vel.y;
        }
    });
});
