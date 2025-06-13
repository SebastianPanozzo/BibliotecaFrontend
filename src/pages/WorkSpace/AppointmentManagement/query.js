export const appointmentsData = (selectedMonth = null, professional) => {
    const now = new Date();
    let startDate, endDate;

    if (selectedMonth) {
        // Si hay un mes seleccionado, obtener turnos de ese mes
        startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
        endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1);
    } else {
        // Por defecto, obtener turnos del mes actual
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    return [
        {
            "$addFields": {
                "objId": {
                    "$toObjectId": professional || "681811fde05125f00b993b0e"
                }
            }
        },
        {
            "$match": {
                "type": "spa_appointment",
                "$expr": {
                    "$and": [
                        {
                            "$eq": [
                                "$props.professional._id",
                                "$objId"
                            ]
                        },
                        {
                            "$gte": [
                                "$duration.start",
                                {
                                    "$dateFromString": {
                                        "dateString": startDate.toISOString()
                                    }
                                }
                            ]
                        },
                        {
                            "$lte": [
                                "$duration.end",
                                {
                                    "$dateFromString": {
                                        "dateString": endDate.toISOString()
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "tags",
                "foreignField": "email",
                "as": "user",
                "pipeline": [
                    {
                        "$project": {
                            "name": true,
                            "last_name": true,
                            "email": true
                        }
                    }
                ]
            }
        },
        {
            "$unwind": "$user"
        },
        {
            "$project": {
                "status": 1,
                "description": 1,
                "duration": 1,
                "createdAt": 1,
                "user": 1,
                "services": "$props.services",
                "professional": "$props.professional",
                "discount": "$props.discount"
            }
        }
    ]
};

