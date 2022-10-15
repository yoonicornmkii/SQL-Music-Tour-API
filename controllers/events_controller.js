// DEPENDENCIES
const events = require('express').Router()
const db = require('../models')
const { Event, MeetGreet, SetTime, Band, Stage } = db 
const { Op } = require('sequelize')

// FIND ALL EVENTS
events.get('/:event', async (req, res) => {
    try {
        const foundEvents = await Event.findAll({
            order: [ [ 'date', 'ASC' ] ],
            where: { name: req.params.event },
            include: [
                {
                    model: SetTime,
                    as: "set_times",
                    attributes: { exclude: ["event_id", "band_id"] },
                    include: [{
                        model: Band,
                        as: "band"
                    }, {
                        model: Stage, as: "stage"
                    }
                   ]
                },
                {
                    model: Stage,
                    as: "stages",
                    through: { attributes: [] }
                },

                {
                  model: MeetGreet,
                  as: "meet_greets",
                  include: {
                    model: Band, as: 'band'
                  }
                }

            ]
            }) 
        res.status(200).json(foundEvents)
    } catch (error) {
        console.log('Errr', error)
        res.status(500).json(error)
    }
})

// FIND A SPECIFIC EVENT
events.get('/:id', async (req, res) => {
    try {
        const foundEvent = await Event.findOne({
            where: { event_id: req.params.id }
        })
        res.status(200).json(foundEvent)
    } catch (error) {
        res.status(500).json(error)
    }
})

// CREATE AN EVENT
events.post('/', async (req, res) => {
    try {
        const newEvent = await Event.create(req.body)
        res.status(200).json({
            message: 'Successfully inserted a new event',
            data: newEvent
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// UPDATE AN EVENT
events.put('/:id', async (req, res) => {
    try {
        const updatedEvents = await Event.update(req.body, {
            where: {
                event_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully updated ${updatedEvents} event(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// DELETE AN EVENT
events.delete('/:id', async (req, res) => {
    try {
        const deletedEvents = await Event.destroy({
            where: {
                event_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully deleted ${deletedEvents} event(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// EXPORT
module.exports = events