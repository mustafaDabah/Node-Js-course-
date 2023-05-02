const mongoose =  require('mongoose');
const Tour =  require('./tourModule');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required:[true , 'Review must be belong to tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:[true , 'Review must be belong to user']
    }

},{
        toJSON:{virtuals: true},
        toObject:{virtuals: true}
    }
)

console.log('After defining reviewSchema, before creating index');

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

console.log('Index created for reviewSchema');

reviewSchema.pre(/^find/ , function(next) {
    // this.populate({
    //   path: 'tour',
    //   select: 'name'
    // })
    // .populate({
    //     path: 'user',
    //     select: 'name photo'
    // })
    this.populate({
        path: 'user',
        select: 'name photo'
    })
  
    next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: {tour: tourId}
        },
        {
            $group: {
                _id: '$tour',
                nRating: {$sum: 1},
                avgRating: {$avg: '$rating'}
            }
        }
    ])

   if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
        ratingQuantity:stats[0].nRating ,
        ratingAverage:stats[0].avgRating 
    })
   } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingQuantity:0,
            ratingAverage:4.5 
        })
   }
    // console.log(stats)
}

reviewSchema.post('save', function() {
    this.constructor.calcAverageRatings(this.tour);
});

// reviewSchema.pre(/^findOneAnd/ , async function(next) {
//     const filter = this.getQuery();
//     this.currentUpdateReview = await this.model.findOne(filter);

//     console.log(`the current document${this.currentUpdateReview}`);

//     console.log('find current review')
//     next();
// })

// reviewSchema.post(/^findOneAnd/, async function() {
//     // await this.findOne(); does NOT work here, query has already executed
//     await this.currentUpdateReview.constructor.calcAverageRatings(this.currentUpdateReview.tour);
//     console.log('update the review')
// });

reviewSchema.post(/^findOneAnd/, async function (doc) {
    await this.model.calcAverageRatings(doc.tour);
});

// reviewSchema.post('remove', async function() {
//     // await this.findOne(); does NOT work here, query has already executed
//     await this.currentUpdateReview.constructor.calcAverageRatings(this.currentUpdateReview.tour);

//     console.log('remove')
// });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;