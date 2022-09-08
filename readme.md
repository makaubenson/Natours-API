# Building Natuors API

## Express.js

- Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- Its written using Node.js and its the most popular.
- Express allows for rapid development of Node.js applications.
- It also makes it easy to impliment the MVC architecture.

### API

- Piece of s/w which can be used by another s/w for purposes of communication.

### The REST Architecture

- RESTFul APIs- APIs following the REST architecture.
- Resources should contain resources BUT not actions that can be performed on them.

![REST](https://user-images.githubusercontent.com/59168713/188862834-16dac218-3087-46c8-a397-97e26c960451.png)

![REST1](https://user-images.githubusercontent.com/59168713/188862862-9c53ecb5-852e-4521-9ffb-08ff151333db.png)

![rest2](https://user-images.githubusercontent.com/59168713/188862913-1df90b30-0ed7-43c3-a309-58f8c5f03848.png)

![rest3](https://user-images.githubusercontent.com/59168713/188862933-3276cd18-9149-437f-8a5d-2381e24c4cca.png)

![rest4](https://user-images.githubusercontent.com/59168713/188862955-7ec4c3b1-cc92-4df6-bf4e-9834970c7fc7.png)

![rest5](https://user-images.githubusercontent.com/59168713/188863004-5f50bfb3-118a-473f-9ffb-1585f4b3e623.png)

### Middleware

- Middleware is software that lies between an operating system and the applications running on it. Essentially functioning as hidden translation layer, middleware enables communication and data management for distributed applications.
- Stands between request and response.

#### Middleware and the Request-Response Cycle

- In express everything is middleware.
- Example of middlewares
- ![image]
- Middleware that appears first in code, is executed before the one that appears later.
- Order of code is important in express.
- At the end of each middleware function, next() function is called, allowing for execution of the next middleware.
- Request and Response objects created in the beggining go through each middleware.
- The last middleware function, its ussually a router handler, thus we dont call the next() function to move to next middleware instead we send response data back to the client, thus finishing Request-Response cycle.
- ![image]

- For us to use middleware in node.js, we rely on `use()` function.
- e.g `app.use(express.json());`

### Creating our own middleware

- This middleware applies to every request since we havent specified any route.
- Eaxmple 1

```
app.use((req, res, next) => {
  console.log('Hello from the middleware!!');
  // We need to call next() to avoid Request-Response cycle being stuck
  next();
});
```

- Example 2

```
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next(); //call next middleware in the callstack
});
```

- Order of code is very important in express.
