(function(){
var titleScreen = new Audio('audio/loadingScreen.mp3');
var portalEntering = new Audio('audio/portal.mp3');
var spawnSound = new Audio('audio/spawn.mp3');
var bounceSound = new Audio('audio/bounce.mp3');
var deathSound = new Audio('audio/deathFx.wav');
var ejectSound = new Audio('audio/hole.mp3');
var specialSpawn = new Audio('audio/specialSpawn.mp3');
var secondThump = new Audio('audio/theSecondThump.mp3');
var errorSound = new Audio('audio/error.mp3');
var tvStatic = new Audio('audio/tvstatic.mp3');
var teleportSound = new Audio('audio/teleport.mp3');

var levelHeader = document.getElementById("level-counter");
var deathCounter = document.getElementById("deaths");
var deaths = 0;

var colorSelector = document.getElementById("color-select");
colorSelector.disabled = true;

setInterval(() => {
  deathCounter.textContent = "Deaths: " + deaths;
});

titleScreen.volume = 0.15;

$(body).bind('contextmenu', function(e) {
  return false;
});

window.addEventListener("keydown", e => {
  if (e.keyCode == 32 && e.target == document.body){
    e.preventDefault();
  }
});

var engine = Matter.Engine.create({
  bounds: {
    min: {x: 0, y: 0},
    max: {x: 800, y: 600}
  }
});

var render = Matter.Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false
  }
});

//executor

preMenu();

//

function preMenu(){
  levelHeader.textContent = ">Corcle Setup<";

  var mouse = Matter.Mouse.create(render.canvas);
  var mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      render: {
        visible: false
      }
    }
  });
  render.mouse = mouse;  

  var button = Matter.Bodies.rectangle(400, 300, 800, 600, {
    isStatic: true,
    render: {
      sprite: {
        texture: 'images/click.png'
      }
    }
  });

  Matter.World.add(engine.world, button);

  Matter.Engine.run(engine);
  Matter.Render.run(render);

  var listener = setInterval(() => {
    if (mouseConstraint.body == button){
      startGame();
      colorSelector.disabled = false;
      colorSelector.style.cursor = "pointer";
      Matter.World.remove(engine.world, button);
      Matter.Composite.remove(engine.world, button);
      clearInterval(listener);
    }
  });
}

