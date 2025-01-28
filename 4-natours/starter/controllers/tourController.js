const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

//ROUTE HANDLERS
exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = 'price,-ratingsAverage';
    req.query.fields = 'name,price,ratingsAverage,difficulty,duration';
    next();
};

exports.getAllTours = async function (req, res) {
    try {
        const feautres = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        //EXECUTE QUERY
        const tours = await feautres.query;

        //RETURN RESPONSE
        res.status(200).json({
            status: 'success',
            total: tours.length,
            data: { tours },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        //findById is similar to writing Tour.findOne({"_id": req.params.id}), basically a shorthand
        //But since mongoose gives us a helper function to directly use the findById method in case of finding by id

        res.status(200).json({
            status: 'Success',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Cannot find the tour with given id',
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: { tour: newTour },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err,
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        //findByIdAndUpdate takes id, and second param is what you want to update, then we are passing one more option
        //new: true, which returns the modified document rather than the original
        //runValidators: to check if the req.body schema meets our originla schema
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true, //the same validator will run again on update as well,as it does on create
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour: tour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: "Can't update the document as the id is wrong",
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Unable to delete',
        });
    }
};

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            { $match: { ratingsAverage: { $gte: 4.5 } } },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    totalRatings: { $sum: '$ratingsQuantity' },
                    totalTours: { $sum: 1 },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                },
            },
            { $sort: { avgPrice: 1 } },
        ]);

        res.status(200).json({
            status: 'success',
            data: { stats },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Some Error Occurred',
        });
    }
};

//A real world business problem where we are asked to show the busiest month like when the tour starts and all, so we can get a monthly plan
//We want to check how many tours start in a particular month
//We can then group the tours by those months
exports.getMonthlyPlan = async (req, res) => {
    const year = +req.params.year;
    try {
        const plan = await Tour.aggregate([
            { $unwind: '$startDates' }, //unwind the array into different documents according to the array values
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    totalTours: { $sum: 1 },
                    tours: { $push: '$name' },
                },
            },
            { $addFields: { month: '$_id' } },
            { $project: { _id: 0 } },
            { $sort: { totalTours: -1 } },
        ]);

        res.status(200).json({
            status: 'success',
            data: { plan },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Some error',
        });
    }
};
