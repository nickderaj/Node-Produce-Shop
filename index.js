// CORE MODULES
const fs = require("fs");
const http = require("http");
const url = require("url");
// OUR OWN MODULE
const replaceTemplate = require("./modules/replaceTemplate.js"); // . now points to this, don't need _dirname

//////////////////////////////////
// FILES //

/*
// Synchronous file reading:
const textIn = fs.readFileSync("./txt/input.txt", "utf-8"); // File, encoder
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// Synchronous file outputs:
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written!");

// Non-blocking, asynchronous: // Read 'start.txt' in the background and as soon as it's ready, it calls the function in the second paramater
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
      console.log(data3);

      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log("File has been written ✅");
      });
    });
  });
});
console.log("Will read file!");
*/

//////////////////////////////////
// SERVER //

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const baseUrl = `http://${req.headers.host}/`;
  const requestURL = new URL(req.url, baseUrl);
  const { pathname } = requestURL;
  const query = requestURL.searchParams.get("id");

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // 404 NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
