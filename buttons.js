var infoButton = document.getElementById("info");
var changelogButton = document.getElementById("change-log");
var creditButton = document.getElementById("credits");
var buttonFx = document.getElementById("button-click");
var discordButton = document.getElementById("discord");

function renderHTML(file){
  window.open(file, "", "width = 400, height = 800");
}

infoButton.onmouseover = function(){
  infoButton.style.borderColor = "#7289DA";
}

changelogButton.onmouseover = function(){
  changelogButton.style.borderColor = "#7289DA";
}

creditButton.onmouseover = function(){
  creditButton.style.borderColor = "#7289DA";
}



infoButton.onmouseout = function(){
  infoButton.style.borderColor = "white";
}

changelogButton.onmouseout = function(){
  changelogButton.style.borderColor = "white";
}

creditButton.onmouseout = function(){
  creditButton.style.borderColor = "white";
}



infoButton.addEventListener("click", function(){
  buttonFx.play();
  renderHTML('info.html');
});

changelogButton.addEventListener("click", function(){
  buttonFx.play();
  renderHTML('changelog.html');
});

creditButton.addEventListener("click", function(){
  buttonFx.play();
  renderHTML('credits.html');
})

discordButton.addEventListener("click", function(){
  buttonFx.play();
  window.open("https://discord.gg/HQ9uuNdtWS", "_blank");
});
