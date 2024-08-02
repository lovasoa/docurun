# Download SQLPage

SQLPage is a simple tool that lets you write entire dynamic websites using **only** simple SQL queries.
With only basic database querying skills, you are able to create a fully functionnal application
with a beautful responsive frontend, a simple backend, and a database.

## Why download it ?

SQLPage is available as a managed service on [datapage.app](https://datapage.app),
but you can also run it locally on your computer or on your own webserver if you have one.

## Open the official website

For that, head to [the official website](https://sql.ophir.dev):

```js
await page.goto('https://sql.ophir.dev')
```

![](#screenshot)

### Building your first website

Click *Build your first SQL website now !*

```js
await page.getByText('Build your first SQL website now !').click()
```

![](#screenshot)

Then *Download the latest SQLPage*

```js
await page.getByText('Download the latest SQLPage').click()
```

![](#screenshot)

Scroll down to the *Assets* section of the first release you see.
You should see a file with name that starts with `sqlpage-` that matches
your operating system (Linux, MacOS, or Windows).
For instance, if you use windows, download `sqlpage-windows.zip`.

```js
await page.getByText('Assets', {exact: true}).first().scrollIntoViewIfNeeded()
await page.getByText('sqlpage-windows.zip').first().focus()
```

![](#screenshot)
