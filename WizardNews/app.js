const express = require("express");
const app = express();
const volleyball = require('volleyball')

const postBank = require('./postBank')

const PORT = 3030;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});

app.use(express.static('public'))

app.use(volleyball)

app.get('/', (req, res) => {

  const posts = postBank.list()

  const html = `<!DOCTYPE html>
                <html>
                <head>
                  <title>Wizard News</title>
                  <link rel="stylesheet" href="/style.css" />
                </head>
                <body>
                  <div class="news-list">
                    <header><img src="/logo.png"/>Wizard News</header>
                    ${posts.map(post => `
                    <a href="/posts/${post.id}">
                      <div class='news-item'>
                        <p>
                          <span class="news-position">${post.id}. ▲</span>${post.title}
                          <small>(by ${post.name})</small>
                        </p>
                        <small class="news-info">
                          ${post.upvotes} upvotes | ${post.date}
                        </small>
                      </div>
                      </a>`
                    ).join('')}
                  </div>
                </body>
              </html>`

  res.send(html)

})

app.get('/posts/:id', (req, res) => {
  const id = req.params.id
  const post = postBank.find(id)

  if(!post.id) {
    throw new Error('Page Not Found')
  }

  const html = `<!DOCTYPE html>
                <html>
                <head>
                  <title>Wizard News</title>
                  <link rel="stylesheet" href="/style.css" />
                </head>
                <body>
                  <div class="news-list">
                    <header><img src="/logo.png"/>Wizard News</header>
                    
                    ${`
                      <div class='news-item'>
                        <p>
                          ${post.title}
                          <small>(by ${post.name})</small>
                        </p>
                        <p>
                          ${post.content}
                        </p>
                      </div>`}
                  </div>
                </body>
              </html>`

  res.send(html)
})

app.use(function(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send(`
    <p>Something Broke! Please go back and try again.</p>
    <a href="http://localhost:3030">Go back to home page</a>
    `)
})