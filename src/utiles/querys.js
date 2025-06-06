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

export const queryServices = [
    {
        "$lookup": {
            "from": "objecttypes",
            "localField": "type",
            "foreignField": "_id",
            "as": "object_type"
        }
    },
    {
        "$unwind": "$object_type"
    },
    {
        "$match": {
            "object_type.parent": "service"
        }
    },
    {
        "$project": {
            "name": true,
            "description": true,
            "image": true,
            "categorie": "$object_type.name",
            "props": true
        }
    }
]

export const queryTypeServices = (objectType) => {
    return [
        {
            "$match": {
                "_id": objectType
            }
        },
        {
            "$lookup": {
                "from": "objects",
                "localField": "_id",
                "foreignField": "type",
                "pipeline": [
                    {
                        "$project": {
                            "name": true,
                            "description": true,
                            "image": true,
                            "props": true
                        }
                    }
                ],
                "as": "services"
            }
        },
        {
            "$project": {
                "name": true,
                "description": true,
                "services": true
            }
        }
    ]
}

export const queryUserRoles = [
    {
        "$match": {
            "type": "has_role",
            "owner": "6819fccf6b483e8f69f3ca15"
        }
    },
    {
        "$addFields": {
            "fromObj": {
                "$toObjectId": "$from"
            },
            "toObj": {
                "$toObjectId": "$to"
            }
        }
    },
    {
        "$lookup": {
            "from": "users",
            "localField": "fromObj",
            "foreignField": "_id",
            "as": "user",
            "pipeline": [
                {
                    "$project": {
                        "name": true,
                        "last_name": true,
                        "email": true,
                        "image": true
                    }
                }
            ]
        }
    },
    {
        "$unwind": "$user"
    },
    {
        "$lookup": {
            "from": "objects",
            "localField": "toObj",
            "foreignField": "_id",
            "as": "role",
            "pipeline": [
                {
                    "$project": {
                        "name": true
                    }
                }
            ]
        }
    },
    {
        "$unwind": "$role"
    },
    {
        "$project": {
            "user": true,
            "role": "$role.name"
        }
    }
];

export const queryAdminServices = [
    {
        "$lookup": {
            "from": "objecttypes",
            "localField": "type",
            "foreignField": "_id",
            "as": "objectType"
        }
    },
    {
        "$unwind": "$objectType"
    },
    {
        "$match": {
            "owner": "6819fccf6b483e8f69f3ca15",
            "objectType.parent": "service"
        }
    },
    {
        "$project": {
            "name": true,
            "description": true,
            "image": true,
            "type": true,
            "props": true
        }
    }
]