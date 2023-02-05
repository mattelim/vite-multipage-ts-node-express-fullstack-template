import express = require("express");
import { Server } from "socket.io";

// import path, { dirname } from "path";
import path = require("path");
// import { fileURLToPath } from "url";
// const __dirname = dirname(fileURLToPath(import.meta.url));

import sqlite = require("sqlite3");

/* DB */

sqlite.verbose()
const db = new sqlite.Database("./db/chinook.db", sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
});

const app = express();
const io = new Server();

/* SERVER RUN */

const server = app.listen(3000, () => {
    console.log("Started server at ", server.address());
});
io.attach(server);

import livereload = require("livereload");
import connectLiveReload = require("connect-livereload");

// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    // console.log("development mode hehe");
    const liveReloadServer = livereload.createServer();
    liveReloadServer.server.once("connection", () => {
        setTimeout(() => {
            liveReloadServer.refresh("/");
        }, 50);
    });
    app.use(connectLiveReload());
}

const staticPath = 'dist' ;

/* Client routes */

// template example, delete later ↓
app.get("/", async (_, res) => {
	res.sendFile(process.cwd() + "/dist/pages/index.html");
});
// console.log(process.cwd());
// console.log(__dirname);
// ↑

app.use(express.static(path.join(process.cwd(), staticPath)));
// console.log(path.join(path.join(__dirname, staticPath)));
// console.log(path.join(process.cwd(), staticPath));


app.get('/:page', async (req, res, next) =>  {
	let options = {
		root: path.join(process.cwd(), staticPath+'/pages'),
		dotfiles: 'deny',
		headers: {
		'x-timestamp': Date.now(),
		'x-sent': true
		}
	}

    let fileName = `/${req.params.page}/index.html`;
    console.log(fileName);
    res.sendFile(fileName, options, (err) => {
    // res.sendFile(process.cwd() + "/" + fileName, options, (err) => {
        if (err) {
            next(err);
        } else {
            console.log(`Sent: ${fileName}`)
        }
    })
})


/* APIs */

app.get('/api/test', function (_, res) {
    let sql = "SELECT * FROM invoices";
    try {
        db.all(sql, [], (err, rows) => {
            if (err) return res.json({ status: 400, success: false, error: err });

            if (rows.length < 1) return res.json({ status: 400, success: false, error: "No match" });

            return res.json({ status: 200, data: rows, success: true});
        });
    } catch (error) {
        return res.json({
            status: 400,
            success: false,
        })
    }
    return
})

/* SOCKET IO */

io.on("connection", (socket) => {
	console.log('A user connected: ' + socket.id);

	socket.on("chat message", (msg) => {
		io.emit("chat message", msg);
	});

	socket.on('message', (message) => {
        console.log(message);
        io.emit('message', `${socket.id.slice(0,2)} said ${message}`);
    })
});