function startGame(){



var bodies = [];

var player = Matter.Bodies.circle(400, 190, 20, {
  restitution: 0.3,
  airFriction: 0.15,
  render: {
    fillStyle: 'transparent',
    strokeStyle: 'white',
    lineWidth: 2
  }
});
bodies.push(player);
Matter.Body.setVelocity(player, {x: 0, y: 0});

colorSelector.onchange = function(){
  player.render.strokeStyle = colorSelector.value;
}

Matter.Events.on(engine, 'collisionStart', event => {
  var pairs = event.pairs;
  if (pairs[0].bodyA == player){
    bounceSound.play();
  }
});

var floor = Matter.Bodies.rectangle(400, 600, 810, 60, {
  isStatic: true,
  render: {
    fillStyle: 'transparent',
    strokeStyle: 'white',
    lineWidth: 2
  }
});
var leftWall = Matter.Bodies.rectangle(0, 270, 50, 600, {
  isStatic: true,
  render: {
    fillStyle: 'transparent',
    strokeStyle: 'white',
    lineWidth: 2
  }
});
var rightWall = Matter.Bodies.rectangle(800, 270, 50, 600, {
  isStatic: true,
  render: {
    fillStyle: 'transparent',
    strokeStyle: 'white',
    lineWidth: 2
  }
});

bodies.push(floor);
bodies.push(leftWall);
bodies.push(rightWall);
Matter.World.add(engine.world, bodies);

var keyPress = {};

function setForce(xForce, yForce){
   Matter.Body.applyForce(player, {x: player.position.x, y: player.position.y},  {x: xForce, y: yForce});
}

window.addEventListener("keydown", function(e){
  keyPress[e.keyCode || e.which] = true;
});

window.addEventListener("keyup", function(e){
  keyPress[e.keyCode || e.which] = false;
  if (e.which === 32 || e.keyCode === 32){
     setForce(0, -0.023);
  }
  if (e.which === 38 || e.keyCode === 38){
    setForce(0, -0.023);
  }
});


setInterval(() => {
  if (keyPress[65]){
    setForce(-0.0007, 0);
  }

  if (keyPress[68]){
    setForce(0.0007, 0);
  }

  if (keyPress[37]){
    setForce(-0.0007, 0);
  }

  if (keyPress[39]){
    setForce(0.0007, 0);
  }
});

//level executor

mainMenu();

//

function mainMenu(){
  levelHeader.textContent = ">Main Menu<";
  titleScreen.loop = true;
  titleScreen.play();

  var tempBodies = [];
  var colors = ["#E3242B", "orange", "yellow", "rgb(0, 255, 0)", "#0288d1", "#6A0DAD"];

  var spawnPlate = Matter.Bodies.rectangle(400, 300, 200, 20, {
    isStatic: true,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'white',
      lineWidth: 2
    }
  });
  var roof = Matter.Bodies.rectangle(400, 10, 750, 20, {
    isStatic: true,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'white',
      lineWidth: 2
    }
  });
  tempBodies.push(Matter.Bodies.rectangle(400, 140, 20, 20, {
    isStatic: true,
    collisionFilter: {
      'group': -1,
      'category': 2,
      'mask': 0
    },
    render: {
      sprite: {
        texture: 'images/corcle.png'
      }
    }
  }));
  tempBodies.push(Matter.Bodies.rectangle(400, 480, 20, 20, {
    isStatic: true,
    collisionFilter: {
      'group': -1,
      'category': 2,
      'mask': 0
    },
    render: {
      sprite: {
        texture: 'images/enter.png'
      }
    }
  }));

  var leftSpin1 = Matter.Bodies.rectangle(120, 80, 150, 20, {
    isStatic: true,
    rotationSpeed: -0.2,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'white',
      lineWidth: 2
    }
  });

  var leftSpin2 = Matter.Bodies.rectangle(120, 200, 150, 20, {
    isStatic: true,
    rotationSpeed: 0.2,
    render: {
      fillStyle: 'white',
      strokeStyle: 'transparent',
      lineWidth: 2
    }
  });

  var leftSpin3 = Matter.Bodies.rectangle(120, 320, 150, 20, {
    isStatic: true,
    rotationSpeed: -0.2,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'white',
      lineWidth: 2
    }
  });

  var leftSpin4 = Matter.Bodies.rectangle(120, 440, 150, 20, {
    isStatic: true,
    rotationSpeed: 0.2,
    render: {
      fillStyle: 'white',
      strokeStyle: 'transparent',
      lineWidth: 2
    }
  });

  var rightSpin1 = Matter.Bodies.rectangle(680, 80, 150, 20, {
    isStatic: true,
    rotationSpeed: 0.2,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'white',
      lineWidth: 2
    }
  });

  var rightSpin2 = Matter.Bodies.rectangle(680, 200, 150, 20, {
    isStatic: true,
    rotationSpeed: -0.2,
    render: {
      fillStyle: 'white',
      strokeStyle: 'transparent',
      lineWidth: 2
    }
  });

  var rightSpin3 = Matter.Bodies.rectangle(680, 320, 150, 20, {
    isStatic: true,
    rotationSpeed: 0.2,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'white',
      lineWidth: 2
    }
  });

  var rightSpin4 = Matter.Bodies.rectangle(680, 440, 150, 20, {
    isStatic: true,
    rotationSpeed: -0.2,
    render: {
      fillStyle: 'white',
      strokeStyle: 'transparent',
      lineWidth: 2
    }
  });

  var portal = Matter.Bodies.rectangle(400, 550, 747, 40, {
    isStatic: true,
    render: {
      fillStyle: 'white',
      strokeStyle: 'white',
      lineWidth: 2
    }
  });


  tempBodies.push(leftSpin1);
  tempBodies.push(leftSpin2);
  tempBodies.push(leftSpin3);
  tempBodies.push(leftSpin4);
  tempBodies.push(rightSpin1);
  tempBodies.push(rightSpin2);
  tempBodies.push(rightSpin3);
  tempBodies.push(rightSpin4);

  function animateSpinners(){
    Matter.Body.setAngle(leftSpin1, leftSpin1.angle + leftSpin1.rotationSpeed);
    Matter.Body.setAngle(leftSpin2, leftSpin2.angle + leftSpin2.rotationSpeed);
    Matter.Body.setAngle(leftSpin3, leftSpin3.angle + leftSpin3.rotationSpeed);
    Matter.Body.setAngle(leftSpin4, leftSpin4.angle + leftSpin4.rotationSpeed);
    Matter.Body.setAngle(rightSpin1, rightSpin1.angle + rightSpin1.rotationSpeed);
    Matter.Body.setAngle(rightSpin2, rightSpin2.angle + rightSpin2.rotationSpeed);
    Matter.Body.setAngle(rightSpin3, rightSpin3.angle + rightSpin3.rotationSpeed);
    Matter.Body.setAngle(rightSpin4, rightSpin4.angle + rightSpin4.rotationSpeed);
    requestAnimationFrame(animateSpinners);
  }

  function animatePortalFade(){
    portal.render.opacity -= 0.01;
    if (portal.render.opacity <= 0.25){
      portal.render.opacity = 0.025;
      requestAnimationFrame(animatePortalShow);
      return;
    }
    requestAnimationFrame(animatePortalFade);
  }
  
  function animatePortalShow(){
    portal.render.opacity += 0.01;
    if (portal.render.opacity >= 1){
      portal.render.opacity = 1;
      requestAnimationFrame(animatePortalFade);
      return;
    }
    requestAnimationFrame(animatePortalShow);
  }

  window.requestAnimationFrame(animatePortalFade);
  window.requestAnimationFrame(animateSpinners);

  function fadeOutBodies(){
    for (var i = 0; i < tempBodies; i++){
      tempBodies[i].render.opacity -= 0.007;
    }
    roof.render.opacity -= 0.007;
    portal.render.opacity -= 0.007;

    if (roof.render.opacity <= 0){
      for (var i = 0; i < tempBodies.length; i++){
        tempBodies[i].render.opacity = 0;
        Matter.World.remove(engine.world, tempBodies[i]);
        Matter.Composite.remove(engine.world, tempBodies[i]);
      }
      roof.render.opacity = 0;
      Matter.World.remove(engine.world, roof);
      Matter.Composite.remove(engine.world, roof);
      portal.render.opacity = 0;
      Matter.World.remove(engine.world, portal);
      Matter.Composite.remove(engine.world, portal);
      spawnPlate.render.opacity = 0;
      Matter.World.remove(engine.world, spawnPlate);
      Matter.Composite.remove(engine.world, spawnPlate);
      setTimeout(() => {
        stage1();
      }, 1300);
      return;
    }
    requestAnimationFrame(fadeOutBodies);
  }

  var spawnPlateColor = setInterval(() => {
    var currentColor = colors[Math.floor(Math.random() * colors.length)];
    spawnPlate.render.strokeStyle = currentColor;
    portal.render.strokeStyle = currentColor;
    portal.render.fillStyle = currentColor;
  }, 1450);

  Matter.Events.on(engine, 'collisionStart', event => {
    var pairs = event.pairs;
    var volume = 0.15;
    if (pairs[0].bodyA == player && pairs[0].bodyB == portal){
      portalEntering.play();
      Matter.Body.setPosition(player, {x: 3000, y: 3000});
      portal.render.opacity = 1;
      window.requestAnimationFrame(fadeOutBodies);
      var fadeout = setInterval(() => {
        volume -= 0.007;
        if (volume <= 0){
          titleScreen.volume = 0;
          window.cancelAnimationFrame(animatePortalFade);
          window.cancelAnimationFrame(animatePortalShow);
          clearInterval(fadeout);
          clearInterval(spawnPlateColor);
          return;
        }
        titleScreen.volume = volume;
      }, 200);
    }
  });

  Matter.World.add(engine.world, tempBodies);
  Matter.World.add(engine.world, roof);
  Matter.World.add(engine.world, portal);
  Matter.World.add(engine.world, spawnPlate);

}

