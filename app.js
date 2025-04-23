const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { listingSchema } = require('./schema.js');


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
main().then(()=>{
console.log("connected to DB");
})
.catch((err)=>{
console.log(err);
});


async function main(){
    await mongoose.connect(MONGO_URL);
}


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine ('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));


app.get('/', (req, res) => { 
    res.send('Hello i am root');
});


app.get("/listings" , (async(req,res)=>{
const allListings = await Listing.find({});
res.render("listings", {allListings});
}
));


app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");

});

app.get("/listings/:id" , (async(req,res)=>{
  let { id } = req.params;
  const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

app.post("/listings", (async (req,res)=>{
let result =  listingSchema.validate(req.body);
console.log(result);
  const newListing =  new Listing(req.body.listing);
  await newListing.save();
   res.redirect("/listings");

}));

app.get("/listings/:id/edit",  (async (req,res)=>{
let { id } = req.params;
const listing = await Listing.findById(id);
res.render("listings/edit.ejs", {listing});
}));


    app.put("/listings/:id",(async (req,res)=>{
let { id } = req.params;
 await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
res.redirect(`/listings/${id}`);

}));

app.delete("/listings/:id",( async (req,res)=>{
let {id} = req.params;
 let deletedListing  = await Listing.findByIdAndDelete(id);
console.log(deletedListing);
res.redirect("/listings");
}));






















// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "A beautiful villa in the countryside",
//         price :12000,
//         location: "Calangute Beach, Goa",
//         country: "India",
        
// });
//  await sampleListing.save();
//  console.log("Listing saved to DB");
//  res.send ("success");
// });


// app.all("*",(req,res,next)=>{
//     next(new ExpressError( 404,"Page Not Found"));
// }
// );


app.use((err, req, res, next) => {
    let {statuscode , message} = err;
    res.render("error.ejs")
  
});


app.listen(8080 , ()=>{
console.log("Server is running on port 8080");
});