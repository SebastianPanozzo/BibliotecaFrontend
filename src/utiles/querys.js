export const appointmentQuery = [
    {
        "$match": {
            "type": "has_appointment"
        }
    },
    {
        "$addFields": {
            "objTo": {
                "$toObjectId": "$to"
            }
        }
    },
    {
        "$lookup": {
            "from": "events",
            "localField": "objTo",
            "foreignField": "_id",
            "pipeline": [
                {
                    "$addFields": {
                        "idStr": {
                            "$toString": "$_id"
                        }
                    }
                },
                {
                    "$lookup": {
                        "from": "relations",
                        "localField": "idStr",
                        "foreignField": "from",
                        "pipeline": [
                            {
                                "$match": {
                                    "type": "assigned_service"
                                }
                            },
                            {
                                "$addFields": {
                                    "toObj": {
                                        "$toObjectId": "$to"
                                    }
                                }
                            },
                            {
                                "$lookup": {
                                    "from": "objects",
                                    "localField": "toObj",
                                    "foreignField": "_id",
                                    "as": "service"
                                }
                            },
                            {
                                "$unwind": "$service"
                            },
                            {
                                "$project": {
                                    "_id": false,
                                    "service": {
                                        "_id": true,
                                        "name": true,
                                        "type": true,
                                        "image": true,
                                        "description": true,
                                        "props": {
                                            "duration": true,
                                            "price": true
                                        }
                                    }
                                }
                            }
                        ],
                        "as": "services"
                    }
                },
                {
                    "$project": {
                        "status": true,
                        "duration": true,
                        "services": "$services.service",
                        "createdAt": true
                    }
                }
            ],
            "as": "event"
        }
    },
    {
        "$unwind": "$event"
    },
    {
        "$project": {
            "_id": "$event._id",
            "status": "$event.status",
            "duration": "$event.duration",
            "createdAt": "$event.createdAt",
            "services": "$event.services"
        }
    }
]