# How to give a star to a repository on GitHub

## Finding the repository

Open your browser and navigate to the github.com website

```js
await page.setViewportSize({ width: 1500, height: 600 });
await page.goto('https://github.com')
```

Click on the box that says "Search or jump to..."

```js
await page.getByText('Search or jump to...').click()
```

Type the name of the repository you want to give a star to

```js
await page.type('#query-builder-test', 'lovasoa/sqlpage')
```

![](#screenshot)

Press enter

```js
await page.keyboard.press('Enter')
// wait for the page to load
await page.getByRole('heading', { name: /\d+ results?/ }).waitFor()
```

![](#screenshot)

Click on the repository name and wait for the page to load

```js
await page.click(`a[href="/lovasoa/SQLpage"]`)
await page.waitForURL('**/lovasoa/SQLpage')
```

You are now on the repository page

![](#screenshot)

## Giving a star

Click on the "Star" button

```js
await page.getByText('Star', {exact: true}).first().click()
```

![](#screenshot)


### Errors

If your test returns an error, you still get a beautifully
rendered error with a screenshot and a DOM dump to help you debug the issue quickly :

```js
await page.getByText('inexistent element').click()
```