function stage1(){

  levelHeader.textContent = ">Level One<";

  spawnSound.play();

  var tempBodies = [];

  function addNormalBodyStatic(x, y, width, height){
    tempBodies.push(Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'white',
        lineWidth: 2
      }
    }));
  }

  Matter.Body.setPosition(player, {x: 70, y: 505});
  Matter.Body.setVelocity(player, {x: 0, y: 0});

  addNormalBodyStatic(375, 480, 700, 40);
  addNormalBodyStatic(425, 385, 700, 40);
  addNormalBodyStatic(375, 290, 700, 40);
  addNormalBodyStatic(425, 195, 700, 40);
  addNormalBodyStatic(375, 100, 700, 40);
  addNormalBodyStatic(425, 20, 700, 40);
  tempBodies.push(Matter.Bodies.rectangle(400, 535, 50, 50, {
    isStatic: true,
    collisionFilter: {
      'group': -1,
      'category': 2,
      'mask': 0
    },
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'white',
      lineWidth: 2,
      sprite: {
        texture: 'images/welcome.png'
      }
    }
  }));

  Matter.World.add(engine.world, tempBodies);

  var firstLevelFinish = setInterval(() => {
    if (player.position.y <= 0){
      spawnSound.play();

      for (var i = 0; i < tempBodies.length; i++){
        Matter.World.remove(engine.world, tempBodies[i]);
        Matter.Composite.remove(engine.world, tempBodies[i]);
      }

      stage2();
      clearInterval(firstLevelFinish);
    }
  });
}

function stage2(){

  levelHeader.textContent = ">Level Two<";

  var tempBodies = [];
  var lavaBodies = [];

  function addNormalBodyStatic(x, y, width, height){
    tempBodies.push(Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'white',
        lineWidth: 2
      }
    }));
  }

  function addLavaBodyStatic(x, y, width, height){
    lavaBodies.push(Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'red',
        lineWidth: 2
      }
    }));
  }

  Matter.Body.setPosition(player, {x: 401, y: 240});
  Matter.Body.setVelocity(player, {x: 0, y: 0});

  Matter.Events.on(engine, 'collisionStart', event =>{
    var pairs = event.pairs;
    for (var i = 0; i < lavaBodies.length; i++){
      if (lavaBodies[i] == pairs[0].bodyB){
        Matter.Body.setPosition(player, {x: 401, y: 240});
        Matter.Body.setVelocity(player, {x: 0, y: 0});
        deaths++;
        deathSound.play();
        break;
      }
    }
  });

  addNormalBodyStatic(400, 205, 240, 37);
  addNormalBodyStatic(400, 300, 240, 37);
  addNormalBodyStatic(200, 230, 50, 450);
  addNormalBodyStatic(600, 230, 50, 450);
  addNormalBodyStatic(400, 100, 350, 150);
  addLavaBodyStatic(400, 548, 745, 35);
  tempBodies.push(Matter.Bodies.rectangle(400, 100, 50, 50, {
    isStatic: true,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'white',
      lineWidth: 2,
      sprite: {
        texture: 'images/dketext.png'
      }
    }
  }));
  tempBodies.push(Matter.Bodies.rectangle(100, 290, 50, 50, {
    isStatic: true,
    collisionFilter: {
      'group': -1,
      'category': 2,
      'mask': 0
    },
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'white',
      lineWidth: 2,
      sprite: {
        texture: 'images/up.png'
      }
    }
  }));
  tempBodies.push(Matter.Bodies.rectangle(700, 290, 50, 50, {
    isStatic: true,
    collisionFilter: {
      'group': -1,
      'category': 2,
      'mask': 0
    },
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'white',
      lineWidth: 2,
      sprite: {
        texture: 'images/up.png'
      }
    }
  }));
  var bottomLeftSquare = Matter.Bodies.rectangle(100, 400, 40, 40, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'white',
        lineWidth: 2
      }
    });
  var topLeftSquare = Matter.Bodies.rectangle(100, 170, 40, 40, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'white',
        lineWidth: 2
      }
    });
  var bottomRightSquare = Matter.Bodies.rectangle(700, 400, 40, 40, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'white',
        lineWidth: 2
      }
    });
  var topRightSquare = Matter.Bodies.rectangle(700, 170, 40, 40, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'white',
        lineWidth: 2
      }
    });
  Matter.Body.setAngle(bottomLeftSquare, 10);
  Matter.Body.setAngle(topLeftSquare, 15);
  Matter.Body.setAngle(bottomRightSquare, 18);
  Matter.Body.setAngle(topRightSquare, 20);
  tempBodies.push(topRightSquare);
  tempBodies.push(bottomRightSquare);
  tempBodies.push(topLeftSquare);
  tempBodies.push(bottomLeftSquare);

  Matter.World.add(engine.world, tempBodies);
  Matter.World.add(engine.world, lavaBodies);

  var secondLevelFinish = setInterval(() => {
    if (player.position.y <= 0){
      spawnSound.play();

      for (var i = 0; i < tempBodies.length; i++){
        Matter.World.remove(engine.world, tempBodies[i]);
        Matter.Composite.remove(engine.world, tempBodies[i]);
      }

      for (var i = 0; i < lavaBodies.length; i++){
        Matter.World.remove(engine.world, lavaBodies[i]);
        Matter.Composite.remove(engine.world, lavaBodies[i]);
      }

      stage3();
      clearInterval(secondLevelFinish);
    }
  });
}

function stage3(){

  levelHeader.textContent = ">Level Three<";

  var tempBodies = [];
  var lavaBodies = [];

  function addNormalBodyStatic(x, y, width, height){
    tempBodies.push(Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'white',
        lineWidth: 2
      }
    }));
  }

  function addLavaBodyStatic(x, y, width, height){
    lavaBodies.push(Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'red',
        lineWidth: 2
      }
    }));
  }

  addNormalBodyStatic(350, 15, 650, 30);
  addNormalBodyStatic(395, 266, 560, 370);
  addNormalBodyStatic(427, 55, 495, 50);
  addLavaBodyStatic(400, 550, 745, 35);
  addLavaBodyStatic(758, 200, 30, 400);
  var spinner = Matter.Bodies.rectangle(210, 525, 300, 20, {
    isStatic: true,
    inertia: Infinity,
    rotationSpeed: -0.0135,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'white',
      lineWidth: 2
    }
  });
  tempBodies.push(spinner);
  tempBodies.push(Matter.Bodies.rectangle(395, 266, 10, 10, {
    isStatic: true,
    render: {
      fillStyle: 'transparent',
      sprite: {
        texture: 'images/toEZ.png'
      }
    }
  }));

  function updateSpinner(){
    Matter.Body.setAngle(spinner, spinner.angle + spinner.rotationSpeed);
    requestAnimationFrame(updateSpinner);
  }
  window.requestAnimationFrame(updateSpinner);


  Matter.Body.setPosition(player, {x: 159, y: 55});
  Matter.Body.setVelocity(player, {x: 0, y: 0});

  Matter.World.add(engine.world, tempBodies);
  Matter.World.add(engine.world, lavaBodies);

  Matter.Events.on(engine, 'collisionStart', event => {
    var pairs = event.pairs;
    for (var i = 0; i < lavaBodies.length; i++){
      if (lavaBodies[i] == pairs[0].bodyB){
        Matter.Body.setPosition(player, {x: 159, y: 55});
        Matter.Body.setVelocity(player, {x: 0, y: 0});
        deaths++;
        deathSound.play();
      }
    }
  });

  var thirdLevelFinish = setInterval(() => {
    if (player.position.y <= 0){
      spawnSound.play();

      for (var i = 0; i < tempBodies.length; i++){
        Matter.World.remove(engine.world, tempBodies[i]);
        Matter.Composite.remove(engine.world, tempBodies[i]);
      }

      for (var i = 0; i < lavaBodies.length; i++){
        Matter.World.remove(engine.world, lavaBodies[i]);
        Matter.Composite. remove(engine.world, lavaBodies[i]);
      }

      stage4();
      clearInterval(thirdLevelFinish);
    }
  });
}

