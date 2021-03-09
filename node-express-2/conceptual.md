### Conceptual Exercise

Answer the following questions below:

- What is a JWT?  

  json web token, used to store info and authenticate

- What is the signature portion of the JWT?  What does it do?  

  last part of the jwt.  it is the part that can't be decoded and proves that the person with the token is who they say they are

- If a JWT is intercepted, can the attacker see what's inside the payload?  

  yes, if they decode it (which is easy enough to do)

- How can you implement authentication with a JWT?  Describe how it works at a high level.  

  token is created and signed on login, then stored in browser.  for each request the token is sent from browser to server and validated.

- Compare and contrast unit, integration and end-to-end tests.  

  they are listed from most to least specific.  unit tests a single function, integration tests how functions work together, and end-to-end tests the entire user experience of the app.  they are all similar in that they involved writing functions that tell the app to do something, and then compare the result with an expected result.

- What is a mock? What are some things you would mock?  

  an object created for testing to replace something that would be hard to use in a test.  a common example would be an api call.

- What is continuous integration? 
 
  making several small code changes over time rather than all at once

- What is an environment variable and what are they used for?  

  stored information that affects the entire app.  most common usage i've seen so far is to set whether the app is in a testing environment or not, to determine which database to use.

- What is TDD? What are some benefits and drawbacks?  

  test driven development.  takes longer to get started writing actual code, but can potentially make overall development faster.  sets specific parameters of what the app should do, so it gives better guidance for writing code and prevents developers from going off on a long coding tangent.

- What is the value of using JSONSchema for validation? 
 
  it can save writing a ton of validation code, especially if there are multiple functions that use the same tables.

- What are some ways to decide which code to test?  

  most important functions, easiest functions to test, edge case testing.

- What are some differences between Web Sockets and HTTP?
  
  basically http makes a call and gets a response, and that's it.  websockets stay open and make changes as they are received.

- Did you prefer using Flask over Express? Why or why not (there is no right 
  answer here --- we want to see how you think about technology)?  
  
  i still slightly prefer flask, but express is catching up as i get more used to it.  so far, i've found that flask (and python in general) tends to work with shorter, cleaner code, while javascript and express are more likely to end up long and convoluted.  the try/catch thing seems like there has to be a more efficient method.
