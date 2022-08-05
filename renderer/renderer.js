// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { ipcRenderer } = require("electron");
const axios = require("axios").default;
const os = require("node:os");
let close = document.getElementById("close");
let expand = document.getElementById("expand");
window.addEventListener("DOMContentLoaded", async () => {
  let clip = document.getElementById("clipboard");
  // setInterval(() => {
  //   randomUser();
  // }, 500);
  let notify = document.getElementById("notify");
  notify.style.display = 'none';
  setInterval(() => {
    showNotification();
  }, 360000);
  getWeatheInfo()
});
close.addEventListener("click", () => {
  ipcRenderer.send("close-me");
});

const NOTIFICATION_TITLE = "health Notification";
const NOTIFICATION_BODY = "drink a glass of water";

function showNotification() {
  new Notification(NOTIFICATION_TITLE, {
    body: NOTIFICATION_BODY,
    icon: "./public/water-removebg-preview.png",
  }).show();
}

function randomUser() {
  //https://randomuser.me/api/
  let userArea = document.getElementById("user");
  // $.get('https://randomuser.me/api/',(data, status)=>{
  //    userArea.innerHTML=JSON.stringify(data);
  // })
  axios
    .get("https://randomuser.me/api/")
    .then(function (response) {
      // handle success
      let data = response.data.results[0];
      userArea.innerHTML = JSON.stringify(data.name.first);
      let html_text = `<div>${data.name.first}</div><div><img src=${data.picture.large}></div>`;
      userArea.innerHTML = html_text;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}
let size = false;
expand.addEventListener("click", () => {
  if (!size) {
    window.resizeTo(300, 400);
    size = true;
    expand.innerHTML = '<i class="fa fa-sort-asc" aria-hidden="true"></i>';
    let notify = document.getElementById("notify");
    notify.style.display = 'block';
  } else {
    window.resizeTo(300, 200);
    size = false;
    expand.innerHTML = '<i class="fa fa-sort-desc" aria-hidden="true"></i>';
    notify.style.display = 'none';
  }

  //ipcRenderer.send('resize');console.log("hhhh");
});

let notify = document.getElementById("notify");
notify.addEventListener("click", () => {
  //ipcRenderer.send('notify')
  showNotification();
});

function getWeatheInfo() {
  //https://fcc-weather-api.glitch.me/api/current?lat=88.362951&lon=22.51829

  axios
    .get("https://fcc-weather-api.glitch.me/api/current?lat=22.51829&lon=88.362951").then((res) => {
      let html_data = `<div>currrent temp :${res.data.main.temp}</div>`
      console.log(res.data.main.temp)
      let userArea = document.getElementById("user");
      userArea.innerHTML = html_data;
    })

}

let screenShot_btn = document.getElementById('sreeen_shot');
screenShot_btn.addEventListener('click', () => {
  ipcRenderer.send("screenShot");

})

ipcRenderer.on('sereenCaptured',(e,i)=>{
  let a=document.createElement('a')
  a.href=i
  a.download = 'scr.png';
  a.click();
  new Notification("screen shot captured", {
    icon: i,
  })
})