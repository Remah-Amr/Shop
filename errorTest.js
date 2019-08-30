const sum = (a,b) => {
    if(a && b)
    {
        return a + b;
    }
    throw new Error('invalid arguments');
}
try{

    console.log(sum(2));
} catch(error){
   console.log('error occured!');
//    console.log(error);
   
}
console.log('Yeah ! it works!');


// conclusion : if i don't catch error then app crashed and doesn't continue
// we use try and catch when use sync code and dont use arrow function , try,then and catch with arrow function when use async code and instead of log the error i use (err => {throw new Error syntax(err);})


// you can use in controllers at catch section this syntax at video 306.307  in error handling
// .catch(err => {
//     const error =  new Error(err);
//     return next (error); // this will skip all normal middlware then reach to error middleware and execute it in app.js
// })

// important note: then i inside async code above i use return next(error), but if i in sync code i use throw new Error('Dummy') then i redirect auto to my error middelware like in global variable

// at app.js
// app.use((error,req,res,next) => {
//     res.status(500).render('Error');
// })
// i use above code to handle every unhandled errors , either async nor sync

// status codes is gracefully to handling errors , from show inspect element and know status code. and don't mean app crashed or res incomplete