function stage4(){

  levelHeader.textContent = ">Level Four<";

  var tempBodies = [];
  var lavaBodies = [];
  var ejectorBodiesX = [];

  function addNormalBodyStatic(x, y, width, height){
    tempBodies.push(Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'white',
        lineWidth: 2
      }
    }));
  }

  function addLavaBodyStatic(x, y, width, height){
    lavaBodies.push(Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'red',
        lineWidth: 2
      }
    }));
  }

  function addEjectorBodyStaticX(x, y, width, height){
    ejectorBodiesX.push(Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'orange',
        lineWidth: 2
      }
    }));
  }

  addEjectorBodyStaticX(760, 360, 25, 100);
  addNormalBodyStatic(695, 553, 100, 25);
  addNormalBodyStatic(760, 490, 25, 160);
  addNormalBodyStatic(254, 490, 160, 150);
  addLavaBodyStatic(490, 475, 310, 185);
  addLavaBodyStatic(556, 156, 440, 310);

  tempBodies.push(Matter.Bodies.rectangle(556, 156, 20, 20, {
    isStatic: true,
    render: {
      fillStyle: 'transparent',
      sprite: {
        texture: 'images/puregenius.png'
      }
    }
  }));

  tempBodies.push(Matter.Bodies.rectangle(490, 474, 20, 20, {
    isStatic: true,
    render: {
      fillStyle: 'transparent',
      sprite: {
        texture: 'images/incontrol.png'
      }
    }
  }));

  var spinner = Matter.Bodies.rectangle(215, 215, 200, 20, {
    isStatic: true,
    inertia: Infinity,
    rotationSpeed: 0.025,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'red',
      lineWidth: 2
    }
  });

  var spinner2 = Matter.Bodies.rectangle(145, 60, 200, 20, {
    isStatic: true,
    inertia: Infinity,
    rotationSpeed: -0.025,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'red',
      lineWidth: 2
    }
  });
  
  lavaBodies.push(spinner);
  lavaBodies.push(spinner2);

  function updateSpinner(){
    Matter.Body.setAngle(spinner, spinner.angle + spinner.rotationSpeed);
    Matter.Body.setAngle(spinner2, spinner2.angle + spinner2.rotationSpeed);
    requestAnimationFrame(updateSpinner);
  }

  window.requestAnimationFrame(updateSpinner);

  Matter.Body.setPosition(player, {x: 695, y: 500});
  Matter.Body.setVelocity(player, {x: 0, y: 0});


  Matter.Events.on(engine, 'collisionStart', event => {
    var pairs = event.pairs;
    for (var i = 0; i < lavaBodies.length; i++){
      if (lavaBodies[i] == pairs[0].bodyB){
        Matter.Body.setPosition(player, {x: 695, y: 500});
        Matter.Body.setVelocity(player, {x: 0, y: 0});
        deaths++;
        deathSound.play();
      }
    }
  });

  Matter.Events.on(engine, 'collisionStart', event => {
    var pairs = event.pairs;
    for (var i = 0; i < ejectorBodiesX.length; i++){
      if (ejectorBodiesX[i] == pairs[0].bodyB){
        ejectSound.play();
        if (Math.sign(player.force.x) == -1){
          const pusher = setInterval(() => {
            Matter.Body.applyForce(player, {x: player.position.x, y: player.position.y}, {x: 0.01, y: 0});
          });
          setTimeout(() => {
            clearInterval(pusher);
          }, 50);
        } else if (Math.sign(player.force.x) == 1){
          const pusher = setInterval(() => {
            Matter.Body.applyForce(player, {x: player.position.x, y: player.position.y}, {x: -0.01, y: 0});
          });
          setTimeout(() => {
            clearInterval(pusher);
          }, 50);
        }
        break;
      }
    }
  });

  Matter.World.add(engine.world, tempBodies);
  Matter.World.add(engine.world, lavaBodies);
  Matter.World.add(engine.world, ejectorBodiesX);


  var fourthLevelFinish = setInterval(() => {
    if (player.position.y <= 0){
      specialSpawn.play();
      
      for (var i = 0; i < tempBodies.length; i++){
        Matter.World.remove(engine.world, tempBodies[i]);
        Matter.Composite.remove(engine.world, tempBodies[i]);
      }

      for (var i = 0; i < lavaBodies.length; i++){
        Matter.World.remove(engine.world, lavaBodies[i]);
        Matter.Composite.remove(engine.world, lavaBodies[i]);
      }
      
      for (var i = 0; i < ejectorBodiesX.length; i++){
        Matter.World.remove(engine.world, ejectorBodiesX[i]);
        Matter.Composite.remove(engine.world, ejectorBodiesX[i]);
      }

      stage5Intro();
      clearInterval(fourthLevelFinish);
    }
  });
}

