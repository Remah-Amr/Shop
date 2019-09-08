// npm we use it to install packages we use in our app so if i run npm install i will install all dependecies in our project
// in scripts section to run any field i write npm run 'name' exept start => npm start
// node.js can excute any .js files like we do in react project we use npm install to install all packages
// Build tool deal with front end web devolopment , how?
// our code we wrote in javascript like arrowfunction or spread operators which deal with arrays in our react Project cont.
// called 'unoptimzed code' not run on browser so we have to convert it to optimzed code to understand and run on browser cont.
// and we did that by npm because it 'build tool'
// if you run npm install in react project which frontEnd will create node_modules folder which have every packages you want to use cont.
// and packages you install them and every package there have it's code in file.js so node.js run this first in your machine before code optimzed in browser 
// note : node_modules folder will create in your BE project after install 'express'


// if you read that feature include in express of version:4.16.2 and your express is ^4.15.2
// in this case you right because ^ run and match in 4.any.any until 5.0.0
// but if your express ~4.15.2 then you run and match until 4.15.any then when 4.16.0 will be off

// The tilde ~ matches the most recent patch version (the third number) for the specified minor version (the second number).
// ~1.2.3 will match all 1.2.x versions but will hold off on 1.3.0.
// The caret ^ is more relaxed. It matches the most recent minor version (the second number)
// for the specified major version (the first number).
// ^1.2.3 will match any 1.x.x release including 1.3.0, but will hold off on 2.0.0.