const mongoose = require('mongoose');

//Create a Schema for our tours in the natours database
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'], //this is basically a validator
            trim: true, //trims before and after whitespaces
            maxLength: [
                40,
                'A tour must have less than or equal to 40 characters',
            ],
            minLength: [
                10,
                'A tour must have a length of atleast 10 characters',
            ],
        },
        price: {
            type: Number,
            required: [true, 'Price is mandatory'], // first is required=true, second is error in case it fails
        },
        priceDiscount: {
            type: Number,
            validate: {
                //this only points to current document on the NEW request, so it does not work on update
                validator: function (val) {
                    return val < this.price;
                },
                message:
                    "Price Discount {VALUE} can't be greater than the price itself",
            },
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a maximum group size'],
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Allowed values are: Easy, medium, and difficult',
            }, //only one of these value is allowed
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Minimum rating should be 1'],
            max: [5, 'Maximum rating can be 5'],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        summary: {
            type: String,
            trim: true, //trim will trim the starting and trailing whitespaces
            required: [true, 'A tour must have a summary'],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, 'An image cover is required'],
        },
        images: [String], //An Array of Strings
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
        secretTour: { type: Boolean, default: false },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

//MIDDLEWARES
//Document Middleware
tourSchema.pre('save', function (next) {
    // console.log('this ', this);
    next();
});

//Query Middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log('Query took', Date.now() - this.start, 'milliseconds');

    next();
});

//Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: {
            secretTour: { $ne: true },
        },
    });

    next();
});

//Model
const Tour = mongoose.model('Tour', tourSchema); //using upperCase for Model name as it is a convention
//Now we are going to use this model to create our document

module.exports = Tour;