function stage5Intro(){

  var glitchedText = ["@&!*@#", "*@!&#*&@", "^&@!#^@#*", "^!@&#^!@!#*&", "^&!*@#^@!", "0101010011", "Error: Syntax !(@#&"];

  var intervalOne = setInterval(() => {
    levelHeader.textContent = ">" + glitchedText[Math.floor(Math.random() * glitchedText.length)] + "<";
  });

  Matter.Body.setPosition(player, {x: 3000, y: 3000});

  var text = Matter.Bodies.rectangle(400, 273, 20, 20, {
    isStatic: true,
    render: {
      fillStyle: 'transparent',
      sprite: {
        texture: 'images/thinkoutsidethebox.png'
      }
    }
  });
  Matter.World.add(engine.world, text);

  setTimeout(() => {
    function animate(){
      if (text.render.opacity >= 0){
        text.render.opacity -= 0.025;
        requestAnimationFrame(animate);
      } else {
        secondThump.play();
        setTimeout(() => {
          Matter.World.remove(engine.world, text);
          Matter.Composite.remove(engine.world, text);
          setTimeout(() => {
            spawnSound.play();
            stage5();
            clearInterval(intervalOne);
          }, 2500);
        }, 160)
      }
    }
    window.requestAnimationFrame(animate);
  }, 2500);
}

