const express = require('express');
const PropertyModel = require('../models/property-model');

// Get localhost:3000/api/property
router.get('/properties', (req, res, next) => {
    PropertyModel.find()
        .limit(20)
        .sort({_id: -1})
        .exec((err, recentProperties) => {
            if (err) {
                console.log("Error finding the property you were looking for", err);
                res.status(500).json({errorMessage: "Finding the properties went wrong 💩"});
                return;
            }
            res.status(200).json(recentProperties);
        });
});

// POST localhost:3000/api/properties
router.post('/properties', (req, res, next) => {
    const theProperty = new PropertyModel({
        name: req.body.propertyName,
        address: req.body.propertyAddress,
        image: req.body.propertyImage,
        area: req.body.propertyArea,
        user: req.user._id
    });

    theProperty.save((err) => {
        if (theProperty.errors) {
            res.status(400).json({
                errorMessage: 'Validation failed',
                validationErros: theProperty.errors
            });
            return;
        }

        if (err) {
            console.log('Error posting the new property', err);
            res.status(500).json({errorMessage: "New beer went wrong"});
            return;
        }
        res.status(200).json(theBeer);
    })
})

// GET localhost:3000/api/properties/ID
router.get('/properties/:propertyId', (req, res, next) => {
    PropertyModel.findById(
        req.params.propertyId,
        (err, propertyFromDb) => {
            if (err) {
                console.log('Property details ERROR', err);
                res.status(500).json({ errorMessage: "Beer details went wrong 💩"});
                return;
            }
            res.status(200).json(beerFromDb);
        }
    );
});

//PUT localhost:3000/api/properties/ID
router.put('/properties/:propertyId', (req, res, next) => {
    PropertyModel.findById(
        req.params.propertyId,
        (err, propertyFromDb) => {
            if (err) {
                console.log('Property details Error', err);
                res.status(500).json({errorMessage: 'Property details went wrong'});
                return;
            }

            propertyFromDb.set({
                name: req.body.propertyName,
                address: req.body.propertyAddress,
                image: req.body.propertyImage,
                area: req.body.propertyArea
            });

            propertyFromDb.save((err) => {
                if (beerFromDb.errors) {
                    res.status(400).json({
                        errorMessage: "update validation failed 💀",
                        validationErros: propertyFromDb.errors
                    });
                    return;
                }
                if (err) {
                    console.log('Property error update', err);
                    res.status(500).json({errorMessage: 'Property udate went wrong'});
                    return;
                }
                res.status(200).json(propertyFromDb);
            })
        }
    )
});

// DELETE/api/properties/ID
router.delete('/properties/:propertyId', (req, res, next) => {
    if (!req.user) {
        res.status(401).json({errorMessage: 'Not logged in'});
        return;
    }
    PropertyModel.findById(
        req.params.propertyId,
        (err, propertyFromDb) => {
            if (err) {
                console.log('Property owner confirm ERROR', err);
                res.status(500).json(
                    {errorMessage: "Property owner confirm wrong"}
                );
                return;
            }

            if (propertyFromDb.user.toString() !== req.user._id.toString()) {
                res.status(403).json({errorMessage: "This property is not yours 👹"});
                return;
            }

            PropertyModel.findOneAndRemove(
                req.params.propertyId,
                (err, propertyFromDb) => {
                    if (err) {
                        console.log('Property delete error', err);
                        res.status(500).json({errorMessage: "Property delete went wrong"});
                    }
                    res.status(200).json(propertyFromDb);
                }
            )
        }
    )
});

// GET/api/myproperties
router.get('/myproperties', (req, res, next) => {
    if(!req.user) {
        res.status(401).json({ errorMessage: "not logged in 💀"});
        return;
    }
    PropertyModel.find({user: req.user._id})
    .sort({_id: -1})
    .exec((err, myPropertyResults) => {
        if (err) {
            res.status(500).json(
                {errorMessage: "My items went wrong"}
            );
            return;
        }
        res.staus(200).json(myPropertyResults);
    })
})

module.exports = router;