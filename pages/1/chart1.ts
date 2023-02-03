// const socket = io('ws://192.168.0.146:5173');

//added to try Roll Up
import { io } from "socket.io-client";

const socket = io();

socket.on('message', text => {
    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul')?.appendChild(el);
});

let btn = document.querySelector('button');
if (btn !== null) {
    btn.onclick = () => {
        const text = document.querySelector('input')?.value;
        socket.emit('message', text);
    }
}