function stage5(){
  var tempBodies = [];
  var lavaBodies = [];
  var invisLavaBodies = [];
  var glitchedText = ["@&!*@#", "*@!&#*&@", "^&@!#^@#*", "^!@&#^!@!#*&", "^&!*@#^@!", "0101010011", "Error: Syntax !(@#&"];
  var fixed = false;

    var intervalTwo = setInterval(() => {
      levelHeader.textContent = ">" + glitchedText[Math.floor(Math.random() * glitchedText.length)] + "<";
    });

  function addNormalBodyStatic(x, y, width, height){
    tempBodies.push(Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'white',
        lineWidth: 2
      }
    }));
  }

  function addLavaBodyStatic(x, y, width, height){
    lavaBodies.push(Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'red',
        lineWidth: 2
      }
    }));
  }

  Matter.Body.setPosition(player, {x: 68, y: 503});
  Matter.Body.setVelocity(player, {x: 0, y: 0});

  var mouse = Matter.Mouse.create(render.canvas);
  var mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      render: {
        visible: false
      }
    }
  });
  render.mouse = mouse;

  addNormalBodyStatic(293, 260, 250, 20);
  addNormalBodyStatic(296, 30, 200, 60);
  addNormalBodyStatic(408, 30, 20, 60);
  addNormalBodyStatic(408, 210, 20, 80);
  addNormalBodyStatic(596, 10, 355, 20);
  addNormalBodyStatic(90, 470, 130, 30);
  addNormalBodyStatic(220, 470, 130, 30);
  addNormalBodyStatic(480, 470, 130, 30);
  addNormalBodyStatic(66, 558, 80, 20);
  addNormalBodyStatic(282, 558, 115, 20);
  addNormalBodyStatic(548, 558, 175, 20);
  addNormalBodyStatic(620, 502, 30, 94);
  addLavaBodyStatic(525, 220, 38, 230);
  addNormalBodyStatic(570, 348, 128, 20);
  addLavaBodyStatic(166, 558, 115, 20);
  addLavaBodyStatic(400, 558, 115, 20);
  addLavaBodyStatic(705, 558, 135, 20);
  addLavaBodyStatic(763, 285, 20, 520);
  var barrier = Matter.Bodies.rectangle(358, 515, 20, 60, {
    isStatic: true,
    render: {
      opacity: 0,
      fillStyle: 'transparent',
      strokeStyle: 'red',
      lineWidth: 2
    }
  });
  invisLavaBodies.push(barrier);
  var glow1 = Matter.Bodies.rectangle(165, 405, 20, 95, {
    isStatic: true,
    render: {
      opacity: 0,
      fillStyle: 'transparent',
      strokeStyle: 'red',
      lineWidth: 2
    }
  });
  invisLavaBodies.push(glow1);
  var glow2 = Matter.Bodies.rectangle(330, 345, 350, 20, {
    isStatic: true,
    render: {
      opacity: 0,
      fillStyle: 'transparent',
      strokeStyle: 'red',
      lineWidth: 2
    }
  });
  invisLavaBodies.push(glow2);
  var glow3 = Matter.Bodies.rectangle(90, 345, 128, 20, {
    isStatic: true,
    render: {
      opacity: 0,
      fillStyle: 'transparent',
      strokeStyle: 'red',
      lineWidth: 2
    }
  });
  invisLavaBodies.push(glow3);

  function showLava(){
    if (glow1.render.opacity >= 0 && glow2.render.opacity >= 0 && barrier.render.opacity >= 0){
      glow1.render.opacity -= 0.025;
      glow2.render.opacity -= 0.025;
      glow3.render.opacity -= 0.025;
      barrier.render.opacity -= 0.025;
      if (glow1.render.opacity <= 0 && glow2.render.opacity <= 0 && barrier.render.opacity <= 0 && glow3.render.opacity <= 0){
        glow1.render.opacity = 0;
        glow2.render.opacity = 0;
        glow3.render.opacity = 0;
        barrier.render.opacity = 0;
        return;
      }
      requestAnimationFrame(showLava);
    }
  }

  var lavaSpin1 = Matter.Bodies.rectangle(694, 498, 85, 20, {
    isStatic: true,
    rotationSpeed: 0.5,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'red',
      lineWidth: 2
    }
  });

  var lavaSpin2 = Matter.Bodies.rectangle(663, 238, 125, 20, {
    isStatic: true,
    rotationSpeed: 0.0135,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'red',
      lineWidth: 2
    }
  });

  var lavaSpin3 = Matter.Bodies.rectangle(602, 105, 85, 20, {
    isStatic: true,
    rotationSpeed: -0.0135,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'red',
      lineWidth: 2
    }
  });


  function rotateLava(){
    Matter.Body.setAngle(lavaSpin1, lavaSpin1.angle + lavaSpin1.rotationSpeed);
    Matter.Body.setAngle(lavaSpin2, lavaSpin2.angle + lavaSpin2.rotationSpeed);
    Matter.Body.setAngle(lavaSpin3, lavaSpin3.angle + lavaSpin3.rotationSpeed);
    requestAnimationFrame(rotateLava);
  }

  window.requestAnimationFrame(rotateLava);

  lavaBodies.push(lavaSpin1);
  lavaBodies.push(lavaSpin2);
  lavaBodies.push(lavaSpin3);

  tempBodies.push(Matter.Bodies.rectangle(575, 470, 60, 30, {
    isStatic: true,
    render: {
      opacity: 0,
      fillStyle: 'transparent',
      strokeStyle: 'white',
      lineWidth: 2
    }
  }));
  tempBodies.push(Matter.Bodies.rectangle(350, 470, 130, 30, {
    isStatic: true,
    collisionFilter: {
      'group': -1,
      'category': 2,
      'mask': 0
    },
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'white',
      lineWidth: 2
    }
  }));
  tempBodies.push(Matter.Bodies.rectangle(525, 405, 38, 90, {
    isStatic: true,
    collisionFilter: {
      'group': -1,
      'category': 2,
      'mask': 0
    },
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'white',
      lineWidth: 2
    }
  }));
  tempBodies.push(Matter.Bodies.rectangle(300, 304, 20, 20, {
    isStatic: true,
    collisionFilter: {
      'group': -1,
      'category': 2,
      'mask': 0
    },
    render: {
      sprite: {
        texture: 'images/careful.png'
      }
    }
  }));
  var errorText = Matter.Bodies.rectangle(280, 150, 20, 20, {
    isStatic: true,
    collisionFilter: {
      'group': -1,
      'category': 2,
      'mask': 0
    }
  });
  tempBodies.push(errorText);
  errorText.render.sprite.texture = 'images/ERROR.png';
  var draggableBody = Matter.Bodies.rectangle(160, 155, 270, 180, {
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'rgb(0, 255, 0)',
      lineWidth: 2
    }
  });

  var mouseCheck = setInterval(() => {
    if (mouseConstraint.body == draggableBody){
      errorSound.play();
      clearInterval(intervalTwo);
      levelHeader.textContent = ">Level Five<";
      fixed = true;
      errorText.render.sprite.texture = 'images/fixed.png';
      setTimeout(() => {
        Matter.Body.applyForce(draggableBody, {x: draggableBody.position.x, y:    draggableBody.position.y}, {x: 0.08, y: 0});
      }, 50);
    }
  });

  var static = setInterval(() => {
    if (fixed == false){
      tvStatic.play();
      setTimeout(() => {
        draggableBody.render.fillStyle = 'white'
      }, 100);
      setTimeout(() => {
        draggableBody.render.fillStyle = 'black'
      }, 150);
      setTimeout(() => {
        draggableBody.render.fillStyle = 'grey'
      }, 200);
      setTimeout(() => {
        draggableBody.render.fillStyle = 'white'
      }, 250);
      setTimeout(() => {
        draggableBody.render.fillStyle = 'black'
      }, 300);
      setTimeout(() => {
        draggableBody.render.fillStyle = 'grey'
      }, 350);
      setTimeout(() => {
        draggableBody.render.fillStyle = 'white'
      }, 400);
      setTimeout(() => {
        draggableBody.render.fillStyle = 'black'
      }, 450);
      setTimeout(() => {
        draggableBody.render.fillStyle = 'transparent'
      }, 500);
    }
  }, 10000);

  Matter.Events.on(engine, 'collisionStart', event => {
    var pairs = event.pairs;
    for (var i = 0; i < lavaBodies.length; i++){
      if (lavaBodies[i] == pairs[0].bodyB){
        Matter.Body.setPosition(player, {x: 68, y: 503});
        Matter.Body.setVelocity(player, {x: 0, y: 0});
        Matter.Body.setPosition(draggableBody, {x: 160, y: 200});
        Matter.Body.setVelocity(draggableBody, {x: 0, y: 0});
        deaths++;
        fixed = false;
        errorText.render.sprite.texture = 'images/ERROR.png';
        deathSound.play();
      }
    }
  });

  Matter.Events.on(engine, 'collisionStart', event => {
    var pairs = event.pairs;
    for (var i = 0; i < invisLavaBodies.length; i++){
      if (invisLavaBodies[i] == pairs[0].bodyB){
        Matter.Body.setPosition(player, {x: 68, y: 503});
        Matter.Body.setVelocity(player, {x: 0, y: 0});
        Matter.Body.setPosition(draggableBody, {x: 160, y: 200});
        Matter.Body.setVelocity(draggableBody, {x: 0, y: 0});
        deaths++;
        fixed = false;
        errorText.render.sprite.texture = 'images/ERROR.png';
        deathSound.play();
        glow1.render.opacity = 1;
        glow2.render.opacity = 1;
        glow3.render.opacity = 1;
        barrier.render.opacity = 1;
        window.requestAnimationFrame(showLava);
      }
    }
  });


  Matter.World.add(engine.world, tempBodies);
  Matter.World.add(engine.world, lavaBodies);
  Matter.World.add(engine.world, invisLavaBodies);
  Matter.World.add(engine.world, draggableBody);

  var fifthLevelFinish = setInterval(() => {
    if (player.position.y <= 0){
      spawnSound.play();
      
      for (var i = 0; i < tempBodies.length; i++){
        Matter.World.remove(engine.world, tempBodies[i]);
        Matter.Composite.remove(engine.world, tempBodies[i]);
      }

      for (var i = 0; i < lavaBodies.length; i++){
        Matter.World.remove(engine.world, lavaBodies[i]);
        Matter.Composite.remove(engine.world, lavaBodies[i]);
      }
      
      for (var i = 0; i < invisLavaBodies.length; i++){
        Matter.World.remove(engine.world, invisLavaBodies[i]);
        Matter.Composite.remove(engine.world, invisLavaBodies[i]);
      }

      Matter.World.remove(engine.world, draggableBody);
      Matter.Composite.remove(engine.world, draggableBody);

      stage6();
      clearInterval(mouseCheck);
      clearInterval(static);
      clearInterval(fifthLevelFinish);
    }
  });
}

