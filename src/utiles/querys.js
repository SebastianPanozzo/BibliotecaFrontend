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
            "as": "event"
        }
    },
    {
        "$unwind": "$event"
    },
    {
        "$replaceRoot": {
            "newRoot": "$event"
        }
    },
    {
        "$project": {
            "status": 1,
            "duration": 1,
            "description": 1,
            "createdAt": 1,
            "services": "$props.services",
            "professional": "$props.professional",
            "discount": "$props.discount"
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
            /* "owner": "6819fccf6b483e8f69f3ca15" */
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

export const getProfessionals = (id) => {
    return [
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
                "as": "roles",
                "pipeline": [
                    {
                        "$match": {
                            "type": "has_role"
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
                            "as": "role"
                        }
                    },
                    {
                        "$unwind": "$role"
                    },
                    {
                        "$match": {
                            "role.name": "Profesional",
                            "owner": id
                        }
                    }
                ]
            }
        },
        {
            "$match": {
                "$expr": {
                    "$gt": [
                        {
                            "$size": "$roles"
                        },
                        0
                    ]
                }
            }
        },
        {
            "$project": {
                "name": true,
                "last_name": true
            }
        }
    ]
}

export const getAppointments = (start, end, profesional) => {
    return [
        {
            "$match": {
                "type": "spa_appointment",
                "$expr": {
                    "$and": [
                        {
                            "$gte": [
                                "$duration.start",
                                {
                                    "$dateFromString": {
                                        "dateString": start
                                    }
                                }
                            ]
                        },
                        {
                            "$lte": [
                                "$duration.end",
                                {
                                    "$dateFromString": {
                                        "dateString": end
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        },
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
                "foreignField": "to",
                "as": "assigned_to",
                "pipeline": [
                    {
                        "$match": {
                            "type": "assigned_to"
                        }
                    }
                ]
            }
        },
        {
            "$unwind": "$assigned_to"
        },
        {
            "$match": {
                "assigned_to": {
                    "$exists": true
                },
                "assigned_to.from": profesional
            }
        },
        {
            "$project": {
                "start": "$duration.start",
                "end": "$duration.end"
            }
        }
    ]
}