### Conceptual Exercise

Answer the following questions below:

- What are some ways of managing asynchronous code in JavaScript?  
  .then or async/await

- What is a Promise?  
  a guarantee of a later response

- What are the differences between an async function and a regular function?  
  regular happens pretty much instantly, async takes time.  this must be handled because it will either hold up the entire script, or move on before retrieving necessary info.

- What is the difference between Node.js and Express.js?  
  node is the language, and express is a framework used to create apps using node.  same relationship as python and flask.

- What is the error-first callback pattern?  
  pattern usually used in node.  error is the function's first parameter, and other params are invoked only if there is no error.

- What is middleware?  
  functions that run between request and response

- What does the `next` function do?  
  moves on to the next applicable line or function

- What does `RETURNING` do in SQL? When would you use it?  
  is this question supposed to be here?  seems totally off topic, and was in no way mentioned in any recent chapters.  anyway, it returns updated database info immediately after an update without having to do another query.

- What are some issues with the following code? (consider all aspects: performance, structure, naming, etc)

```js
async function getUsers() {
  const elie = await $.getJSON('https://api.github.com/users/elie');
  const joel = await $.getJSON('https://api.github.com/users/joelburton');
  const matt = await $.getJSON('https://api.github.com/users/mmmaaatttttt');

  return [elie, matt, joel];
}
```

  the requests run sequentially so it could potentially take a long time.  parallel requests would be better, or Promise.all().

  also, a base_url variable could have been declared to prevent typing out the url three times.