function stage6(){
  levelHeader.textContent = ">Level Six<";

  var tempBodies = [];
  var lavaBodies = [];
  var positiveSpeed = 0.1478;
  var negativeSpeed = -0.1478;

  function addNormalBodyStatic(x, y, width, height){
    tempBodies.push(Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'white',
        lineWidth: 2
      }
    }));
  }

  function addLavaBodyStatic(x, y, width, height){
    lavaBodies.push(Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'red',
        lineWidth: 2
      }
    }));
  }


  Matter.Body.setPosition(player, {x: 160, y: 80});

  addNormalBodyStatic(160, 120, 75, 20);
  addNormalBodyStatic(66, 553, 80, 30);
  addLavaBodyStatic(162, 20, 270, 40);
  addLavaBodyStatic(287, 140, 20, 200);
  addLavaBodyStatic(37, 260, 20, 440);
  addLavaBodyStatic(307, 362, 60, 243);
  addLavaBodyStatic(285, 557, 355, 20);
  addLavaBodyStatic(388, 383, 100, 200);
  addLavaBodyStatic(451, 363, 25, 240);
  addLavaBodyStatic(545, 557, 160, 20);
  addLavaBodyStatic(631, 305, 155, 20);
  addNormalBodyStatic(318, 212, 38, 50);
  addNormalBodyStatic(451, 190, 25, 100);
  addNormalBodyStatic(417, 125, 94, 25);
  addNormalBodyStatic(408, 60, 220, 25);
  addNormalBodyStatic(535, 263, 30, 430);
  addNormalBodyStatic(615, 495, 20, 100);
  addNormalBodyStatic(700, 455, 148, 20);
  addNormalBodyStatic(620, 60, 140, 25);
  addNormalBodyStatic(570, 1, 410, 5);

  var detectorBlock = Matter.Bodies.rectangle(695, 208, 155, 20, {
    isStatic: true,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'white',
      lineWidth: 2
    }
  });  
  var portalOne = Matter.Bodies.rectangle(450, 514, 25, 60, {
    isStatic: true,
    render: {
      fillStyle: 'transparent',
      strokeStyle: '#0288d1',
      lineWidth: 2
    }
  });

  var portalTwo = Matter.Bodies.rectangle(388, 270, 100, 20, {
    isStatic: true,
    render: {
      fillStyle: 'transparent',
      strokeStyle: '#0288d1',
      lineWidth: 2
    }
  });
  
  var spinnerOne = Matter.Bodies.rectangle(140, 200, 173, 20, {
    isStatic: true,
    rotationSpeed: 0.02,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'red',
      lineWidth: 2
    }
  });

  var spinnerTwo = Matter.Bodies.rectangle(175, 370, 180, 20, {
    isStatic: true,
    rotationSpeed: -0.02,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'red',
      lineWidth: 2
    }
  });

  var spinnerThree = Matter.Bodies.rectangle(750, 550, 141, 25, {
    isStatic: true,
    rotationSpeed: 0.0045,
    render: {
      fillStyle: 'red',
      strokeStyle: 'red',
      lineWidth: 2
    }
  });

  var spinnerFour = Matter.Bodies.rectangle(750, 550, 25, 141, {
    isStatic: true,
    rotationSpeed: 0.0045,
    render: {
      fillStyle: 'red',
      strokeStyle: 'red',
      lineWidth: 2
    }
  });

  var spinnerFive = Matter.Bodies.rectangle(730, 100, 20, 20, {
    isStatic: true,
    rotationSpeed: 0.4,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'red',
      lineWidth: 2
    }
  });

  var ejectorX = Matter.Bodies.rectangle(37, 510, 20, 55, {
    isStatic: true,
    render: {
      fillStyle: 'transparent',
      strokeStyle: 'orange',
      lineWidth: 2
    }
  });

  tempBodies.push(detectorBlock);
  lavaBodies.push(spinnerOne);
  lavaBodies.push(spinnerTwo);
  lavaBodies.push(spinnerThree);
  lavaBodies.push(spinnerFour);
  lavaBodies.push(spinnerFive);

  function animateSpinners(){
    Matter.Body.setAngle(spinnerOne, spinnerOne.angle + spinnerOne.rotationSpeed);
    Matter.Body.setAngle(spinnerTwo, spinnerTwo.angle + spinnerTwo.rotationSpeed);
    Matter.Body.setAngle(spinnerThree, spinnerThree.angle + spinnerThree.rotationSpeed);
    Matter.Body.setAngle(spinnerFour, spinnerFour.angle + spinnerFour.rotationSpeed);
    Matter.Body.setAngle(spinnerFive, spinnerFive.angle + spinnerFive.rotationSpeed);
    requestAnimationFrame(animateSpinners);
  }

  function translateSpinner(){
    if (player.position.x > spinnerThree.position.x && player.position.x > spinnerFour.position.x){
      Matter.Body.translate(spinnerThree, {x: positiveSpeed, y: 0});
      Matter.Body.translate(spinnerFour, {x: positiveSpeed, y: 0});
    }
    if (player.position.x < spinnerThree.position.x && player.position.x < spinnerFour.position.x){
      Matter.Body.translate(spinnerThree, {x: negativeSpeed, y: 0});
      Matter.Body.translate(spinnerFour, {x: negativeSpeed, y: 0});
    }
    if (player.position.y > spinnerThree.position.y && player.position.y > spinnerFour.position.y){
      Matter.Body.translate(spinnerThree, {x: 0, y: positiveSpeed});
      Matter.Body.translate(spinnerFour, {x: 0, y: positiveSpeed});
    }
    if (player.position.y < spinnerThree.position.y && player.position.y < spinnerFour.position.y){
      Matter.Body.translate(spinnerThree, {x: 0, y: negativeSpeed});
      Matter.Body.translate(spinnerFour, {x: 0, y: negativeSpeed});
    }
    requestAnimationFrame(translateSpinner);
  }

  function moveSmallSpinnerLeft(){
    Matter.Body.translate(spinnerFive, {x: -2.3, y: 0});
    if (spinnerFive.position.x <= 590){
      requestAnimationFrame(moveSmallSpinnerRight);
      return;
    }
    requestAnimationFrame(moveSmallSpinnerLeft);
  }

  function moveSmallSpinnerRight(){
    Matter.Body.translate(spinnerFive, {x: 2.3, y: 0});
    if (spinnerFive.position.x >= 730){
      requestAnimationFrame(moveSmallSpinnerLeft);
      return;
    }
    requestAnimationFrame(moveSmallSpinnerRight);
  }

  function animateSpinnerFade(){
    spinnerThree.render.opacity -= 0.01;
    spinnerFour.render.opacity -= 0.01;
    if (spinnerThree.render.opacity <= 0.25 && spinnerFour.render.opacity <= 0.25){
      spinnerThree.render.opacity = 0.25;
      spinnerFour.render.opacity = 0.25;
      requestAnimationFrame(animateSpinnerShow);
      return;
    }
    requestAnimationFrame(animateSpinnerFade);
  }

  function animateSpinnerShow(){
    spinnerThree.render.opacity += 0.01;
    spinnerFour.render.opacity += 0.01;
    if (spinnerThree.render.opacity >= 1 && spinnerFour.render.opacity >= 1){
      spinnerThree.render.opacity = 1;
      spinnerFour.render.opacity = 1;
      requestAnimationFrame(animateSpinnerFade);
      return;
    }
    requestAnimationFrame(animateSpinnerShow);
  }

  function animatePortalsFade(){
    portalOne.render.opacity -= 0.01;
    portalTwo.render.opacity -= 0.01;
    if (portalOne.render.opacity <= 0.25 && portalTwo.render.opacity <= 0.25){
      portalOne.render.opacity = 0.25;
      portalTwo.render.opacity = 0.25;
      requestAnimationFrame(animatePortalsShow);
      return;
    }
    requestAnimationFrame(animatePortalsFade);
  }

  function animatePortalsShow(){
    portalOne.render.opacity += 0.01;
    portalTwo.render.opacity += 0.01;
    if (portalOne.render.opacity >= 1 && portalTwo.render.opacity >= 1){
      portalOne.render.opacity = 1;
      portalTwo.render.opacity = 1;
      requestAnimationFrame(animatePortalsFade);
      return;
    }
    requestAnimationFrame(animatePortalsShow);
  }

  window.requestAnimationFrame(moveSmallSpinnerLeft);
  window.requestAnimationFrame(animateSpinnerFade);
  window.requestAnimationFrame(translateSpinner);
  window.requestAnimationFrame(animateSpinners);
  window.requestAnimationFrame(animatePortalsFade);

  Matter.Events.on(engine, 'collisionStart', event => {
    var pairs = event.pairs;
    if (portalOne == pairs[0].bodyB){
      teleportSound.play();
      Matter.Body.setVelocity(player, {x: 0, y: 0});
      Matter.Body.setPosition(player, {x: portalTwo.position.x, y: portalTwo.position.y - 35});
      setTimeout(() => {
        Matter.Body.applyForce(player, {x: player.position.x, y: player.position.y},  {x: 0, y: -0.034});
      }, 20);
    } 
    if (portalTwo == pairs[0].bodyB){
      teleportSound.play();
      Matter.Body.setVelocity(player, {x: 0, y: 0});
      Matter.Body.setPosition(player, {x: portalOne.position.x - 35, y: portalOne.position.y});
      setTimeout(() => {
        Matter.Body.applyForce(player, {x: player.position.x, y: player.position.y},  {x: -0.034, y: 0});
      }, 20);
    }
  });

  Matter.Events.on(engine, 'collisionStart', event => {
    var pairs = event.pairs;
    if (pairs[0].bodyB == detectorBlock){
      positiveSpeed = 0.2;
      negativeSpeed = -0.2;
    }
  });

  Matter.Events.on(engine, 'collisionStart', event => {
    var pairs = event.pairs;
    for (var i = 0; i < lavaBodies.length; i++){
      if (lavaBodies[i] == pairs[0].bodyB){
        positiveSpeed = 0.1478;
        negativeSpeed = -0.1478;
        Matter.Body.setPosition(player, {x: 160, y: 80});
        Matter.Body.setPosition(spinnerThree, {x: 750, y: 550});
        Matter.Body.setPosition(spinnerFour, {x: 750, y: 550});
        Matter.Body.setVelocity(player, {x: 0, y: 0});
        deaths++;
        deathSound.play();
      }
    }
  });

  Matter.Events.on(engine, 'collisionStart', event => {
    var pairs = event.pairs;
      if (ejectorX == pairs[0].bodyB){
        ejectSound.play();
        setTimeout(() => {
          Matter.Body.applyForce(player, {x: player.position.x, y: player.position.y}, {x: 0.27, y: 0});
        }, 20);
      }
    });

  Matter.World.add(engine.world, tempBodies);
  Matter.World.add(engine.world, lavaBodies);
  Matter.World.add(engine.world, [portalOne, portalTwo, ejectorX]);

  var sixthLevelFinish = setInterval(() => {
    if (player.position.y <= 0){
      specialSpawn.play();
      
      for (var i = 0; i < tempBodies.length; i++){
        Matter.World.remove(engine.world, tempBodies[i]);
        Matter.Composite.remove(engine.world, tempBodies[i]);
      }

      for (var i = 0; i < lavaBodies.length; i++){
        Matter.World.remove(engine.world, lavaBodies[i]);
        Matter.Composite.remove(engine.world, lavaBodies[i]);
      }

      Matter.World.remove(engine.world, [portalOne, portalTwo, ejectorX]);
      Matter.Composite.remove(engine.world, [portalOne, portalTwo, ejectorX]);

      ending();
      clearInterval(sixthLevelFinish);
    }
  });

}

function ending(){
  levelHeader.textContent = ">Thanks For Playing<";

  Matter.Body.setPosition(player, {x: 3000, y: 3000});
  Matter.World.remove(engine.world, floor);
  Matter.Composite.remove(engine.world, floor);
  Matter.World.remove(engine.world, leftWall);
  Matter.Composite.remove(engine.world, leftWall);
  Matter.World.remove(engine.world, rightWall);
  Matter.Composite.remove(engine.world, rightWall);


  function restart(){
    Matter.World.remove(engine.world, text);
    Matter.Composite.remove(engine.world, text);
    setTimeout(() => {
      titleScreen.volume = 0.15;
      Matter.World.add(engine.world, [floor, leftWall, rightWall]);
      Matter.Body.setVelocity(player, {x: 0, y: 0});
      Matter.Body.setPosition(player, {x: 400, y: 190});
      deaths = 0;
      mainMenu();
      spawnSound.play();
    }, 2000);
  }

   var text = Matter.Bodies.rectangle(400, 293, 20, 20, {
    isStatic: true,
    collisionFilter: {
      mask: 0
    },
    render: {
      fillStyle: 'transparent',
      sprite: {
        texture: 'images/thankyou.png'
      }
    }
  });
  Matter.World.add(engine.world, text); 

  setTimeout(() => {
    function fadeText(){
      text.render.opacity -= 0.01;
      if (text.render.opacity <= 0){
        text.render.opacity = 0;
        restart();
        return;
      }
      requestAnimationFrame(fadeText);
    }
    window.requestAnimationFrame(fadeText);
  }, 2000);

}


}

})();